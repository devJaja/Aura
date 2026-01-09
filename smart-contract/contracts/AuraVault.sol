// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC4626} from "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {IStrategy} from "./interfaces/IStrategy.sol";

/**
 * @title AuraVault
 * @author AURA Protocol
 * @notice This contract is the central treasury for the AURA protocol.
 * It implements the ERC-4626 standard for tokenized vaults, allowing users
 * to deposit a single underlying stablecoin and receive vault shares in return.
 * This initial version supports a single asset, with plans to expand.
 */
contract AuraVault is ERC4626, Ownable, Pausable {
    // --- State Variables ---

    // List of all active strategies
    IStrategy[] public strategies;
    // Mapping to check if a strategy is active
    mapping(address => bool) public isStrategy;

    // --- Constructor ---

    /**
     * @notice Constructs the AuraVault.
     * @param _asset The ERC20 token that will be deposited into the vault.
     * @param _name The name of the vault's share token.
     * @param _symbol The symbol of the vault's share token.
     */
    constructor(
        IERC20 _asset,
        string memory _name,
        string memory _symbol
    ) ERC4626(_asset) ERC20(_name, _symbol) Ownable(msg.sender) {}

    // --- Core Functions (Overrides) ---

    /**
     * @notice Overrides the totalAssets function to include assets held in strategies.
     * @return The total amount of underlying assets managed by the vault.
     */
    function totalAssets() public view override returns (uint256) {
        uint256 totalStrategyAssets = 0;
        for (uint i = 0; i < strategies.length; i++) {
            totalStrategyAssets += strategies[i].totalAssets();
        }
        return super.totalAssets() + totalStrategyAssets;
    }

    /**
     * @notice A public function to deposit assets. Overrides the internal one to add custom logic.
     * @dev Future logic for routing to strategies will be added here.
     */
    function deposit(
        uint256 assets,
        address receiver
    ) public override whenNotPaused returns (uint256) {
        uint256 shares = super.deposit(assets, receiver);
        // For now, delegate all new deposits to the first strategy
        if (strategies.length > 0) {
            IERC20(asset()).approve(address(strategies[0]), assets);
            strategies[0].invest(assets);
        }
        return shares;
    }

    /**
     * @notice A public function to withdraw assets. Overrides the internal one to add custom logic.
     * @dev Future logic for pulling from strategies will be added here.
     */
    function withdraw(
        uint256 assets,
        address receiver,
        address owner
    ) public override whenNotPaused returns (uint256) {
        uint256 vaultBalance = IERC20(asset()).balanceOf(address(this));
        if (vaultBalance < assets) {
            uint256 needed = assets - vaultBalance;
            // Pull from strategies in reverse order
            for (uint i = strategies.length; i > 0; i--) {
                uint256 fromStrategy = strategies[i-1].withdraw(needed);
                needed -= fromStrategy;
                if (needed == 0) break;
            }
        }
        return super.withdraw(assets, receiver, owner);
    }

    /**
     * @notice A public function to redeem shares for assets. Overrides the internal one to add custom logic.
     * @dev Future logic for pulling from strategies will be added here.
     */
    function redeem(
        uint256 shares,
        address receiver,
        address owner
    ) public override whenNotPaused returns (uint256) {
        uint256 assets = previewRedeem(shares);
        uint256 vaultBalance = IERC20(asset()).balanceOf(address(this));
        if (vaultBalance < assets) {
            uint256 needed = assets - vaultBalance;
             // Pull from strategies in reverse order
            for (uint i = strategies.length; i > 0; i--) {
                uint256 fromStrategy = strategies[i-1].withdraw(needed);
                needed -= fromStrategy;
                if (needed == 0) break;
            }
        }
        return super.redeem(shares, receiver, owner);
    }

    // --- Strategy Management ---

    /**
     * @notice Adds a new strategy contract to the vault.
     * @dev Only the owner can add strategies.
     * @param _strategy The address of the strategy contract to add.
     */
    function addStrategy(IStrategy _strategy) external onlyOwner {
        require(address(_strategy) != address(0), "Strategy address cannot be zero");
        require(!isStrategy[address(_strategy)], "Strategy already exists");
        require(_strategy.vault() == address(this), "Strategy not linked to this vault");
        
        isStrategy[address(_strategy)] = true;
        strategies.push(_strategy);
    }

    /**
     * @notice Removes a strategy contract from the vault.
     * @dev Only the owner can remove strategies. The strategy must have no assets.
     * @param _strategy The address of the strategy contract to remove.
     */
    function removeStrategy(IStrategy _strategy) external onlyOwner {
        require(isStrategy[address(_strategy)], "Strategy not found");
        require(_strategy.totalAssets() == 0, "Withdraw assets from strategy first");

        isStrategy[address(_strategy)] = false;

        for (uint i = 0; i < strategies.length; i++) {
            if (strategies[i] == _strategy) {
                strategies[i] = strategies[strategies.length - 1];
                strategies.pop();
                break;
            }
        }
    }

    // --- Profit Distribution ---

    /**
     * @notice Called by a strategy contract to report profits back to the vault.
     * @dev The profits are added to the vault's total assets, increasing the value of shares.
     * @param _profitAmount The amount of profit to report.
     */
    function reportProfit(uint256 _profitAmount) external whenNotPaused {
        require(isStrategy[msg.sender], "Not a registered strategy");

        // The ERC4626 standard inherently handles profit distribution. By simply transferring
        // the profit (_profitAmount) of the underlying asset to this vault contract,
        // the total assets of the vault increase, which in turn increases the value of each share.
        // The strategy contract must transfer the underlying asset to this vault.
        require(
            IERC20(asset()).transferFrom(
                msg.sender,
                address(this),
                _profitAmount
            ),
            "Profit transfer failed"
        );
    }

    // --- Security Measures ---

    /**
     * @notice Pauses all major functions of the vault.
     * @dev This is an emergency function to be used in case of a vulnerability.
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpauses the vault.
     * @dev Only the owner can unpause.
     */
    function unpause() external onlyOwner {
        _unpause();
    }
}

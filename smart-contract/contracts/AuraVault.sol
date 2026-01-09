// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AuraVault
 * @author AURA Protocol
 * @notice This contract is the central treasury for the AURA protocol.
 * It implements the ERC-4626 standard for tokenized vaults, allowing users
 * to deposit a single underlying stablecoin and receive vault shares in return.
 * This initial version supports a single asset, with plans to expand.
 */
contract AuraVault is ERC4626, Ownable {
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

    // --- State Variables ---

    // Mapping to hold different strategy contracts
    // mapping(address => IStrategy) public strategies;

    // --- Core Functions ---

    /**
     * @notice A public function to deposit assets. Overrides the internal one to add custom logic.
     * @dev Future logic for routing to strategies will be added here.
     */
    function deposit(uint256 assets, address receiver) public override returns (uint256) {
        // TODO: Add logic to allocate assets to different strategies
        return super.deposit(assets, receiver);
    }

    /**
     * @notice A public function to withdraw assets. Overrides the internal one to add custom logic.
     * @dev Future logic for pulling from strategies will be added here.
     */
    function withdraw(
        uint256 assets,
        address receiver,
        address owner
    ) public override returns (uint256) {
        // TODO: Add logic to pull assets from different strategies
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
    ) public override returns (uint256) {
        // TODO: Add logic to pull assets from different strategies
        return super.redeem(shares, receiver, owner);
    }

    // --- Strategy Management ---

    /**
     * @notice Adds a new strategy contract to the vault.
     * @dev Only the owner can add strategies.
     * @param _strategy The address of the strategy contract to add.
     */
    function addStrategy(address _strategy) external onlyOwner {
        // TODO: Implement strategy registration
        // require(_strategy != address(0), "Strategy address cannot be zero");
        // strategies[_strategy] = IStrategy(_strategy);
    }

    /**
     * @notice Removes a strategy contract from the vault.
     * @dev Only the owner can remove strategies.
     * @param _strategy The address of the strategy contract to remove.
     */
    function removeStrategy(address _strategy) external onlyOwner {
        // TODO: Implement strategy removal, ensuring all capital is withdrawn first.
        // require(strategies[_strategy] != IStrategy(address(0)), "Strategy not found");
        // delete strategies[_strategy];
    }


    // --- Profit Distribution ---

    /**
     * @notice Called by a strategy contract to report profits back to the vault.
     * @dev The profits are added to the vault's total assets, increasing the value of shares.
     * @param _profitAmount The amount of profit to report.
     */
    function reportProfit(uint256 _profitAmount) external {
        // TODO: Add security checks to ensure only registered strategies can call this.
        // require(strategies[msg.sender] != IStrategy(address(0)), "Not a registered strategy");

        // The ERC4626 standard inherently handles profit distribution. By simply transferring
        // the profit (_profitAmount) of the underlying asset to this vault contract,
        // the total assets of the vault increase, which in turn increases the value of each share.
        // The strategy contract must transfer the underlying asset to this vault.
        require(IERC20(address(asset)).transferFrom(msg.sender, address(this), _profitAmount), "Profit transfer failed");
    }


    // --- Security Measures (from README) ---

    // The ERC4626 implementation from OpenZeppelin includes reentrancy guards.
    // Ownable provides access controls.

    /**
     * @notice Pauses all major functions of the vault.
     * @dev This is an emergency function to be used in case of a vulnerability.
     */
    function pause() external onlyOwner {
        // TODO: Implement pausable functionality using OpenZeppelin's Pausable utility.
    }

    /**
     * @notice Unpauses the vault.
     * @dev Only the owner can unpause.
     */
    function unpause() external onlyOwner {
        // TODO: Implement pausable functionality.
    }

}

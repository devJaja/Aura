// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockERC20
 * @author AURA Protocol (for testing)
 * @notice A simple ERC20 token for testing purposes.
 * It includes a public `mint` function that can be called by anyone.
 */
contract MockERC20 is ERC20, Ownable {
    constructor(
        string memory name,
        string memory symbol,
        uint8 decimals_
    ) ERC20(name, symbol) Ownable(msg.sender) {
        _setupDecimals(decimals_);
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}

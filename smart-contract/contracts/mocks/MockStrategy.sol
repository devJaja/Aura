// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {IStrategy} from "../interfaces/IStrategy.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract MockStrategy is IStrategy, Ownable {
    address public immutable asset;
    address public immutable vault;

    uint256 public totalAssetsInvested;

    constructor(address _asset, address _vault) Ownable(msg.sender) {
        asset = _asset;
        vault = _vault;
    }

    function invest(uint256 _amount) external override {
        require(msg.sender == vault, "Only vault can invest");
        totalAssetsInvested += _amount;
        IERC20(asset).transferFrom(msg.sender, address(this), _amount);
    }

    function withdraw(uint256 _amount) external override returns (uint256) {
        require(msg.sender == vault, "Only vault can withdraw");
        uint256 amountToWithdraw = _amount > totalAssetsInvested
            ? totalAssetsInvested
            : _amount;
        totalAssetsInvested -= amountToWithdraw;
        IERC20(asset).transfer(vault, amountToWithdraw);
        return amountToWithdraw;
    }

    function totalAssets() external view override returns (uint256) {
        return totalAssetsInvested + IERC20(asset).balanceOf(address(this));
    }

    function vault() external view override returns (address) {
        return vault;
    }
}

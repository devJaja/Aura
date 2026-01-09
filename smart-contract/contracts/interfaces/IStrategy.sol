// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

/**
 * @title IStrategy
 * @author AURA Protocol
 * @notice Interface for all strategy contracts that can be integrated with the AuraVault.
 * A strategy is an automated process that takes deposited assets and invests them
 * to generate yield.
 */
interface IStrategy {
    /**
     * @notice Invests a given amount of the underlying asset.
     * @dev This function is called by the vault to allocate assets to the strategy.
     * The strategy must pull the assets from the vault.
     * @param _amount The amount of the underlying asset to invest.
     */
    function invest(uint256 _amount) external;

    /**
     * @notice Withdraws a given amount of the underlying asset from the strategy.
     * @dev This function is called by the vault to pull assets back from the strategy
     * to cover user withdrawals or to rebalance capital.
     * @param _amount The amount of the underlying asset to withdraw.
     * @return The amount of assets successfully withdrawn.
     */
    function withdraw(uint256 _amount) external returns (uint256);

    /**
     * @notice Reports the total amount of assets managed by the strategy.
     * @dev This includes both the invested capital and any generated profits.
     * @return The total value of assets (in terms of the underlying asset) held by the strategy.
     */
    function totalAssets() external view returns (uint256);

    /**
     * @notice The vault that this strategy is connected to.
     * @return The address of the AuraVault contract.
     */
    function vault() external view returns (address);
}

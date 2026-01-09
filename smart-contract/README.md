# AuraVault Smart Contract

This project contains the smart contracts for the Aura Protocol, a decentralized yield aggregator. The core of the protocol is the `AuraVault` contract, which is an ERC4626 tokenized vault that allows users to deposit a single underlying asset and receive vault shares in return. The vault then invests the deposited assets into various yield-generating strategies to earn returns for the users.

## Project Overview

The `AuraVault` contract is built on top of the following standards and features:

- **ERC4626 Tokenized Vault:** The contract implements the [EIP-4626](https://eips.ethereum.org/EIPS/eip-4626) standard, which provides a standard API for tokenized vaults. This allows for easy integration with other DeFi protocols.
- **Strategy Management:** The vault can manage multiple yield-generating strategies. The owner of the vault can add and remove strategies. When users deposit assets, the vault delegates the assets to the registered strategies to be invested.
- **Pausable:** The contract inherits from OpenZeppelin's `Pausable` contract, which allows the owner to pause all major functions of the vault in case of an emergency.
- **Ownable:** The contract inherits from OpenZeppelin's `Ownable` contract, which provides a simple access control mechanism. Only the owner of the contract can perform sensitive operations like adding strategies or pausing the contract.

## Usage

### Compiling the Contracts

To compile the contracts, run the following command:

```shell
npx hardhat compile
```

### Running Tests

The project includes a comprehensive test suite for the `AuraVault` contract. To run the tests, execute the following command:

```shell
npx hardhat test
```

The tests cover the following functionalities:

- Deposits and withdrawals.
- Pausable functionality.
- Strategy management.
- Profit reporting.

### Deployment

The project is configured to be deployed on various networks, including a local Hardhat network and the Sepolia testnet. The deployment scripts are located in the `ignition/modules` directory.

To deploy the contracts to a local Hardhat network, you can run:

```shell
npx hardhat ignition deploy ignition/modules/AuraVault.ts
```

To deploy to a public network like Sepolia, you need to configure your network settings and private keys in the `hardhat.config.ts` file.
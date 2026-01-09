import hre from "hardhat";
import { expect } from "chai";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { BigNumberish, Contract, ContractFactory } from "ethers";
import { AuraVault } from "../typechain-types";

describe("AuraVault", function () {

    let AuraVault: ContractFactory;
    let vault: AuraVault;
    let underlyingToken: Contract;
    let owner: HardhatEthersSigner, user1: HardhatEthersSigner, user2: HardhatEthersSigner;
    let initialBalance: BigNumberish;

    beforeEach(async function () {
        initialBalance = ethers.parseUnits("1000", 18);
        [owner, user1, user2] = await ethers.getSigners();

        // Deploy a mock ERC20 token
        const MockERC20 = await ethers.getContractFactory("MockERC20", owner);
        underlyingToken = await MockERC20.deploy("Mock Token", "MTKN");
        const underlyingAddress = await underlyingToken.getAddress();

        // Distribute tokens to users
        await underlyingToken.mint(user1.address, initialBalance);
        await underlyingToken.mint(user2.address, initialBalance);

        // Deploy the AuraVault
        AuraVault = await ethers.getContractFactory("AuraVault", owner);
        vault = await AuraVault.deploy(underlyingAddress, "Aura Vault Token", "AVT");
        await vault.waitForDeployment();
    });

    describe("Deployment", function () {
        it("should set the correct underlying asset", async function () {
            expect(await vault.asset()).to.equal(await underlyingToken.getAddress());
        });

        it("should set the correct name and symbol", async function () {
            expect(await vault.name()).to.equal("Aura Vault Token");
            expect(await vault.symbol()).to.equal("AVT");
        });

        it("should set the owner correctly", async function () {
            expect(await vault.owner()).to.equal(owner.address);
        });
    });

    describe("Deposits and Withdrawals", function () {
        beforeEach(async function () {
            const depositAmount = ethers.parseUnits("100", 18);
            await underlyingToken.connect(user1).approve(await vault.getAddress(), depositAmount);
            await vault.connect(user1).deposit(depositAmount, user1.address);
        });

        it("should handle deposits correctly", async function () {
            const depositAmount = ethers.parseUnits("100", 18);
            // Check vault balance
            expect(await vault.totalAssets()).to.equal(depositAmount);
            // Check user shares
            expect(await vault.balanceOf(user1.address)).to.equal(depositAmount);
        });

        it("should handle withdrawals correctly", async function () {
            const initialVaultAssets = await vault.totalAssets();
            const withdrawAmount = ethers.parseUnits("50", 18);

            await vault.connect(user1).withdraw(withdrawAmount, user1.address, user1.address);

            // Check vault balance
            expect(await vault.totalAssets()).to.equal(initialVaultAssets - withdrawAmount);
            // Check user's underlying token balance
            const expectedUserBalance = initialBalance - withdrawAmount;
            expect(await underlyingToken.balanceOf(user1.address)).to.equal(expectedUserBalance);
        });

        it("should handle redeem correctly", async function () {
            const initialShares = await vault.balanceOf(user1.address);
            const redeemShares = ethers.parseUnits("50", 18);

            await vault.connect(user1).redeem(redeemShares, user1.address, user1.address);

             // Check user shares
            expect(await vault.balanceOf(user1.address)).to.equal(initialShares - redeemShares);
            // Check user's underlying token balance
            const expectedUserBalance = initialBalance - redeemShares;
            expect(await underlyingToken.balanceOf(user1.address)).to.equal(expectedUserBalance);
        });
    });

    // Placeholder for profit reporting tests
    describe("Profit Reporting", function() {
        it("should correctly account for profits reported by a strategy", async function() {
            // This test will require a mock strategy contract.
            // 1. A user deposits into the vault.
            // 2. Vault transfers funds to the strategy.
            // 3. Strategy simulates a profit and transfers it back to the vault.
            // 4. The value of vault shares should increase.
            expect(true).to.be.true; // Placeholder
        });
    });

});

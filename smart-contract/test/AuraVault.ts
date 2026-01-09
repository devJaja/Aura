import hre from "hardhat";
import { expect } from "chai";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { AuraVault, MockERC20, MockStrategy } from "../typechain-types";

describe("AuraVault", function () {
  let vault: AuraVault;
  let underlyingToken: MockERC20;
  let strategy: MockStrategy;
  let owner: HardhatEthersSigner, user1: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, user1] = await hre.ethers.getSigners();

    const MockERC20 = await hre.ethers.getContractFactory("MockERC20");
    underlyingToken = await MockERC20.deploy("Mock Token", "MTKN");
    const underlyingAddress = await underlyingToken.getAddress();

    const AuraVault = await hre.ethers.getContractFactory("AuraVault");
    vault = await AuraVault.deploy(underlyingAddress, "Aura Vault Token", "AVT");
    const vaultAddress = await vault.getAddress();

    const MockStrategy = await hre.ethers.getContractFactory("MockStrategy");
    strategy = await MockStrategy.deploy(underlyingAddress, vaultAddress);

    await underlyingToken.mint(user1.address, hre.ethers.parseUnits("1000", 18));
  });

  describe("Pausable", function () {
    it("should not allow deposits when paused", async function () {
      await vault.pause();
      const amount = hre.ethers.parseUnits("100", 18);
      await underlyingToken.connect(user1).approve(await vault.getAddress(), amount);
      await expect(vault.connect(user1).deposit(amount, user1.address)).to.be.revertedWithCustomError(vault, "EnforcedPause");
    });

    it("should allow deposits when unpaused", async function () {
      await vault.pause();
      await vault.unpause();
      const amount = hre.ethers.parseUnits("100", 18);
      await underlyingToken.connect(user1).approve(await vault.getAddress(), amount);
      await expect(vault.connect(user1).deposit(amount, user1.address)).to.not.be.reverted;
    });
  });

  describe("Strategy Management", function () {
    it("should allow owner to add a strategy", async function () {
      await expect(vault.addStrategy(await strategy.getAddress())).to.not.be.reverted;
      expect(await vault.isStrategy(await strategy.getAddress())).to.be.true;
      expect(await vault.strategies(0)).to.equal(await strategy.getAddress());
    });

    it("should not allow non-owner to add a strategy", async function () {
      await expect(vault.connect(user1).addStrategy(await strategy.getAddress())).to.be.revertedWithCustomError(vault, "OwnableUnauthorizedAccount");
    });

    it("should allow owner to remove a strategy", async function () {
        await vault.addStrategy(await strategy.getAddress());
        await expect(vault.removeStrategy(await strategy.getAddress())).to.not.be.reverted;
        expect(await vault.isStrategy(await strategy.getAddress())).to.be.false;
      });
  });

  describe("Deposit and Withdraw with Strategy", function () {
    beforeEach(async function() {
        await vault.addStrategy(await strategy.getAddress());
    });

    it("should invest assets into the strategy on deposit", async function () {
      const amount = hre.ethers.parseUnits("100", 18);
      await underlyingToken.connect(user1).approve(await vault.getAddress(), amount);
      await vault.connect(user1).deposit(amount, user1.address);
      
      expect(await strategy.totalAssets()).to.equal(amount);
      expect(await underlyingToken.balanceOf(await strategy.getAddress())).to.equal(amount);
    });

    it("should withdraw assets from the strategy", async function () {
        const depositAmount = hre.ethers.parseUnits("200", 18);
        await underlyingToken.connect(user1).approve(await vault.getAddress(), depositAmount);
        await vault.connect(user1).deposit(depositAmount, user1.address);

        const withdrawAmount = hre.ethers.parseUnits("50", 18);
        await vault.connect(user1).withdraw(withdrawAmount, user1.address, user1.address);
        
        const expectedStrategyAssets = depositAmount - withdrawAmount;
        expect(await strategy.totalAssets()).to.equal(expectedStrategyAssets);
    });
  });

  describe("Profit Reporting", function () {
    it("should not allow non-strategy to report profit", async function () {
        await expect(vault.connect(user1).reportProfit(100)).to.be.revertedWith("Not a registered strategy");
    });
  });

});

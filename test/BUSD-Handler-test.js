// SPDX-License-Identifier: UNLICENSED

const { ethers } = require("hardhat");
const { expect } = require("chai");


describe("BUSDHandler", () => {
  let BUSDHandler;
  let busdHandler;
  let owner;
  let recipient;
  let busdToken;

  beforeEach(async () => {
    [owner, recipient] = await ethers.getSigners();

    // Deploy a mock ERC20 token for testing
    const MockToken = await ethers.getContractFactory("MockToken");
    busdToken = await MockToken.deploy();

    // Transfer some tokens to the BUSDHandler contract for testing
    const transferAmount = ethers.utils.parseUnits("100", "18");
    await busdToken.transfer(owner.address, transferAmount);

    // Deploy the BUSDHandler contract
    BUSDHandler = await ethers.getContractFactory("BUSDHandler");
    busdHandler = await BUSDHandler.deploy(busdToken.address);
  });

  describe("Deployment", () => {
    it("should set the correct owner", async () => {
      expect(await busdHandler.owner()).to.equal(owner.address);
    });

    it("should set the correct busdToken address", async () => {
      expect(await busdHandler.busdToken()).to.equal(busdToken.address);
    });
  });

  describe("Function: forwardBUSD", () => {
    it("should forward BUSD tokens to the specified recipient", async () => {
      const recipientBalanceBefore = await busdToken.balanceOf(recipient.address);
      const transferAmount = ethers.utils.parseUnits("10", "18");

      await busdHandler.connect(owner).forwardBUSD(recipient.address, transferAmount);

      const recipientBalanceAfter = await busdToken.balanceOf(recipient.address);
      expect(recipientBalanceAfter).to.equal(recipientBalanceBefore.add(transferAmount));
    });

    it("should revert if called by a non-owner", async () => {
      const transferAmount = ethers.utils.parseUnits("10", "18");

      await expect(busdHandler.connect(recipient).forwardBUSD(recipient.address, transferAmount))
        .to.be.revertedWith("You are not the owner");
    });

    it("should revert if the recipient address is invalid", async () => {
      const transferAmount = ethers.utils.parseUnits("10", "18");

      await expect(busdHandler.connect(owner).forwardBUSD(ethers.constants.AddressZero, transferAmount))
        .to.be.revertedWith("Invalid recipient address");
    });

    it("should revert if the amount to forward is zero", async () => {
      await expect(busdHandler.connect(owner).forwardBUSD(recipient.address, 0))
        .to.be.revertedWith("Amount must be greater than zero");
    });

    it("should emit a Transfer event", async () => {
      const transferAmount = ethers.utils.parseUnits("10", "18");

      await expect(busdHandler.connect(owner).forwardBUSD(recipient.address, transferAmount))
        .to.emit(busdHandler, "Transfer")
        .withArgs(recipient.address, transferAmount);
    });
  });

  describe("Function: receiveBUSD", () => {
    it("should allow the contract to receive BUSD tokens", async () => {
      const transferAmount = ethers.utils.parseUnits("10", "18");

      await busdToken.connect(owner).transfer(busdHandler.address, transferAmount);

      const contractBalance = await busdToken.balanceOf(busdHandler.address);
      expect(contractBalance).to.equal(transferAmount);
    });

    it("should revert if called by a contract other than the BUSD token", async () => {
      const transferAmount = ethers.utils.parseUnits("10", "18");

      await expect(busdHandler.connect(recipient).receiveBUSD(transferAmount))
        .to.be.revertedWith("Only BUSD token contract can call this");
    });
  });
});

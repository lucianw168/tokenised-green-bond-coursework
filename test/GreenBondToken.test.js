const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("GreenBondToken", function () {
  // ── Shared fixture ────────────────────────────────────────────
  async function deployFixture() {
    const [owner, investorA, investorB, unapproved] = await ethers.getSigners();

    const TOKEN_NAME = "HK Green Bond Token";
    const TOKEN_SYMBOL = "HKGBT";
    const MATURITY = Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60;

    const GreenBondToken = await ethers.getContractFactory("GreenBondToken");
    const bond = await GreenBondToken.deploy(
      TOKEN_NAME,
      TOKEN_SYMBOL,
      MATURITY,
      owner.address
    );

    const MINT_AMOUNT = ethers.parseEther("1000");

    return {
      bond,
      owner,
      investorA,
      investorB,
      unapproved,
      TOKEN_NAME,
      TOKEN_SYMBOL,
      MATURITY,
      MINT_AMOUNT,
    };
  }

  // ── Deployment ────────────────────────────────────────────────
  describe("Deployment", function () {
    it("should set correct token name, symbol, and owner", async function () {
      const { bond, owner, TOKEN_NAME, TOKEN_SYMBOL } = await loadFixture(deployFixture);
      expect(await bond.name()).to.equal(TOKEN_NAME);
      expect(await bond.symbol()).to.equal(TOKEN_SYMBOL);
      expect(await bond.owner()).to.equal(owner.address);
    });
  });

  // ── Test 1: Only owner can whitelist ──────────────────────────
  describe("Whitelist – access control", function () {
    it("should allow owner to add an investor to the whitelist", async function () {
      const { bond, investorA } = await loadFixture(deployFixture);
      await bond.addToWhitelist(investorA.address);
      expect(await bond.whitelisted(investorA.address)).to.be.true;
    });

    it("should revert when non-owner tries to whitelist", async function () {
      const { bond, investorA, investorB } = await loadFixture(deployFixture);
      await expect(
        bond.connect(investorA).addToWhitelist(investorB.address)
      ).to.be.revertedWithCustomError(bond, "OwnableUnauthorizedAccount");
    });
  });

  // ── Test 2: Only owner can mint ───────────────────────────────
  describe("Mint – access control", function () {
    it("should allow owner to mint to a whitelisted address", async function () {
      const { bond, investorA, MINT_AMOUNT } = await loadFixture(deployFixture);
      await bond.addToWhitelist(investorA.address);
      await bond.mint(investorA.address, MINT_AMOUNT);
      expect(await bond.balanceOf(investorA.address)).to.equal(MINT_AMOUNT);
    });

    it("should revert when non-owner tries to mint", async function () {
      const { bond, investorA, MINT_AMOUNT } = await loadFixture(deployFixture);
      await bond.addToWhitelist(investorA.address);
      await expect(
        bond.connect(investorA).mint(investorA.address, MINT_AMOUNT)
      ).to.be.revertedWithCustomError(bond, "OwnableUnauthorizedAccount");
    });

    it("should revert when minting to a non-whitelisted address", async function () {
      const { bond, unapproved, MINT_AMOUNT } = await loadFixture(deployFixture);
      await expect(
        bond.mint(unapproved.address, MINT_AMOUNT)
      ).to.be.revertedWithCustomError(bond, "NotWhitelisted");
    });
  });

  // ── Test 3: Transfer to non-whitelisted address fails ────────
  describe("Restricted transfer – non-whitelisted recipient fails", function () {
    it("should revert transfer to a non-whitelisted address", async function () {
      const { bond, investorA, unapproved, MINT_AMOUNT } =
        await loadFixture(deployFixture);
      await bond.addToWhitelist(investorA.address);
      await bond.mint(investorA.address, MINT_AMOUNT);

      await expect(
        bond.connect(investorA).transfer(unapproved.address, ethers.parseEther("100"))
      ).to.be.revertedWithCustomError(bond, "NotWhitelisted");
    });
  });

  // ── Test 4: Transfer between whitelisted addresses succeeds ──
  describe("Restricted transfer – whitelisted recipient succeeds", function () {
    it("should allow transfer between two whitelisted addresses", async function () {
      const { bond, investorA, investorB, MINT_AMOUNT } =
        await loadFixture(deployFixture);
      await bond.addToWhitelist(investorA.address);
      await bond.addToWhitelist(investorB.address);
      await bond.mint(investorA.address, MINT_AMOUNT);

      const transferAmount = ethers.parseEther("200");
      await bond.connect(investorA).transfer(investorB.address, transferAmount);

      expect(await bond.balanceOf(investorB.address)).to.equal(transferAmount);
      expect(await bond.balanceOf(investorA.address)).to.equal(
        MINT_AMOUNT - transferAmount
      );
    });
  });

  // ── Test 5: Pause blocks transfers ────────────────────────────
  describe("Pause – transfers blocked", function () {
    it("should revert transfers when contract is paused", async function () {
      const { bond, investorA, investorB, MINT_AMOUNT } =
        await loadFixture(deployFixture);
      await bond.addToWhitelist(investorA.address);
      await bond.addToWhitelist(investorB.address);
      await bond.mint(investorA.address, MINT_AMOUNT);
      await bond.pause();

      await expect(
        bond.connect(investorA).transfer(investorB.address, ethers.parseEther("50"))
      ).to.be.revertedWithCustomError(bond, "EnforcedPause");
    });
  });

  // ── Test 6: Unpause restores transfers ────────────────────────
  describe("Unpause – transfers restored", function () {
    it("should allow transfers again after unpausing", async function () {
      const { bond, investorA, investorB, MINT_AMOUNT } =
        await loadFixture(deployFixture);
      await bond.addToWhitelist(investorA.address);
      await bond.addToWhitelist(investorB.address);
      await bond.mint(investorA.address, MINT_AMOUNT);

      await bond.pause();
      await bond.unpause();

      const transferAmount = ethers.parseEther("100");
      await bond.connect(investorA).transfer(investorB.address, transferAmount);
      expect(await bond.balanceOf(investorB.address)).to.equal(transferAmount);
    });
  });

  // ── Test 7: Redeem/burn reduces balance and totalSupply ───────
  describe("Redeem / burn", function () {
    it("should reduce balance and totalSupply after redemption", async function () {
      const { bond, investorA, MINT_AMOUNT } = await loadFixture(deployFixture);
      await bond.addToWhitelist(investorA.address);
      await bond.mint(investorA.address, MINT_AMOUNT);

      const redeemAmount = ethers.parseEther("400");
      await bond.connect(investorA).redeem(redeemAmount);

      expect(await bond.balanceOf(investorA.address)).to.equal(
        MINT_AMOUNT - redeemAmount
      );
      expect(await bond.totalSupply()).to.equal(MINT_AMOUNT - redeemAmount);
    });

    it("should revert redeem when amount exceeds balance", async function () {
      const { bond, investorA, MINT_AMOUNT } = await loadFixture(deployFixture);
      await bond.addToWhitelist(investorA.address);
      await bond.mint(investorA.address, MINT_AMOUNT);

      await expect(
        bond.connect(investorA).redeem(MINT_AMOUNT + 1n)
      ).to.be.revertedWithCustomError(bond, "InsufficientBalance");
    });
  });

  // ── Test 8: Non-authorised users cannot execute admin ops ─────
  describe("Access control – non-owner blocked from admin ops", function () {
    it("should revert when non-owner calls pause", async function () {
      const { bond, investorA } = await loadFixture(deployFixture);
      await expect(
        bond.connect(investorA).pause()
      ).to.be.revertedWithCustomError(bond, "OwnableUnauthorizedAccount");
    });

    it("should revert when non-owner calls unpause", async function () {
      const { bond, investorA } = await loadFixture(deployFixture);
      await bond.pause();
      await expect(
        bond.connect(investorA).unpause()
      ).to.be.revertedWithCustomError(bond, "OwnableUnauthorizedAccount");
    });

    it("should revert when non-owner calls removeFromWhitelist", async function () {
      const { bond, investorA, investorB } = await loadFixture(deployFixture);
      await bond.addToWhitelist(investorB.address);
      await expect(
        bond.connect(investorA).removeFromWhitelist(investorB.address)
      ).to.be.revertedWithCustomError(bond, "OwnableUnauthorizedAccount");
    });
  });

  // ── Events ────────────────────────────────────────────────────
  describe("Events", function () {
    it("should emit InvestorWhitelisted on addToWhitelist", async function () {
      const { bond, investorA } = await loadFixture(deployFixture);
      await expect(bond.addToWhitelist(investorA.address))
        .to.emit(bond, "InvestorWhitelisted")
        .withArgs(investorA.address);
    });

    it("should emit BondIssued on mint", async function () {
      const { bond, investorA, MINT_AMOUNT } = await loadFixture(deployFixture);
      await bond.addToWhitelist(investorA.address);
      await expect(bond.mint(investorA.address, MINT_AMOUNT))
        .to.emit(bond, "BondIssued")
        .withArgs(investorA.address, MINT_AMOUNT);
    });

    it("should emit Redeemed on redeem", async function () {
      const { bond, investorA, MINT_AMOUNT } = await loadFixture(deployFixture);
      await bond.addToWhitelist(investorA.address);
      await bond.mint(investorA.address, MINT_AMOUNT);
      const redeemAmt = ethers.parseEther("100");
      await expect(bond.connect(investorA).redeem(redeemAmt))
        .to.emit(bond, "Redeemed")
        .withArgs(investorA.address, redeemAmt);
    });
  });
});

/**
 * demo.js – Run the full bond lifecycle demonstration against a deployed
 * GreenBondToken contract.
 *
 * Scenario (matches docs/demo-scenario.md and screenshots/ numbering):
 *   Step 1 – Deploy is already done (01-deploy-success)
 *   Step 2 – Whitelist Investor A                (02)
 *   Step 3 – Mint (issue) to Investor A          (03)
 *   Step 4 – Transfer to Unapproved Wallet FAILS (04)
 *   Step 5 – Whitelist Investor B                (05)
 *   Step 6 – Transfer A → B succeeds             (06)
 *   Step 7 – Pause, then transfer FAILS          (07)
 *   Step 8 – Unpause, Redeem/Burn                (08)
 *
 * Prerequisites:
 *   - Contract already deployed (deployments/<network>.json exists).
 *   - All 4 wallets configured in .env with private keys:
 *       DEPLOYER_PRIVATE_KEY, INVESTOR_A_PRIVATE_KEY,
 *       INVESTOR_B_PRIVATE_KEY, UNAPPROVED_PRIVATE_KEY
 *   - All wallets funded with testnet ETH for gas.
 *
 * Usage:
 *   npx hardhat run scripts/demo.js --network localhost
 *   npx hardhat run scripts/demo.js --network sepolia
 */

const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

// ── Helpers ────────────────────────────────────────────────────
const fmt = (wei) => hre.ethers.formatEther(wei);
const divider = (label) => {
  console.log("");
  console.log(`── ${label} ${"─".repeat(Math.max(0, 50 - label.length))}`);
};
const extractRevertReason = (err) => {
  const match = err.message.match(/reverted with custom error '([^']+)'/);
  if (match) return match[1];
  if (err.shortMessage) return err.shortMessage;
  if (err.reason) return err.reason;
  return err.message.substring(0, 120);
};

async function main() {
  const network = hre.network.name;

  // ── Load deployment fact file ────────────────────────────────
  const deployPath = path.join(__dirname, "..", "deployments", `${network}.json`);
  if (!fs.existsSync(deployPath)) {
    console.error(`No deployment file found at ${deployPath}. Deploy first.`);
    process.exit(1);
  }
  const deployment = JSON.parse(fs.readFileSync(deployPath, "utf8"));
  const CONTRACT_ADDRESS = deployment.contractAddress;

  console.log("╔══════════════════════════════════════════════════════╗");
  console.log("║    GreenBondToken – Lifecycle Demo                  ║");
  console.log("╚══════════════════════════════════════════════════════╝");
  console.log(`Network  : ${network}`);
  console.log(`Contract : ${CONTRACT_ADDRESS}`);

  // ── Signers ──────────────────────────────────────────────────
  // On both localhost and public testnet, we need exactly 4 signers:
  //   [0] = Issuer/Admin (deployer)
  //   [1] = Investor A
  //   [2] = Investor B
  //   [3] = Unapproved Wallet
  const signers = await hre.ethers.getSigners();

  if (signers.length < 4) {
    console.error("");
    console.error("ERROR: 4 signers required but only " + signers.length + " available.");
    console.error("For public testnet, ensure .env contains all 4 private keys:");
    console.error("  DEPLOYER_PRIVATE_KEY, INVESTOR_A_PRIVATE_KEY,");
    console.error("  INVESTOR_B_PRIVATE_KEY, UNAPPROVED_PRIVATE_KEY");
    console.error("Each wallet must be funded with testnet ETH for gas.");
    process.exit(1);
  }

  const [issuer, investorA, investorB, unapproved] = signers;

  console.log(`Issuer/Admin       : ${issuer.address}`);
  console.log(`Investor A         : ${investorA.address}`);
  console.log(`Investor B         : ${investorB.address}`);
  console.log(`Unapproved Wallet  : ${unapproved.address}`);

  // ── Write demo actors to file for cross-doc consistency ──────
  const actorsPath = path.join(__dirname, "..", "deployments", "demo-actors.json");
  const actorsData = {
    network,
    contractAddress: CONTRACT_ADDRESS,
    issuer: issuer.address,
    investorA: investorA.address,
    investorB: investorB.address,
    unapproved: unapproved.address,
  };
  fs.writeFileSync(actorsPath, JSON.stringify(actorsData, null, 2));
  console.log(`\n✔ Demo actors written to deployments/demo-actors.json`);

  // ── Attach to deployed contract ──────────────────────────────
  const GreenBondToken = await hre.ethers.getContractFactory("GreenBondToken");
  const bond = GreenBondToken.attach(CONTRACT_ADDRESS);

  const ISSUE_AMOUNT = hre.ethers.parseEther("1000"); // 1 000 tokens

  // ────────────────────────────────────────────────────────────
  // Step 2 – Whitelist Investor A
  // ────────────────────────────────────────────────────────────
  divider("Step 2: Whitelist Investor A");
  const tx2 = await bond.connect(issuer).addToWhitelist(investorA.address);
  await tx2.wait();
  console.log(`✔ Investor A whitelisted (tx: ${tx2.hash})`);
  console.log(`  whitelisted[InvestorA] = ${await bond.whitelisted(investorA.address)}`);

  // ────────────────────────────────────────────────────────────
  // Step 3 – Mint (Issue) to Investor A
  // ────────────────────────────────────────────────────────────
  divider("Step 3: Mint to Investor A");
  const tx3 = await bond.connect(issuer).mint(investorA.address, ISSUE_AMOUNT);
  await tx3.wait();
  console.log(`✔ Minted ${fmt(ISSUE_AMOUNT)} HKGBT to Investor A (tx: ${tx3.hash})`);
  console.log(`  balanceOf(A) = ${fmt(await bond.balanceOf(investorA.address))} HKGBT`);
  console.log(`  totalSupply  = ${fmt(await bond.totalSupply())} HKGBT`);

  // ────────────────────────────────────────────────────────────
  // Step 4 – Transfer to Unapproved Wallet (MUST FAIL)
  // ────────────────────────────────────────────────────────────
  divider("Step 4: Transfer to Unapproved Wallet (expect FAIL)");
  try {
    const tx4 = await bond
      .connect(investorA)
      .transfer(unapproved.address, hre.ethers.parseEther("100"));
    await tx4.wait();
    console.log("✘ ERROR – transfer should have reverted but succeeded!");
  } catch (err) {
    console.log("✔ Transfer correctly reverted.");
    console.log(`  Reason: ${extractRevertReason(err)}`);
  }

  // ────────────────────────────────────────────────────────────
  // Step 5 – Whitelist Investor B
  // ────────────────────────────────────────────────────────────
  divider("Step 5: Whitelist Investor B");
  const tx5 = await bond.connect(issuer).addToWhitelist(investorB.address);
  await tx5.wait();
  console.log(`✔ Investor B whitelisted (tx: ${tx5.hash})`);

  // ────────────────────────────────────────────────────────────
  // Step 6 – A → B Transfer (MUST SUCCEED)
  // ────────────────────────────────────────────────────────────
  divider("Step 6: Transfer A → B (approved)");
  const TRANSFER_AMOUNT = hre.ethers.parseEther("200");
  const tx6 = await bond.connect(investorA).transfer(investorB.address, TRANSFER_AMOUNT);
  await tx6.wait();
  console.log(`✔ Transferred ${fmt(TRANSFER_AMOUNT)} HKGBT from A to B (tx: ${tx6.hash})`);
  console.log(`  balanceOf(A) = ${fmt(await bond.balanceOf(investorA.address))} HKGBT`);
  console.log(`  balanceOf(B) = ${fmt(await bond.balanceOf(investorB.address))} HKGBT`);

  // ────────────────────────────────────────────────────────────
  // Step 7 – Pause → Transfer FAILS
  // ────────────────────────────────────────────────────────────
  divider("Step 7: Pause then Transfer (expect FAIL)");
  const txPause = await bond.connect(issuer).pause();
  await txPause.wait();
  console.log(`✔ Contract paused (tx: ${txPause.hash})`);

  try {
    const tx7 = await bond
      .connect(investorA)
      .transfer(investorB.address, hre.ethers.parseEther("50"));
    await tx7.wait();
    console.log("✘ ERROR – transfer should have reverted while paused!");
  } catch (err) {
    console.log("✔ Transfer correctly reverted while paused.");
    console.log(`  Reason: ${extractRevertReason(err)}`);
  }

  // ────────────────────────────────────────────────────────────
  // Step 8 – Unpause, then Redeem / Burn
  // ────────────────────────────────────────────────────────────
  divider("Step 8: Unpause → Redeem / Burn");
  const txUnpause = await bond.connect(issuer).unpause();
  await txUnpause.wait();
  console.log(`✔ Contract unpaused (tx: ${txUnpause.hash})`);

  const balBeforeA = await bond.balanceOf(investorA.address);
  const supplyBefore = await bond.totalSupply();

  const REDEEM_AMOUNT = hre.ethers.parseEther("300");
  const tx8 = await bond.connect(investorA).redeem(REDEEM_AMOUNT);
  await tx8.wait();

  const balAfterA = await bond.balanceOf(investorA.address);
  const supplyAfter = await bond.totalSupply();

  console.log(`✔ Investor A redeemed ${fmt(REDEEM_AMOUNT)} HKGBT (tx: ${tx8.hash})`);
  console.log(`  balanceOf(A)  : ${fmt(balBeforeA)} → ${fmt(balAfterA)}`);
  console.log(`  totalSupply   : ${fmt(supplyBefore)} → ${fmt(supplyAfter)}`);

  // ── Summary ──────────────────────────────────────────────────
  divider("Demo Complete");
  console.log("All lifecycle steps executed successfully.");
  console.log("");
  console.log("Next steps:");
  console.log("  1. Take screenshots of each step above (01–08).");
  console.log("  2. Run: node scripts/fill-deployment-info.js " + network);
  console.log("  3. Verify all docs are consistent with the demo output.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

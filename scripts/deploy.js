/**
 * deploy.js – Deploy GreenBondToken to the configured network.
 *
 * Outputs: contract address, tx hash, network, owner, constructor parameters.
 * After deployment, writes a JSON fact file to deployments/<network>.json.
 *
 * Usage:
 *   npx hardhat run scripts/deploy.js --network sepolia
 *   npx hardhat run scripts/deploy.js --network localhost
 */

const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const network = hre.network.name;
  const { chainId } = await hre.ethers.provider.getNetwork();

  // ── Construction parameters ──────────────────────────────────
  const TOKEN_NAME = "HK Green Bond Token";
  const TOKEN_SYMBOL = "HKGBT";
  // Illustrative maturity: 1 year from now (unix seconds)
  const MATURITY = Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60;
  const OWNER = deployer.address;

  console.log("╔══════════════════════════════════════════════════════╗");
  console.log("║          GreenBondToken – Deployment                ║");
  console.log("╚══════════════════════════════════════════════════════╝");
  console.log(`Network       : ${network} (chainId ${chainId})`);
  console.log(`Deployer      : ${deployer.address}`);
  console.log(`Token Name    : ${TOKEN_NAME}`);
  console.log(`Token Symbol  : ${TOKEN_SYMBOL}`);
  console.log(`Maturity      : ${new Date(MATURITY * 1000).toISOString()}`);
  console.log("");

  // ── Deploy ───────────────────────────────────────────────────
  const Factory = await hre.ethers.getContractFactory("GreenBondToken");
  const contract = await Factory.deploy(TOKEN_NAME, TOKEN_SYMBOL, MATURITY, OWNER);
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  const deployTx = contract.deploymentTransaction();
  const receipt = await deployTx.wait();

  console.log("✔ Deployed successfully");
  console.log(`  Contract Address : ${contractAddress}`);
  console.log(`  Tx Hash          : ${deployTx.hash}`);
  console.log(`  Block Number     : ${receipt.blockNumber}`);
  console.log("");

  // ── Build explorer URLs ──────────────────────────────────────
  const explorerBase = getExplorerBase(network);
  const explorerAddressUrl = explorerBase
    ? `${explorerBase}/address/${contractAddress}`
    : "N/A (local network)";
  const explorerTxUrl = explorerBase
    ? `${explorerBase}/tx/${deployTx.hash}`
    : "N/A (local network)";

  // ── Write deployment fact file ───────────────────────────────
  const deploymentData = {
    network,
    chainId: Number(chainId),
    contractName: "GreenBondToken",
    contractAddress,
    deploymentTxHash: deployTx.hash,
    blockNumber: receipt.blockNumber,
    deployedAtUtc: new Date().toISOString(),
    deployerAddress: deployer.address,
    ownerAddress: OWNER,
    tokenName: TOKEN_NAME,
    tokenSymbol: TOKEN_SYMBOL,
    decimals: 18,
    maturityTimestamp: MATURITY,
    explorerAddressUrl,
    explorerTxUrl,
    sourceVerified: false,
    gitCommit: "TO_BE_FILLED",
  };

  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) fs.mkdirSync(deploymentsDir);
  const outPath = path.join(deploymentsDir, `${network}.json`);
  fs.writeFileSync(outPath, JSON.stringify(deploymentData, null, 2));
  console.log(`✔ Deployment fact file written to deployments/${network}.json`);

  // ── Reminder ─────────────────────────────────────────────────
  if (explorerBase) {
    console.log("");
    console.log("Next steps:");
    console.log(`  1. Verify source:  npx hardhat verify --network ${network} ${contractAddress} "${TOKEN_NAME}" "${TOKEN_SYMBOL}" ${MATURITY} ${OWNER}`);
    console.log(`  2. Run demo:       npx hardhat run scripts/demo.js --network ${network}`);
    console.log(`  3. Update gitCommit in deployments/${network}.json`);
  }
}

function getExplorerBase(network) {
  const map = {
    sepolia: "https://sepolia.etherscan.io",
    holesky: "https://holesky.etherscan.io",
    amoy: "https://amoy.polygonscan.com",
    "base-sepolia": "https://sepolia.basescan.org",
  };
  return map[network] || null;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

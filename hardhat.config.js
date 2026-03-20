require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// Collect all available private keys for multi-signer demo on testnet.
// Order: [deployer, investorA, investorB, unapproved]
function getAccounts() {
  const keys = [
    process.env.DEPLOYER_PRIVATE_KEY,
    process.env.INVESTOR_A_PRIVATE_KEY,
    process.env.INVESTOR_B_PRIVATE_KEY,
    process.env.UNAPPROVED_PRIVATE_KEY,
  ].filter(Boolean);
  return keys.length > 0 ? keys : [];
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts: getAccounts(),
    },
    holesky: {
      url: process.env.HOLESKY_RPC_URL || "",
      accounts: getAccounts(),
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || "",
  },
};

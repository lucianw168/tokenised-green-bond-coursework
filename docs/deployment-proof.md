# Deployment Proof – GreenBondToken

## Deployment Summary

| Field | Value |
|---|---|
| Network | `sepolia` |
| Chain ID | `11155111` |
| Contract Address (CA) | `0x1b48384Cb42a292975F4D4cD78D7EDa2A6F34F1E` |
| Deployment Tx Hash | `0x13612c546f73e3bb8382e95c3e8bcd3c64320c231a9ff65ef84ce540412f8b5f` |
| Block Number | `10485189` |
| Deployed At (UTC) | `2026-03-20T17:14:25.177Z` |
| Deployer Address | `0xED512f3a7C8F3A21E6684f9bE7b52e811332E10d` |
| Owner Address | `0xED512f3a7C8F3A21E6684f9bE7b52e811332E10d` |

> All values above must match `deployments/<network>.json` exactly.

## Build Context

| Component | Version |
|---|---|
| Solidity | 0.8.24 |
| Hardhat | ^2.22.0 |
| OpenZeppelin Contracts | ^5.0.0 |
| Node.js | ≥ 18 |
| @nomicfoundation/hardhat-toolbox | ^4.0.0 |

## Constructor / Init Parameters

| Parameter | Value |
|---|---|
| Token Name | HK Green Bond Token |
| Token Symbol | HKGBT |
| Decimals | 18 (ERC-20 default) |
| Maturity Timestamp | `1805562851` (illustrative, ~1 year from deploy) |
| Initial Owner | `0xED512f3a7C8F3A21E6684f9bE7b52e811332E10d` (same as deployer) |

## Verification Status

- [x] Source code verified on block explorer (Similar Match)
- [x] Contract ABI matches compiled output
- [x] Constructor arguments confirmed on explorer

> If verification is not completed, explain why here. Unverified source is a quality deduction.

## Post-Deployment Checks

After deployment, the following checks were performed:

| Check | Method | Result |
|---|---|---|
| Owner query | `bond.owner()` | `0xED512f3a7C8F3A21E6684f9bE7b52e811332E10d` |
| Whitelist Investor A | `bond.addToWhitelist(addr)` | tx `0x4dc66a...b59c8c` |
| Mint to Investor A | `bond.mint(addr, amount)` | tx `0x69d08a...258ea5` |
| Transfer to unapproved | `bond.transfer(unapproved, amount)` | Reverted as expected |
| Pause | `bond.pause()` | tx `0xda131e...153114` |
| Redeem/Burn | `bond.redeem(amount)` | tx `0x8ac8cb...0e4ce1` |

> These checks are performed by running `scripts/demo.js` on the deployed contract and captured in `screenshots/`.

## Demo Wallet Requirements

The full lifecycle demo requires **4 funded wallets** on the target testnet:

| Role | .env Variable | Must Sign Transactions |
|---|---|---|
| Issuer/Admin (Deployer) | `DEPLOYER_PRIVATE_KEY` | whitelist, mint, pause, unpause |
| Investor A | `INVESTOR_A_PRIVATE_KEY` | transfer, redeem |
| Investor B | `INVESTOR_B_PRIVATE_KEY` | (receives only, but needs key in config) |
| Unapproved Wallet | `UNAPPROVED_PRIVATE_KEY` | (target of failed transfer, needs key in config) |

After the demo runs, actual addresses are recorded in `deployments/demo-actors.json`.

## Consistency Note

The contract address (CA) recorded here is the **single source of truth**. The following documents and artefacts must reference this exact CA:

- `README.md` → Testnet Deployment table
- `deployments/<network>.json` → `contractAddress` field
- `deployments/demo-actors.json` → `contractAddress` field
- `screenshots/captions.md` → references to CA
- Report → Implementation note section
- All screenshots showing the CA

Any discrepancy between these sources constitutes an inconsistency that must be resolved before submission.

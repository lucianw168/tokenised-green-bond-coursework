# Single Source of Truth

> This table defines the canonical values for all naming, identifiers, and design facts.
> Every file in this repository and the final report MUST use these exact values.
> Any deviation is an inconsistency that must be fixed before submission.

## Fixed Facts (set before development)

| Field | Canonical Value |
|---|---|
| Contract Name | `GreenBondToken` |
| Token Name | `HK Green Bond Token` |
| Token Symbol | `HKGBT` |
| Decimals | `18` |
| Asset Description | HKD-denominated tokenised green bond |
| Investor Class | Professional / qualified investors |
| Token Form | Permissioned fungible token (ERC-20) |
| Scope Statement | Simplified proof-of-concept, not production infrastructure |
| Solidity Version | 0.8.24 |
| OpenZeppelin Version | ^5.0.0 |

## Core Features (code must implement; report must reference)

| Feature | Contract Function | Test Coverage | Screenshot |
|---|---|---|---|
| Whitelist | `addToWhitelist()` / `removeFromWhitelist()` | Tests 1, 3 | 02, 04, 05 |
| Mint (Issuance) | `mint()` | Test 2 | 03 |
| Restricted Transfer | `_update()` whitelist check | Tests 3, 4 | 04, 06 |
| Pause / Unpause | `pause()` / `unpause()` | Tests 5, 6 | 07 |
| Redeem / Burn | `redeem()` | Test 7 | 08 |
| Access Control | `onlyOwner` modifier | Test 8 | — |
| Events | `InvestorWhitelisted`, `BondIssued`, `Redeemed` | Event tests | — |

## Features NOT Implemented (report must explicitly scope out)

| Feature | What to Say |
|---|---|
| Coupon distribution | "Conceptual servicing layer — described in the report but not implemented in code." |
| Front-end UI | "Not required; all interaction is via scripts and tests." |
| Force transfer / recovery | "Optional enhancement; not core to the minimum viable compliance model." |
| Real KYC/AML integration | "Off-chain process in practice; the whitelist simulates the on-chain result of KYC clearance." |
| Multi-contract architecture | "A single contract is sufficient to demonstrate core lifecycle controls." |

## Deployment Facts (set after deployment)

| Field | Value | Source File |
|---|---|---|
| Network | `sepolia` | `deployments/sepolia.json` |
| Chain ID | `11155111` | `deployments/sepolia.json` |
| Contract Address | `0x1b48384Cb42a292975F4D4cD78D7EDa2A6F34F1E` | `deployments/sepolia.json` |
| Deployment Tx Hash | `0x13612c546f73e3bb8382e95c3e8bcd3c64320c231a9ff65ef84ce540412f8b5f` | `deployments/sepolia.json` |
| Explorer URL | `https://sepolia.etherscan.io/address/0x1b48384Cb42a292975F4D4cD78D7EDa2A6F34F1E` | `deployments/sepolia.json` |
| Source Verified | `true` (Similar Match) | Etherscan |
| GitHub Repository | `https://github.com/lucianw168/tokenised-green-bond-coursework` | Manual |

## Demo Actor Addresses (set after demo.js runs)

| Role | Address | Source File |
|---|---|---|
| Issuer/Admin | `0xED512f3a7C8F3A21E6684f9bE7b52e811332E10d` | `deployments/demo-actors.json` |
| Investor A | `0x53D3A6979b3612070328F211c710DbdED0Eab0C6` | `deployments/demo-actors.json` |
| Investor B | `0x58Da28dd169d1469b6d7187aFF5020898EC0B2e4` | `deployments/demo-actors.json` |
| Unapproved Wallet | `0xa9Ce6569bd661BAa5D1F16eA26B3126e49AfF764` | `deployments/demo-actors.json` |

## Demo Parameters (fixed in code)

| Parameter | Value |
|---|---|
| Issue Amount | 1,000 HKGBT |
| Transfer Amount (A → B) | 200 HKGBT |
| Failed Transfer Amount | 100 HKGBT |
| Pause Transfer Attempt | 50 HKGBT |
| Redeem Amount | 300 HKGBT |

## Post-Demo State

| Metric | Expected Value |
|---|---|
| Total Supply | 700 HKGBT |
| Balance of Investor A | 500 HKGBT |
| Balance of Investor B | 200 HKGBT |
| Contract Paused | No |

## Where Each Fact Must Appear

| Fact | Files That Must Contain It |
|---|---|
| Contract Name | `GreenBondToken.sol`, `deploy.js`, `demo.js`, `test/*.js`, `README.md`, all `docs/`, `report/`, `captions.md` |
| Token Name | `GreenBondToken.sol` constructor, `deploy.js`, `test/*.js`, `README.md`, `deployment-proof.md`, `demo-scenario.md` |
| Token Symbol | Same as Token Name |
| Contract Address | `deployments/<network>.json`, `README.md`, `deployment-proof.md`, `captions.md`, `report/implementation-note.md`, `report/report-template.md` |
| Actor Addresses | `deployments/demo-actors.json`, `demo-scenario.md` |
| Scope Statement | `README.md` (2 places), `report/report-template.md`, `report/implementation-note.md`, `GreenBondToken.sol` NatSpec |

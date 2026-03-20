# Demo Scenario – GreenBondToken Lifecycle

## Overview

This document defines the exact sequence of steps executed by `scripts/demo.js`. The same sequence is used for:

- Generating screenshots (`screenshots/01–08`)
- Writing test cases (`test/GreenBondToken.test.js`)
- Describing the prototype in the report

Any change to this scenario must be reflected in all three.

## Prerequisites

The full 8-step demo runs on both localhost and public testnet. On a public testnet:

- All 4 wallets must have private keys configured in `.env` (see `.env.example`).
- All 4 wallets must be funded with testnet ETH for gas.
- The contract must be deployed first via `scripts/deploy.js`.

## Role Assignments

> After running `demo.js`, actual addresses are written to `deployments/demo-actors.json`.

| Role | Description | Address |
|---|---|---|
| **Issuer/Admin** | Deploys the contract, manages whitelist, mints, pauses | `0xED512f3a7C8F3A21E6684f9bE7b52e811332E10d` (deployer) |
| **Investor A** | Initial subscriber; receives primary issuance, signs transfers and redeem | `0x53D3A6979b3612070328F211c710DbdED0Eab0C6` |
| **Investor B** | Qualified secondary buyer; receives transfer from A | `0x58Da28dd169d1469b6d7187aFF5020898EC0B2e4` |
| **Unapproved Wallet** | Not whitelisted; used to prove transfer restriction | `0xa9Ce6569bd661BAa5D1F16eA26B3126e49AfF764` |

## Token Parameters

| Parameter | Value |
|---|---|
| Contract Name | GreenBondToken |
| Token Name | HK Green Bond Token |
| Token Symbol | HKGBT |
| Issue Amount | 1,000 HKGBT |
| Transfer Amount | 200 HKGBT |
| Redeem Amount | 300 HKGBT |

## Step-by-Step Scenario

### Step 1 – Deploy Contract

- **Actor**: Issuer/Admin
- **Action**: Deploy `GreenBondToken` with name, symbol, maturity, owner.
- **Expected Result**: Contract deployed; CA recorded.
- **Screenshot**: `01-deploy-success.png`

### Step 2 – Whitelist Investor A

- **Actor**: Issuer/Admin
- **Action**: Call `addToWhitelist(InvestorA)`.
- **Expected Result**: `InvestorWhitelisted` event emitted; `whitelisted[A] == true`.
- **Screenshot**: `02-whitelist-investor-a.png`

### Step 3 – Mint (Issue) to Investor A

- **Actor**: Issuer/Admin
- **Action**: Call `mint(InvestorA, 1000 HKGBT)`.
- **Expected Result**: `BondIssued` event emitted; `balanceOf(A) == 1000`; `totalSupply == 1000`.
- **Screenshot**: `03-mint-issued.png`

### Step 4 – Transfer to Unapproved Wallet (FAILS)

- **Actor**: Investor A
- **Action**: Call `transfer(UnapprovedWallet, 100 HKGBT)`.
- **Expected Result**: Transaction **reverts** with `NotWhitelisted`.
- **Screenshot**: `04-transfer-to-unapproved-wallet-fails.png`
- **Why this matters**: Proves that transfer restriction is enforced — tokens cannot leave the permissioned perimeter.

### Step 5 – Whitelist Investor B

- **Actor**: Issuer/Admin
- **Action**: Call `addToWhitelist(InvestorB)`.
- **Expected Result**: `InvestorWhitelisted` event emitted; `whitelisted[B] == true`.
- **Screenshot**: `05-whitelist-investor-b.png`

### Step 6 – Approved Transfer A → B (SUCCEEDS)

- **Actor**: Investor A
- **Action**: Call `transfer(InvestorB, 200 HKGBT)`.
- **Expected Result**: Transfer succeeds; `balanceOf(A) == 800`; `balanceOf(B) == 200`.
- **Screenshot**: `06-approved-transfer-success.png`
- **Why this matters**: Proves that controlled secondary transfer is possible among approved holders.

### Step 7 – Pause → Transfer FAILS

- **Actor**: Issuer/Admin pauses; Investor A attempts transfer.
- **Action**: Call `pause()`, then `transfer(InvestorB, 50 HKGBT)`.
- **Expected Result**: Pause succeeds; transfer **reverts** with `EnforcedPause`.
- **Screenshot**: `07-pause-transfer-fails.png`
- **Why this matters**: Proves emergency/compliance halt capability.

### Step 8 – Unpause → Redeem / Burn

- **Actor**: Issuer/Admin unpauses; Investor A redeems.
- **Action**: Call `unpause()`, then Investor A calls `redeem(300 HKGBT)`.
- **Expected Result**: `Redeemed` event emitted; `balanceOf(A)` decreases by 300; `totalSupply` decreases by 300.
- **Screenshot**: `08-redeem-burn-success.png`
- **Why this matters**: Proves lifecycle closure — tokens can be burned on redemption.

## Post-Demo State

| Metric | Value |
|---|---|
| Total Supply | 700 HKGBT |
| Balance of Investor A | 500 HKGBT |
| Balance of Investor B | 200 HKGBT |
| Contract Paused | No (unpaused in Step 8) |

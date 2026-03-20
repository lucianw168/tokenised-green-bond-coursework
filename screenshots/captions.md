# Screenshot Captions

All screenshots follow the demo scenario defined in `docs/demo-scenario.md`. They are numbered in execution order and use the same role names and contract address throughout.

Contract: GreenBondToken
Token: HK Green Bond Token (HKGBT)
Network: sepolia
Contract Address: 0x1b48384Cb42a292975F4D4cD78D7EDa2A6F34F1E

---

## Figure A1

**File**: `01-deploy-success.png`
**Caption**: Deployment of GreenBondToken on the selected testnet, showing the contract address used throughout the report and all subsequent screenshots.
**Report Section**: Implementation note / Testnet deployment

---

## Figure A2

**File**: `02-whitelist-investor-a.png`
**Caption**: Investor A is added to the whitelist by the Issuer/Admin, demonstrating eligibility control before any tokens can be received. The `InvestorWhitelisted` event confirms the on-chain state change.
**Report Section**: Market Access / Token Design

---

## Figure A3

**File**: `03-mint-issued.png`
**Caption**: The Issuer/Admin mints 1,000 HKGBT to Investor A, demonstrating controlled primary issuance. The `BondIssued` event and updated balance confirm successful allocation.
**Report Section**: Token Design / Market Access

---

## Figure A4

**File**: `04-transfer-to-unapproved-wallet-fails.png`
**Caption**: Investor A attempts to transfer 100 HKGBT to an unapproved wallet address. The transaction reverts with `NotWhitelisted`, proving that transfer restriction is enforced and tokens cannot leave the permissioned perimeter.
**Report Section**: Token Design / Risk Management

---

## Figure A5

**File**: `05-whitelist-investor-b.png`
**Caption**: Investor B is added to the whitelist, establishing them as a qualified secondary recipient before any transfer can occur.
**Report Section**: Market Access

---

## Figure A6

**File**: `06-approved-transfer-success.png`
**Caption**: Investor A transfers 200 HKGBT to the now-whitelisted Investor B. The transaction succeeds, demonstrating that controlled secondary transfer is possible among approved holders. Updated balances: A = 800, B = 200.
**Report Section**: Market Access and Liquidity

---

## Figure A7

**File**: `07-pause-transfer-fails.png`
**Caption**: The Issuer/Admin pauses the contract. Investor A then attempts a transfer to Investor B, which reverts with `EnforcedPause`. This demonstrates the emergency/compliance halt mechanism.
**Report Section**: Token Design / Risk Management

---

## Figure A8

**File**: `08-redeem-burn-success.png`
**Caption**: After unpausing, Investor A redeems (burns) 300 HKGBT. The balance decreases from 800 to 500 and total supply decreases from 1,000 to 700, demonstrating lifecycle closure through redemption.
**Report Section**: Token Design

---

## Figure A9

**File**: `09-etherscan-verified-source.png`
**Caption**: Etherscan contract page showing "Similar Match Source Code" verification status, confirming the deployed bytecode matches published Solidity source. The TOKEN TRACKER field displays HK Green Bond Token (HKGBT).
**Report Section**: Implementation note / Deployment proof

---

## Figure A10

**File**: `10-etherscan-source-code.png`
**Caption**: Verified source code displayed on Etherscan, showing the GreenBondToken.sol contract compiled with Solidity v0.8.24, optimizer enabled (200 runs), MIT licence.
**Report Section**: Implementation note

---

## Figure A11

**File**: `11-etherscan-tx-history.png`
**Caption**: Etherscan transaction history for the contract, showing all lifecycle operations (Mint, Transfer, Pause, Unpause, Redeem) executed during the demo with corresponding block numbers and participants.
**Report Section**: Deployment proof

---

## Figure A12

**File**: `12-etherscan-token-page.png`
**Caption**: Etherscan ERC-20 token page for HKGBT showing total supply (700 HKGBT), 2 holders, and 3 token transfers — confirming the post-demo state matches expected values.
**Report Section**: Token Design / Market Access

---

## Figure A13

**File**: `13-metamask-hkgbt-balance.png`
**Caption**: MetaMask wallet (Investor A) on Sepolia testnet displaying 500 HKGBT balance, demonstrating that the token is a standard ERC-20 compatible with mainstream wallets.
**Report Section**: Token Design

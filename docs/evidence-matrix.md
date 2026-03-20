# Evidence Matrix

This document maps each key claim made in the report to its supporting evidence in the repository. Its purpose is to ensure that every assertion about the prototype is verifiable through code, tests, or screenshots.

## Matrix

| Report Claim | Code Evidence | Test Evidence | Screenshot Evidence |
|---|---|---|---|
| Only qualified investors may receive tokens | `GreenBondToken.sol`: `whitelisted` mapping + `_update()` check | Test: "should revert transfer to a non-whitelisted address"; Test: "should allow owner to add an investor to the whitelist" | Figure A2 (`02-whitelist-investor-a.png`), Figure A4 (`04-transfer-to-unapproved-wallet-fails.png`) |
| Tokens are issued in a controlled primary allocation | `GreenBondToken.sol`: `mint()` function with `onlyOwner` + whitelist check | Test: "should allow owner to mint to a whitelisted address"; Test: "should revert when non-owner tries to mint"; Test: "should revert when minting to a non-whitelisted address" | Figure A3 (`03-mint-issued.png`) |
| Secondary transfer is permitted only among approved holders | `GreenBondToken.sol`: `_update()` enforces `whitelisted[to]` on every transfer | Test: "should allow transfer between two whitelisted addresses"; Test: "should revert transfer to a non-whitelisted address" | Figure A5 (`05-whitelist-investor-b.png`), Figure A6 (`06-approved-transfer-success.png`) |
| Compliance controls can halt token movement | `GreenBondToken.sol`: `pause()` / `unpause()` + `_requireNotPaused()` in `_update()` | Test: "should revert transfers when contract is paused"; Test: "should allow transfers again after unpausing" | Figure A7 (`07-pause-transfer-fails.png`) |
| Lifecycle ends with redemption and burn | `GreenBondToken.sol`: `redeem()` function calls `_burn()` | Test: "should reduce balance and totalSupply after redemption"; Test: "should revert redeem when amount exceeds balance" | Figure A8 (`08-redeem-burn-success.png`) |
| The prototype is deployed on a public testnet | `scripts/deploy.js` + `deployments/<network>.json` | N/A | Figure A1 (`01-deploy-success.png`) |
| Only authorised administrators can perform management operations | `Ownable` modifier on `mint`, `addToWhitelist`, `removeFromWhitelist`, `pause`, `unpause` | Test: "should revert when non-owner calls pause"; Test: "should revert when non-owner calls unpause"; Test: "should revert when non-owner calls removeFromWhitelist"; Test: "should revert when non-owner tries to mint"; Test: "should revert when non-owner tries to whitelist" | N/A (covered by revert tests) |
| Key lifecycle events are emitted for auditability | `InvestorWhitelisted`, `BondIssued`, `Redeemed` events in `GreenBondToken.sol` | Test: "should emit InvestorWhitelisted on addToWhitelist"; Test: "should emit BondIssued on mint"; Test: "should emit Redeemed on redeem" | N/A (events visible in tx logs) |
| Coupon distribution is conceptual, not implemented | N/A (intentionally omitted) | N/A | N/A |
| The prototype is a coursework scope, not production | `GreenBondToken.sol` NatSpec comment; `README.md` scope statements | N/A | N/A |

## Negative Claims (things the report must NOT assert)

| Prohibited Claim | Why |
|---|---|
| "Coupon distribution is implemented on-chain" | Only conceptual — no code exists |
| "The token supports free secondary trading" | Transfer restriction enforced via whitelist |
| "The system is production-ready" | Scope statement explicitly denies this |
| "KYC/AML is performed on-chain" | Whitelist simulates the outcome; actual KYC is off-chain |
| "Force transfer / recovery is supported" | Not implemented in current contract |

## How to Use This Matrix

1. **For the report author**: Before finalising the report, check every claim in the left column. If a claim cannot be traced to at least one evidence column, either add the evidence or remove the claim.
2. **For the assessor**: Use this matrix to verify that the repository supports the report's assertions. Each row should be independently checkable.
3. **Consistency rule**: If a feature is added or removed from the code, this matrix must be updated simultaneously.
4. **Cross-reference**: This matrix should be checked against `docs/single-source-of-truth.md` to ensure all features listed there are covered here.

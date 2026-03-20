# Submission Checklist

Use this checklist before final submission. Every item must be checked.

---

## A. Report (Primary Deliverable)

### Structure and Coverage

- [ ] Title is clear, specific, and under 15 words
- [ ] Introduction defines asset, approach, and main argument (120–150 words)
- [ ] Section 1 (Asset) establishes it as a bond, then green bond, then token
- [ ] Section 2 (Rationale) covers at least 4 tokenisation benefits with specifics
- [ ] Section 2 includes caveat: "tokenisation does not automatically create liquidity"
- [ ] Section 3 (Token Design) explains why FT from economic properties
- [ ] Section 3 covers rights, restrictions, and lifecycle
- [ ] Section 3 contains Implementation Note with CA, explorer link, GitHub link
- [ ] Section 4 (Market Access) covers full lifecycle and does NOT overstate liquidity
- [ ] Section 5 (Risk) has at least 5 specific risk categories
- [ ] Section 6 (DeFi/Blockchain) is restrained — "programmable infrastructure" framing
- [ ] Conclusion gives clear judgment in 100–120 words

### Figures and References

- [ ] At least 1 figure (lifecycle diagram or rights-and-controls diagram)
- [ ] At least 3 substantive references cited
- [ ] Reference format is consistent throughout
- [ ] Screenshots referenced as Figures A1–A13

### Quality Gates

- [ ] Total word count ≤ 2,400 (excluding references and appendix)
- [ ] No section exceeds its word budget by more than 50 words
- [ ] Asset framed as "compliant digital security", not "crypto token"
- [ ] No prohibited framings (see `report/report-checklist.md`)

---

## B. GitHub Repository

### Essentials

- [ ] `README.md` exists and follows the required 13-section structure
- [ ] README includes the two required scope statements
- [ ] README Testnet Deployment table is filled with actual values
- [ ] No placeholder `TO_BE_FILLED` values remain in any file (except GitHub repository URL, which is filled after repo creation)

### Contract

- [ ] `contracts/GreenBondToken.sol` compiles without errors
- [ ] Contract implements: whitelist, mint, restricted transfer, pause/unpause, redeem/burn
- [ ] Contract emits events: `InvestorWhitelisted`, `BondIssued`, `Redeemed`
- [ ] Contract is NOT a plain ERC-20 — it enforces permissioned holding
- [ ] Contract uses OpenZeppelin v5 (ERC20, Ownable, Pausable)

### Tests

- [ ] `test/GreenBondToken.test.js` passes all tests (`npx hardhat test`)
- [ ] Tests cover: whitelist access, mint access, restricted transfer, approved transfer, pause, unpause, redeem/burn, admin access control

### Scripts

- [ ] `scripts/deploy.js` outputs CA, tx hash, writes `deployments/<network>.json`
- [ ] `scripts/demo.js` runs all 8 lifecycle steps with 4 funded signers
- [ ] `scripts/demo.js` writes `deployments/demo-actors.json`
- [ ] `scripts/fill-deployment-info.js` fills all placeholders from JSON sources

---

## C. Testnet Deployment

- [ ] Contract is deployed to a public testnet (Sepolia or Holesky)
- [ ] `deployments/<network>.json` is complete and accurate
- [ ] `deployments/demo-actors.json` exists with all 4 role addresses
- [ ] `docs/deployment-proof.md` is filled in with actual data
- [ ] Explorer link works — contract address page loads
- [ ] Source code is verified on the block explorer (strongly recommended)

---

## D. Screenshots and Evidence

- [ ] All 13 screenshots exist in `screenshots/`
- [ ] Screenshots follow the narrative order (01–13)
- [ ] At least one screenshot shows the contract address
- [ ] At least one screenshot shows a failed/reverted transaction
- [ ] At least one screenshot shows a successful state change
- [ ] `screenshots/captions.md` is complete with report section references
- [ ] All screenshots use the same contract address and role names
- [ ] Screenshots were generated from the SAME demo run as `demo-actors.json`

---

## E. Cross-Deliverable Consistency

- [ ] Contract name is `GreenBondToken` everywhere
- [ ] Token name is `HK Green Bond Token` everywhere
- [ ] Token symbol is `HKGBT` everywhere
- [ ] Contract address is identical in: README, deployment JSON, deployment-proof.md, captions.md, report
- [ ] Role addresses in demo-scenario.md match demo-actors.json
- [ ] Network name is consistent across all documents
- [ ] No feature is claimed in the report that is absent from code
- [ ] No feature is claimed in code/README that is absent from the report
- [ ] Scope limitation ("coursework prototype, not production") is stated in README and report

---

## F. Workflow Execution Order

Before checking the boxes above, ensure you followed this order:

1. `npx hardhat test` — all tests pass
2. `npx hardhat run scripts/deploy.js --network <testnet>` — deploy
3. `npx hardhat run scripts/demo.js --network <testnet>` — run full demo with 4 wallets
4. Take screenshots of each demo step (01–08)
5. `node scripts/fill-deployment-info.js <testnet>` — fill all doc placeholders
6. `npx hardhat verify --network <testnet> ...` — verify source
7. Fill `GitHub repository: TO_BE_FILLED` manually in README and report
8. Write report using `report/report-template.md`
9. Run through this checklist

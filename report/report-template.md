# [Title: To Be Written]

> Word count target: ≤ 2,400 words (excluding references and implementation note)

---

## Introduction

<!-- 120–150 words -->
<!-- Must establish: asset choice, why HK, why institutional, main argument -->
<!-- Do NOT: lecture on blockchain, list features, give chapter preview -->

[Write here]

---

## 1. Asset Description and Value Source

<!-- 350–400 words -->
<!-- Structure: (1) It is a bond → (2) It is a green bond → (3) The token represents it on-chain -->
<!-- Required keywords: fixed-income security, coupon, principal repayment, use of proceeds, bondholder rights, proportional claim -->

[Write here]

---

## 2. Rationale for Tokenisation

<!-- 300–350 words -->
<!-- Cover at least 4: onboarding, transfer admin, servicing, auditability, access enforcement -->
<!-- MUST include: "Tokenisation does not automatically create liquidity." -->

[Write here]

---

## 3. Token Structure and Design

<!-- 400–450 words — CORE SECTION -->
<!-- Sub-structure: (a) what token represents, (b) rights embedded, (c) restrictions embedded, (d) lifecycle logic -->
<!-- Must reference: GreenBondToken contract, GitHub repo, testnet CA -->
<!-- Must mention: whitelist, mint, restricted transfer, pause, redeem/burn -->

[Write here]

### Implementation Note

> A simplified proof-of-concept smart contract, GreenBondToken, was deployed on sepolia.
> Contract address: 0x1b48384Cb42a292975F4D4cD78D7EDa2A6F34F1E
> Explorer link: https://sepolia.etherscan.io/address/0x1b48384Cb42a292975F4D4cD78D7EDa2A6F34F1E
> GitHub repository: `https://github.com/lucianw168/tokenised-green-bond-coursework`
> The prototype demonstrates whitelist-based eligibility, controlled issuance, restricted transfer, pause, and redemption/burn.

---

## 4. Market Access and Liquidity Design

<!-- 350–400 words -->
<!-- Structure: Onboarding → Subscription → Payment → Issuance → Servicing → Secondary Transfer -->
<!-- Required keywords: primary issuance, professional/qualified investors, permissioned venue, OTC, pricing drivers, liquidity fragmentation -->
<!-- MUST NOT claim: automatic liquidity, free trading, DeFi solves liquidity -->

[Write here]

---

## 5. Risk Analysis and Limitations

<!-- 400–450 words — HIGHEST SCORING SECTION -->
<!-- 5 paragraphs, one per risk category: -->
<!-- 1. Legal recognition risk -->
<!-- 2. Interoperability and settlement risk -->
<!-- 3. Liquidity fragmentation risk -->
<!-- 4. Compliance/control risk (admin key concentration) -->
<!-- 5. Smart contract and operational risk -->
<!-- Every risk must be SPECIFIC to this asset design, not generic -->

[Write here]

---

## 6. Role of DeFi and Blockchain Infrastructure

<!-- 200–250 words -->
<!-- Tone: restrained. "Programmable infrastructure" not "decentralised revolution" -->
<!-- Must answer: what blockchain does here, whether DeFi is central or peripheral -->

[Write here]

---

## Conclusion

<!-- 100–120 words -->
<!-- Final judgment. Why green bond suits tokenisation. Why FT is right. What determines success. -->
<!-- Must NOT: repeat abstract, summarise sections, make promises -->

[Write here]

---

## References

<!-- Format: author-date or numbered, consistent throughout -->
<!-- Cite: coursework brief, 2–3 regulatory/industry reports, 1–2 tokenisation frameworks -->

1. [Reference 1]
2. [Reference 2]
3. [Reference 3]

---

## Appendix: Screenshots and Evidence

See [GitHub repository](https://github.com/lucianw168/tokenised-green-bond-coursework) for full evidence, including:

- `screenshots/` — 8 lifecycle screenshots (Figures A1–A8)
- `docs/evidence-matrix.md` — claim-to-evidence mapping
- `test/GreenBondToken.test.js` — 18 automated tests

| Figure | Description |
|---|---|
| A1 | Deployment success with contract address |
| A2 | Investor A whitelisted |
| A3 | Primary issuance (mint) to Investor A |
| A4 | Transfer to unapproved wallet reverts |
| A5 | Investor B whitelisted |
| A6 | Controlled secondary transfer A → B |
| A7 | Pause halts transfer |
| A8 | Redemption burns tokens, supply decreases |

# Report Outline – Tokenised Green Bond

## Unified Design Line

**Asset**: HKD-denominated tokenised green bond
**Issuer**: Regulated Hong Kong financial institution / policy-oriented issuer
**Investors**: Professional / qualified investors
**Token Form**: Permissioned fungible token (ERC-20)
**Core Functionality**: Whitelist, mint, restricted transfer, pause, redeem/burn
**Positioning**: Compliant digital security, not a retail crypto token

---

## Word Budget (2,400 words total)

| Section | Target Words | Purpose |
|---|---|---|
| Introduction | 120–150 | Problem definition, asset choice, main argument |
| 1. Asset Description and Value Source | 350–400 | What the bond is, cash-flow rights, green attribute |
| 2. Rationale for Tokenisation | 300–350 | Why tokenise, what problems it solves, for whom |
| 3. Token Structure and Design | 400–450 | Why FT, rights embedded, controls, lifecycle |
| 4. Market Access and Liquidity Design | 350–400 | Primary issuance, secondary transfer, liquidity limits |
| 5. Risk Analysis and Limitations | 400–450 | At least 5 risk categories, specific and deep |
| 6. Role of DeFi and Blockchain Infrastructure | 200–250 | What blockchain does here, restraint on DeFi claims |
| Conclusion | 100–120 | Final judgment, success factors |
| **Total** | **~2,220–2,570** | Buffer for editing down |

---

## Section-by-Section Requirements

### Introduction (120–150 words)

**Must answer:**
- What asset is being designed
- Why green bond as the chosen asset
- Why Hong Kong-oriented institutional use case
- What is the main argument

**Must NOT do:**
- Lecture on blockchain basics
- List all features
- Give a chapter preview

---

### 1. Asset Description and Value Source (350–400 words)

**Must answer:**
- What is the underlying asset (a debt instrument)
- Where does its economic value come from (coupon + principal)
- What does the token represent, and what it does not represent
- What role does "green" play in this asset

**Required keywords:**
fixed-income security, coupon, principal repayment, use of proceeds, bondholder rights, proportional claim

**Structure:**
1. First establish it as a bond (debt security)
2. Then explain it as a green bond (use-of-proceeds constraint)
3. Then explain the token as its on-chain representation

**Prohibited framings:**
- "Green project token", "ESG coin", "environmental NFT"
- Treating the token as a standalone crypto asset

---

### 2. Rationale for Tokenisation (300–350 words)

**Must answer:**
- Why this type of asset benefits from tokenisation
- What specific problems tokenisation addresses
- Who benefits (issuers, investors, regulators)
- Whether benefits are operational, market-structural, or both

**Required coverage (at least 4 of these):**
- Investor onboarding efficiency
- Transfer administration simplification
- Servicing transparency (coupon/reporting)
- Auditability and disclosure
- Access conditions enforcement

**Must include this caveat:**
"Tokenisation does not automatically create liquidity."

---

### 3. Token Structure and Design (400–450 words)

**Must answer:**
- Why FT (not NFT) — derived from asset's economic properties
- What rights the token embeds
- What restrictions the token embeds
- What lifecycle actions exist

**Suggested sub-structure:**
1. What the token represents
2. Rights embedded (coupon, principal, disclosure)
3. Restrictions embedded (whitelist, transfer control, pause)
4. Lifecycle logic (issuance → holding → transfer → redemption)

**Must reference implementation:**
- Contract name: GreenBondToken
- Core functions: whitelist, mint, restricted transfer, pause, redeem/burn
- Point to GitHub repository and testnet CA

---

### 4. Market Access and Liquidity Design (350–400 words)

**Must answer:**
- How primary issuance works
- How secondary transfer works
- Who is eligible to participate
- Where liquidity comes from (and its limits)
- Why liquidity should not be overstated

**Required structure:**
Onboarding → Subscription → Payment → Issuance → Servicing → Secondary Transfer

**Required keywords:**
primary issuance, professional/qualified investors, permissioned venue, OTC/bulletin board, pricing drivers, liquidity fragmentation

**Prohibited framings:**
- "24/7 trading therefore liquid"
- "Anyone can trade freely"
- "Put it on DeFi and liquidity solves itself"

---

### 5. Risk Analysis and Limitations (400–450 words)

**Must answer:**
- Legal risk
- Interoperability risk
- Market/liquidity risk
- Compliance control risk
- Technical/operational risk

**Required 5-paragraph structure:**
1. Legal recognition risk — does the token carry legal standing as a security?
2. Interoperability and settlement risk — on-chain/off-chain misalignment
3. Liquidity fragmentation risk — permissioned ≠ liquid
4. Compliance/control risk — admin key concentration, governance
5. Smart contract and operational risk — bugs, key loss, upgrade absence

**Required keywords:**
legal coherence, on-chain/off-chain misalignment, settlement finality, fragmented liquidity, admin key / governance concentration

**This is the highest-scoring section.** Generic hand-waving ("regulation is unclear") will lose marks. Every risk must be specific to this asset design.

---

### 6. Role of DeFi and Blockchain Infrastructure (200–250 words)

**Must answer:**
- What blockchain concretely provides in this design
- Whether DeFi is central or peripheral
- Which on-chain mechanisms genuinely add value
- Why full TradFi replacement is not realistic

**Tone:** Restrained. Focus on "programmable infrastructure" not "decentralised revolution."

---

### Conclusion (100–120 words)

**Must answer:**
- What is the final judgment on tokenised green bonds
- Why FT is the right form
- What is the real success factor (hint: legal + market infrastructure, not just tech)

**Must NOT do:**
- Repeat the abstract
- Summarise every section
- Make promises

---

## Figures Required

### Figure 1: Lifecycle / Transaction Flow Diagram

```
Issuer / Arranger
      ↓
KYC + Qualification (whitelist)
      ↓
Subscription
      ↓
Payment (fiat / tokenised cash)
      ↓
Mint / Allocate Bond Tokens
      ↓
Coupon Servicing (conceptual)
      ↓
Restricted Secondary Transfer
      ↓
Maturity Redemption / Burn
```

### Figure 2: Token Rights and Controls

```
Green Bond Token (HKGBT)
├── Rights
│   ├── Coupon entitlement
│   ├── Principal repayment at maturity
│   └── Green disclosure / reporting access
└── Controls
    ├── Whitelist-based holding restriction
    ├── Transfer restriction (non-whitelisted reverts)
    ├── Pause / unpause (emergency halt)
    ├── Admin-only issuance (mint)
    └── Redemption / burn at maturity
```

---

## References Approach

- Cite the coursework brief for scope constraints
- Cite 2–3 industry reports (HKMA, SFC, BIS, IOSCO) for regulatory context
- Cite 1–2 tokenisation frameworks (Tokeny, DTCC/BCG) for market structure
- Do NOT over-cite blockchain whitepapers or generic DeFi sources

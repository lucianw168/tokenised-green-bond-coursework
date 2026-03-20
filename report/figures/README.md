# Figures

Place diagram source files in this directory.

## Required Figures

### Figure 1: Lifecycle / Transaction Flow Diagram

Create a flow diagram showing the bond lifecycle:

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

Suggested tool: draw.io, Lucidchart, or PowerPoint.
Export as: `lifecycle-diagram.png`

### Figure 2: Token Rights and Controls Diagram

Create a structured diagram showing:

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

Export as: `token-design-diagram.png`

## Naming Convention

- `lifecycle-diagram.png` — Figure 1
- `token-design-diagram.png` — Figure 2
- Screenshots are in `../screenshots/`, not here.

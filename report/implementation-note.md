# Implementation Note

> Copy this block into Section 3 (Token Structure and Design) of the final report, after describing the token's lifecycle controls.

---

**Implementation note:**
A simplified proof-of-concept smart contract, GreenBondToken, was deployed on sepolia.

- **Contract address:** 0x1b48384Cb42a292975F4D4cD78D7EDa2A6F34F1E
- **Explorer link:** https://sepolia.etherscan.io/address/0x1b48384Cb42a292975F4D4cD78D7EDa2A6F34F1E
- **GitHub repository:** `https://github.com/lucianw168/tokenised-green-bond-coursework`

The prototype demonstrates whitelist-based eligibility, controlled issuance, restricted transfer, pause, and redemption/burn. It is a coursework-scope prototype, not a production-ready regulated issuance platform. Coupon distribution is discussed conceptually in this report but is not implemented on-chain.

---

> After deployment, run `node scripts/fill-deployment-info.js <network>` to populate the values above from `deployments/<network>.json`.

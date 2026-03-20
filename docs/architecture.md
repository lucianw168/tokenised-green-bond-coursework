# Architecture – GreenBondToken

## Design Rationale

The GreenBondToken contract is a single-contract ERC-20 prototype that models a **permissioned fungible token** for a Hong Kong-oriented tokenised green bond. The design prioritises auditability and compliance demonstration over technical complexity.

## Why a Single Contract

A minimal, single-contract design was chosen because:

1. The coursework goal is to demonstrate core lifecycle controls, not to build production infrastructure.
2. A single contract is easier for assessors to read, test, and verify.
3. All five core features (whitelist, mint, restricted transfer, pause, redeem/burn) can coexist in one contract without architectural compromise.

## Inheritance and Dependencies

```
GreenBondToken
  ├── ERC20       (OpenZeppelin) – standard fungible token interface
  ├── Ownable     (OpenZeppelin) – owner-only admin functions
  └── Pausable    (OpenZeppelin) – emergency pause mechanism
```

No custom base contracts or libraries are used. All extensions come from audited OpenZeppelin v5 contracts.

## Feature Architecture

### 1. Whitelist (Permissioned Holding)

- A `mapping(address => bool) public whitelisted` stores approved addresses.
- `addToWhitelist` / `removeFromWhitelist` are `onlyOwner`.
- The `_update` hook checks `whitelisted[to]` on every transfer.
- This simulates the on-chain outcome of off-chain KYC/AML clearance.

### 2. Controlled Issuance (Mint)

- `mint(address _to, uint256 _amount)` is `onlyOwner`.
- The recipient must be whitelisted — enforced in `mint()` before `_mint()` is called.
- Emits `BondIssued(investor, amount)`.

### 3. Restricted Transfer

- Implemented via `_update()` override (OpenZeppelin v5 pattern).
- If `to` is not `address(0)` (i.e., not a burn) and `from` is not `address(0)` (i.e., not a mint), then `whitelisted[to]` must be `true`.
- This ensures no token can reach an unapproved holder via any transfer path.

### 4. Pause / Unpause

- Inherits `Pausable` from OpenZeppelin.
- `pause()` / `unpause()` are `onlyOwner`.
- The `_update()` hook calls `_requireNotPaused()` for regular transfers (not mint/burn).
- Demonstrates emergency or compliance-driven halt capability.

### 5. Redemption / Burn

- `redeem(uint256 _amount)` allows any token holder to burn their own tokens.
- Simulates bond maturity redemption; in production, this would be coupled with off-chain payment.
- Emits `Redeemed(investor, amount)`.

## Custom Errors

The contract uses Solidity custom errors (`NotWhitelisted`, `ZeroAddress`, `ZeroAmount`, `InsufficientBalance`) for gas efficiency and clearer revert reasons.

## What Is Intentionally Omitted

| Feature | Reason for Omission |
|---|---|
| Coupon engine | Conceptual only; described in report as a servicing layer |
| Role-based access (multi-admin) | Single `Ownable` is sufficient for prototype |
| Upgradability (proxy pattern) | Unnecessary complexity for coursework |
| On-chain KYC oracle | Off-chain in practice; whitelist is the on-chain abstraction |
| Automatic maturity trigger | `maturityTimestamp` is stored but not enforced |

## Security Considerations

- All admin functions are `onlyOwner`.
- Transfer restrictions cannot be bypassed — `_update` is the single enforcement point.
- The contract uses OpenZeppelin v5 audited code for all base functionality.
- No external calls, no reentrancy surface, no delegatecall.

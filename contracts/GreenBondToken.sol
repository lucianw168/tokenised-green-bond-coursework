// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title GreenBondToken
 * @notice Simplified proof-of-concept for a Hong Kong-oriented, compliant,
 *         permissioned tokenised green bond (ERC-20 fungible token).
 *
 * Core lifecycle controls:
 *   1. Whitelist-based holding  – only approved investors may receive tokens.
 *   2. Controlled issuance      – only the owner/admin can mint (primary allocation).
 *   3. Restricted transfer       – transfers to non-whitelisted addresses revert.
 *   4. Pause / unpause           – emergency or compliance-driven halt.
 *   5. Redemption / burn         – lifecycle closure; tokens burned on redemption.
 *
 * This contract is a coursework prototype, NOT a production-ready regulated
 * issuance platform.
 */
contract GreenBondToken is ERC20, Ownable, Pausable {
    // ──────────────────────────────────────────────────────────────
    // State
    // ──────────────────────────────────────────────────────────────

    /// @notice Unix timestamp representing the bond maturity date.
    uint256 public maturityTimestamp;

    /// @notice Mapping of addresses approved to hold and receive tokens.
    mapping(address => bool) public whitelisted;

    // ──────────────────────────────────────────────────────────────
    // Events
    // ──────────────────────────────────────────────────────────────

    event InvestorWhitelisted(address indexed investor);
    event InvestorRemovedFromWhitelist(address indexed investor);
    event BondIssued(address indexed investor, uint256 amount);
    event Redeemed(address indexed investor, uint256 amount);

    // ──────────────────────────────────────────────────────────────
    // Errors
    // ──────────────────────────────────────────────────────────────

    error NotWhitelisted(address account);
    error ZeroAddress();
    error ZeroAmount();
    error InsufficientBalance(address account, uint256 requested, uint256 available);

    // ──────────────────────────────────────────────────────────────
    // Constructor
    // ──────────────────────────────────────────────────────────────

    /**
     * @param _name         Token name, e.g. "HK Green Bond Token"
     * @param _symbol       Token symbol, e.g. "HKGBT"
     * @param _maturity     Unix timestamp for illustrative maturity date
     * @param _initialOwner Address that will own the contract (issuer/admin)
     */
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _maturity,
        address _initialOwner
    ) ERC20(_name, _symbol) Ownable(_initialOwner) {
        maturityTimestamp = _maturity;
    }

    // ──────────────────────────────────────────────────────────────
    // Whitelist management (owner only)
    // ──────────────────────────────────────────────────────────────

    /**
     * @notice Add an investor to the whitelist.
     * @param _investor Address to approve.
     */
    function addToWhitelist(address _investor) external onlyOwner {
        if (_investor == address(0)) revert ZeroAddress();
        whitelisted[_investor] = true;
        emit InvestorWhitelisted(_investor);
    }

    /**
     * @notice Remove an investor from the whitelist.
     * @param _investor Address to revoke.
     */
    function removeFromWhitelist(address _investor) external onlyOwner {
        if (_investor == address(0)) revert ZeroAddress();
        whitelisted[_investor] = false;
        emit InvestorRemovedFromWhitelist(_investor);
    }

    // ──────────────────────────────────────────────────────────────
    // Issuance (owner only)
    // ──────────────────────────────────────────────────────────────

    /**
     * @notice Mint (issue) tokens to a whitelisted investor.
     * @param _to     Recipient (must be whitelisted).
     * @param _amount Number of tokens (in wei units).
     */
    function mint(address _to, uint256 _amount) external onlyOwner {
        if (_to == address(0)) revert ZeroAddress();
        if (_amount == 0) revert ZeroAmount();
        if (!whitelisted[_to]) revert NotWhitelisted(_to);
        _mint(_to, _amount);
        emit BondIssued(_to, _amount);
    }

    // ──────────────────────────────────────────────────────────────
    // Redemption / burn
    // ──────────────────────────────────────────────────────────────

    /**
     * @notice Redeem tokens – burns the caller's tokens to simulate bond
     *         redemption at or after maturity.
     * @param _amount Number of tokens to redeem.
     */
    function redeem(uint256 _amount) external {
        if (_amount == 0) revert ZeroAmount();
        uint256 bal = balanceOf(msg.sender);
        if (bal < _amount) revert InsufficientBalance(msg.sender, _amount, bal);
        _burn(msg.sender, _amount);
        emit Redeemed(msg.sender, _amount);
    }

    // ──────────────────────────────────────────────────────────────
    // Pause / unpause (owner only)
    // ──────────────────────────────────────────────────────────────

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // ──────────────────────────────────────────────────────────────
    // Transfer restriction hook
    // ──────────────────────────────────────────────────────────────

    /**
     * @dev Overrides ERC-20 _update to enforce:
     *      - Contract is not paused.
     *      - Recipient is whitelisted (except for minting from address(0)
     *        and burning to address(0), which are handled separately).
     */
    function _update(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        // Allow burn (to == address(0)) without whitelist check
        if (to != address(0)) {
            // For minting (from == address(0)), whitelist is checked in mint().
            // For regular transfers, enforce whitelist on receiver.
            if (from != address(0) && !whitelisted[to]) {
                revert NotWhitelisted(to);
            }
        }

        // Enforce pause on all movements except minting and burning
        if (from != address(0) && to != address(0)) {
            _requireNotPaused();
        }

        super._update(from, to, amount);
    }
}

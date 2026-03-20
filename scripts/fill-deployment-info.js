/**
 * fill-deployment-info.js – After deploying to a testnet and running demo.js,
 * this script auto-fills ALL TO_BE_FILLED placeholders across documentation.
 *
 * Data sources:
 *   deployments/<network>.json   – deployment facts (CA, tx hash, etc.)
 *   deployments/demo-actors.json – role addresses (written by demo.js)
 *
 * Files updated:
 *   README.md, docs/deployment-proof.md, docs/demo-scenario.md,
 *   screenshots/captions.md, report/implementation-note.md, report/report-template.md
 *
 * Usage:
 *   node scripts/fill-deployment-info.js sepolia
 *   node scripts/fill-deployment-info.js holesky
 */

const fs = require("fs");
const path = require("path");

const network = process.argv[2];
if (!network) {
  console.error("Usage: node scripts/fill-deployment-info.js <network>");
  console.error("  e.g. node scripts/fill-deployment-info.js sepolia");
  process.exit(1);
}

const ROOT = path.join(__dirname, "..");
const deployPath = path.join(ROOT, "deployments", `${network}.json`);
const actorsPath = path.join(ROOT, "deployments", "demo-actors.json");

if (!fs.existsSync(deployPath)) {
  console.error(`Deployment file not found: ${deployPath}`);
  console.error("Run the deploy script first.");
  process.exit(1);
}

const d = JSON.parse(fs.readFileSync(deployPath, "utf8"));

// Load demo actors if available (written by demo.js)
let actors = null;
if (fs.existsSync(actorsPath)) {
  actors = JSON.parse(fs.readFileSync(actorsPath, "utf8"));
}

console.log("╔══════════════════════════════════════════════════════╗");
console.log("║    Fill Deployment Info into Docs                   ║");
console.log("╚══════════════════════════════════════════════════════╝");
console.log(`Network  : ${d.network}`);
console.log(`CA       : ${d.contractAddress}`);
console.log(`Tx Hash  : ${d.deploymentTxHash}`);
if (actors) {
  console.log(`Issuer   : ${actors.issuer}`);
  console.log(`Investor A: ${actors.investorA}`);
  console.log(`Investor B: ${actors.investorB}`);
  console.log(`Unapproved: ${actors.unapproved}`);
} else {
  console.log("⚠ No demo-actors.json found. Run demo.js first to fill actor addresses.");
}
console.log("");

// ── Git commit ─────────────────────────────────────────────────
let gitCommit = d.gitCommit;
if (gitCommit === "TO_BE_FILLED") {
  try {
    gitCommit = require("child_process")
      .execSync("git rev-parse --short HEAD", { cwd: ROOT })
      .toString()
      .trim();
    d.gitCommit = gitCommit;
    fs.writeFileSync(deployPath, JSON.stringify(d, null, 2));
    console.log(`✔ Updated gitCommit in deployment JSON: ${gitCommit}`);
  } catch {
    console.log("⚠ Could not get git commit hash (not a git repo?)");
  }
}

// ── Files to update ────────────────────────────────────────────
const filesToUpdate = [
  "README.md",
  "docs/deployment-proof.md",
  "docs/demo-scenario.md",
  "screenshots/captions.md",
  "report/implementation-note.md",
  "report/report-template.md",
];

// ── README.md ──────────────────────────────────────────────────
function updateReadme(content) {
  content = content
    .replace(
      /\| Network \| `TO_BE_FILLED` \|/,
      `| Network | \`${d.network}\` |`
    )
    .replace(
      /\| Chain ID \| `TO_BE_FILLED` \|/,
      `| Chain ID | \`${d.chainId}\` |`
    )
    .replace(
      /\| Contract Address \| `TO_BE_FILLED` \|/,
      `| Contract Address | \`${d.contractAddress}\` |`
    )
    .replace(
      /\| Deployment Tx \| `TO_BE_FILLED` \|/,
      `| Deployment Tx | \`${d.deploymentTxHash}\` |`
    )
    .replace(
      /\| Explorer Link \| `TO_BE_FILLED` \|/,
      `| Explorer Link | [View on Explorer](${d.explorerAddressUrl}) |`
    )
    .replace(
      /\| Source Verified \| `TO_BE_FILLED` \|/,
      `| Source Verified | \`${d.sourceVerified}\` |`
    );

  // Implementation note in README
  content = content.replace(
    /GreenBondToken, was deployed on `TO_BE_FILLED`/,
    `GreenBondToken, was deployed on ${d.network}`
  );
  content = content.replace(
    /Contract address: `TO_BE_FILLED`/,
    `Contract address: ${d.contractAddress}`
  );
  content = content.replace(
    /Explorer link: `TO_BE_FILLED`/,
    `Explorer link: ${d.explorerAddressUrl}`
  );

  return content;
}

// ── deployment-proof.md ────────────────────────────────────────
function updateDeploymentProof(content) {
  content = content
    .replace(
      /\| Network \| `TO_BE_FILLED` \|/,
      `| Network | \`${d.network}\` |`
    )
    .replace(
      /\| Chain ID \| `TO_BE_FILLED` \|/,
      `| Chain ID | \`${d.chainId}\` |`
    )
    .replace(
      /\| Contract Address \(CA\) \| `TO_BE_FILLED` \|/,
      `| Contract Address (CA) | \`${d.contractAddress}\` |`
    )
    .replace(
      /\| Deployment Tx Hash \| `TO_BE_FILLED` \|/,
      `| Deployment Tx Hash | \`${d.deploymentTxHash}\` |`
    )
    .replace(
      /\| Block Number \| `TO_BE_FILLED` \|/,
      `| Block Number | \`${d.blockNumber}\` |`
    )
    .replace(
      /\| Deployed At \(UTC\) \| `TO_BE_FILLED` \|/,
      `| Deployed At (UTC) | \`${d.deployedAtUtc}\` |`
    )
    .replace(
      /\| Deployer Address \| `TO_BE_FILLED` \|/,
      `| Deployer Address | \`${d.deployerAddress}\` |`
    )
    .replace(
      /\| Owner Address \| `TO_BE_FILLED` \|/,
      `| Owner Address | \`${d.ownerAddress}\` |`
    )
    .replace(
      /\| Maturity Timestamp \| `TO_BE_FILLED` \(illustrative, ~1 year from deploy\) \|/,
      `| Maturity Timestamp | \`${d.maturityTimestamp}\` (illustrative, ~1 year from deploy) |`
    )
    .replace(
      /\| Initial Owner \| `TO_BE_FILLED` \(same as deployer\) \|/,
      `| Initial Owner | \`${d.ownerAddress}\` (same as deployer) |`
    );

  return content;
}

// ── demo-scenario.md ───────────────────────────────────────────
function updateDemoScenario(content) {
  if (actors) {
    content = content.replace(
      /\| \*\*Issuer\/Admin\*\* \|([^|]+)\| `TO_BE_FILLED` \(deployer\) \|/,
      `| **Issuer/Admin** |$1| \`${actors.issuer}\` (deployer) |`
    );
    content = content.replace(
      /\| \*\*Investor A\*\* \|([^|]+)\| `TO_BE_FILLED` \|/,
      `| **Investor A** |$1| \`${actors.investorA}\` |`
    );
    content = content.replace(
      /\| \*\*Investor B\*\* \|([^|]+)\| `TO_BE_FILLED` \|/,
      `| **Investor B** |$1| \`${actors.investorB}\` |`
    );
    content = content.replace(
      /\| \*\*Unapproved Wallet\*\* \|([^|]+)\| `TO_BE_FILLED` \|/,
      `| **Unapproved Wallet** |$1| \`${actors.unapproved}\` |`
    );
  } else {
    // Fall back to deployer address only
    const issuer = d.deployerAddress || "TO_BE_FILLED";
    content = content.replace(
      /\| \*\*Issuer\/Admin\*\* \|([^|]+)\| `TO_BE_FILLED` \(deployer\) \|/,
      `| **Issuer/Admin** |$1| \`${issuer}\` (deployer) |`
    );
  }
  return content;
}

// ── captions.md ────────────────────────────────────────────────
function updateCaptions(content) {
  content = content.replace(
    /Network: `TO_BE_FILLED`/,
    `Network: ${d.network}`
  );
  content = content.replace(
    /Contract Address: `TO_BE_FILLED`/,
    `Contract Address: ${d.contractAddress}`
  );
  return content;
}

// ── report/implementation-note.md ──────────────────────────────
function updateImplementationNote(content) {
  content = content.replace(
    /deployed on `TO_BE_FILLED`/,
    `deployed on ${d.network}`
  );
  content = content.replace(
    /\*\*Contract address:\*\* `TO_BE_FILLED`/,
    `**Contract address:** ${d.contractAddress}`
  );
  content = content.replace(
    /\*\*Explorer link:\*\* `TO_BE_FILLED`/,
    `**Explorer link:** ${d.explorerAddressUrl}`
  );
  return content;
}

// ── report/report-template.md ──────────────────────────────────
function updateReportTemplate(content) {
  content = content.replace(
    /GreenBondToken, was deployed on `TO_BE_FILLED`/,
    `GreenBondToken, was deployed on ${d.network}`
  );
  content = content.replace(
    /Contract address: `TO_BE_FILLED`/,
    `Contract address: ${d.contractAddress}`
  );
  content = content.replace(
    /Explorer link: `TO_BE_FILLED`/,
    `Explorer link: ${d.explorerAddressUrl}`
  );
  // The GitHub repo placeholder stays — user fills manually
  return content;
}

// ── Apply all updates ──────────────────────────────────────────
const updaters = {
  "README.md": updateReadme,
  "docs/deployment-proof.md": updateDeploymentProof,
  "docs/demo-scenario.md": updateDemoScenario,
  "screenshots/captions.md": updateCaptions,
  "report/implementation-note.md": updateImplementationNote,
  "report/report-template.md": updateReportTemplate,
};

let totalReplacements = 0;
for (const relPath of filesToUpdate) {
  const absPath = path.join(ROOT, relPath);
  if (!fs.existsSync(absPath)) {
    console.log(`⚠ Skipped ${relPath} (not found)`);
    continue;
  }

  const before = fs.readFileSync(absPath, "utf8");
  const after = updaters[relPath](before);

  if (before !== after) {
    fs.writeFileSync(absPath, after);
    const count = (before.match(/TO_BE_FILLED/g) || []).length -
                  (after.match(/TO_BE_FILLED/g) || []).length;
    totalReplacements += count;
    console.log(`✔ Updated ${relPath} (${count} placeholder${count !== 1 ? "s" : ""} filled)`);
  } else {
    console.log(`  ${relPath} — no changes needed`);
  }
}

console.log("");
console.log(`Done. ${totalReplacements} total placeholders filled.`);

// Count remaining TO_BE_FILLED across ALL tracked files
const allTrackedFiles = [
  ...filesToUpdate,
  "report/implementation-note.md",
  "report/report-template.md",
];
const uniqueFiles = [...new Set(allTrackedFiles)];
let remaining = 0;
const remainingDetails = [];
for (const relPath of uniqueFiles) {
  const absPath = path.join(ROOT, relPath);
  if (fs.existsSync(absPath)) {
    const content = fs.readFileSync(absPath, "utf8");
    const matches = content.match(/TO_BE_FILLED/g);
    if (matches) {
      remaining += matches.length;
      remainingDetails.push(`  ${relPath}: ${matches.length}`);
    }
  }
}
if (remaining > 0) {
  console.log(`⚠ ${remaining} placeholder(s) still remaining:`);
  remainingDetails.forEach((line) => console.log(line));
  console.log("  Fill these manually (e.g. GitHub repository URL).");
} else {
  console.log("✔ All placeholders filled across documentation.");
}

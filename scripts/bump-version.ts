#!/usr/bin/env -S deno run --allow-read --allow-write --allow-run
/**
 * Version Bump Script
 *
 * Usage:
 *   deno run --allow-read --allow-write --allow-run scripts/bump-version.ts patch
 *   deno run --allow-read --allow-write --allow-run scripts/bump-version.ts minor
 *   deno run --allow-read --allow-write --allow-run scripts/bump-version.ts major
 *   deno run --allow-read --allow-write --allow-run scripts/bump-version.ts 1.2.3
 */

const DENO_JSON_PATH = "deno.json";
const CHANGELOG_PATH = "CHANGELOG.md";

type BumpType = "patch" | "minor" | "major";

function parseVersion(version: string): [number, number, number] {
  const [major, minor, patch] = version.split(".").map(Number);
  return [major ?? 0, minor ?? 0, patch ?? 0];
}

function bumpVersion(current: string, type: BumpType | string): string {
  // If it's a specific version, validate and return it
  if (/^\d+\.\d+\.\d+$/.test(type)) {
    return type;
  }

  const [major, minor, patch] = parseVersion(current);

  switch (type) {
    case "patch":
      return `${major}.${minor}.${patch + 1}`;
    case "minor":
      return `${major}.${minor + 1}.0`;
    case "major":
      return `${major + 1}.0.0`;
    default:
      throw new Error(`Invalid bump type: ${type}. Use patch, minor, major, or x.y.z`);
  }
}

async function main() {
  const bumpType = Deno.args[0];

  if (!bumpType) {
    console.error("Usage: bump-version.ts <patch|minor|major|x.y.z>");
    Deno.exit(1);
  }

  // Read current deno.json
  const denoJson = JSON.parse(await Deno.readTextFile(DENO_JSON_PATH));
  const currentVersion = denoJson.version;
  const newVersion = bumpVersion(currentVersion, bumpType);

  console.log(`Bumping version: ${currentVersion} → ${newVersion}`);

  // Update deno.json
  denoJson.version = newVersion;
  await Deno.writeTextFile(DENO_JSON_PATH, JSON.stringify(denoJson, null, 2) + "\n");
  console.log(`✅ Updated ${DENO_JSON_PATH}`);

  // Update CHANGELOG.md
  const changelog = await Deno.readTextFile(CHANGELOG_PATH);
  const date = new Date().toISOString().split("T")[0];
  const newEntry = `## [${newVersion}] - ${date}\n\n### Changed\n\n- Version bump\n\n`;
  const updatedChangelog = changelog.replace(
    "## [Unreleased]\n\n",
    `## [Unreleased]\n\n${newEntry}`,
  );
  await Deno.writeTextFile(CHANGELOG_PATH, updatedChangelog);
  console.log(`✅ Updated ${CHANGELOG_PATH}`);

  // Git commands
  console.log("\n📝 Running git commands...");

  const gitAdd = new Deno.Command("git", {
    args: ["add", DENO_JSON_PATH, CHANGELOG_PATH],
  });
  await gitAdd.output();

  const gitCommit = new Deno.Command("git", {
    args: ["commit", "-m", `chore: bump version to ${newVersion}`],
  });
  await gitCommit.output();

  const gitTag = new Deno.Command("git", {
    args: ["tag", "-a", `v${newVersion}`, "-m", `Release v${newVersion}`],
  });
  await gitTag.output();

  console.log(`✅ Created commit and tag v${newVersion}`);
  console.log(`\n🚀 To publish, run:\n   git push origin main --tags`);
}

main();

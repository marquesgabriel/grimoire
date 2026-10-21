// Checks the grimoire's structure: skill frontmatter, folder names, the
// index and the plugin version. Run with `node scripts/validate.mjs`;
// exits with 1 and lists every problem found.

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const TIERS = ["library", "incubator", "graveyard"];
const NAME_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const MAX_NAME = 64;
const MAX_DESCRIPTION = 1024;

const errors = [];
const fail = (message) => errors.push(message);

const subdirs = (path) =>
  existsSync(path)
    ? readdirSync(path).filter((entry) => statSync(join(path, entry)).isDirectory())
    : [];

// Minimal YAML frontmatter reader: `key: value` pairs, plus folded (`>`)
// and literal (`|`) blocks, which is all a SKILL.md needs.
function readFrontmatter(file) {
  const text = readFileSync(file, "utf8").replace(/\r\n/g, "\n");
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return null;
  const fields = {};
  const lines = match[1].split("\n");
  for (let i = 0; i < lines.length; i++) {
    const pair = lines[i].match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!pair) continue;
    let [, key, value] = pair;
    if (value === ">" || value === "|") {
      const block = [];
      while (i + 1 < lines.length && /^\s+\S|^\s*$/.test(lines[i + 1])) {
        block.push(lines[++i].trim());
      }
      value = block.join(value === ">" ? " " : "\n").trim();
    }
    fields[key] = value.replace(/^["']|["']$/g, "");
  }
  return fields;
}

// The text of each `## <Tier>` section of INDEX.md, so an item can be
// checked against the section of its own maturity.
function readIndexSections() {
  if (!existsSync("INDEX.md")) {
    fail("INDEX.md is missing");
    return {};
  }
  const sections = {};
  let current = null;
  for (const line of readFileSync("INDEX.md", "utf8").split(/\r?\n/)) {
    const heading = line.match(/^## (\w+)/);
    if (heading) current = heading[1].toLowerCase();
    else if (current) sections[current] = (sections[current] ?? "") + line + "\n";
  }
  return sections;
}

const index = readIndexSections();

for (const tier of TIERS) {
  for (const name of subdirs(join(tier, "skills"))) {
    const where = `${tier}/skills/${name}`;
    const skillFile = join(where, "SKILL.md");
    if (!existsSync(skillFile)) {
      fail(`${where}: SKILL.md is missing`);
      continue;
    }
    const fields = readFrontmatter(skillFile);
    if (!fields) {
      fail(`${where}: SKILL.md has no frontmatter`);
      continue;
    }
    if (fields.name !== name) {
      fail(`${where}: frontmatter name "${fields.name}" doesn't match the folder name`);
    }
    if (!NAME_PATTERN.test(name) || name.length > MAX_NAME) {
      fail(`${where}: name must be lowercase words joined by hyphens, at most ${MAX_NAME} characters`);
    }
    const description = fields.description ?? "";
    if (!description) fail(`${where}: description is missing`);
    if ([...description].length > MAX_DESCRIPTION) {
      fail(`${where}: description has ${[...description].length} characters (max ${MAX_DESCRIPTION})`);
    }
    if (tier === "graveyard" && !existsSync(join(where, "EPITAPH.md"))) {
      fail(`${where}: retired skills need an EPITAPH.md`);
    }
    if (!(index[tier] ?? "").includes(`\`${name}\``)) {
      fail(`${where}: not listed in the ${tier} section of INDEX.md`);
    }
  }

  for (const name of subdirs(join(tier, "docs"))) {
    const where = `${tier}/docs/${name}`;
    if (!existsSync(join(where, "README.md"))) fail(`${where}: README.md is missing`);
    if (!(index[tier] ?? "").includes(`\`${name}\``)) {
      fail(`${where}: not listed in the ${tier} section of INDEX.md`);
    }
  }
}

// The plugin version must match the latest released version, if any.
const plugin = JSON.parse(readFileSync("library/.claude-plugin/plugin.json", "utf8"));
const latest = readFileSync("CHANGELOG.md", "utf8").match(/^## \[v(\d+\.\d+\.\d+)\]/m);
if (latest && latest[1] !== plugin.version) {
  fail(`plugin.json version ${plugin.version} doesn't match the latest CHANGELOG version ${latest[1]}`);
}

if (errors.length) {
  console.error(`✗ ${errors.length} problem(s):\n` + errors.map((e) => `  - ${e}`).join("\n"));
  process.exit(1);
}
console.log("✔ Grimoire structure is valid");

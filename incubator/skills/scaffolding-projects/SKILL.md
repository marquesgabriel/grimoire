---
name: scaffolding-projects
description: Standard structure and tooling conventions for this user's React/TypeScript frontend projects, distilled from marquesgabriel.github.io (reference implementation) and applied to token-generator (mtg). Use when setting up a new frontend project, or when auditing/aligning an existing one against the established standard.
---

# Personal project scaffold standard

Distilled from cross-referencing `marquesgabriel.github.io` (portfolio, the
more mature reference implementation) and `mtg`/`token-generator` during
their initial development sessions. Apply this when scaffolding a new
project, or when asked to bring an existing project in line with the
standard.

## Package manager

**Not standardized — stays per-project.** `mtg` uses yarn (`yarn.lock`),
the portfolio uses npm (`package-lock.json`). Don't switch an existing
project's package manager unless explicitly asked. For a brand-new
project, either is fine — ask if unspecified.

## Build tool

**Vite**, not Create React App. CRA is unmaintained; Vite gives a faster
dev server/build and is what both projects converge on (`mtg` finished
migrating off CRA in #20, 2026-08-25). Vite config:

```js
envPrefix: 'REACT_APP_',
```

Keep the `REACT_APP_` prefix even on Vite (not Vite's default `VITE_`) —
this is a deliberate cross-project convention so env var names don't
change when a project migrates off CRA, and so copy-pasted `.env` files
between old and new projects still work.

## App version as a global console variable

Every app exposes its running version as `window.APP_VERSION`, checkable
on demand in the browser console — not just a one-time startup log that
scrolls away. Vite implementation (preferred):

```js
// vite.config.js
import { readFileSync } from 'fs';
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8'));
export default defineConfig({
  define: { __APP_VERSION__: JSON.stringify(pkg.version) },
  // ...
});
```

```ts
// src/index.tsx
(window as any).APP_VERSION = __APP_VERSION__;
console.log(`App version: ${__APP_VERSION__} (also available as window.APP_VERSION)`);
```

(Legacy CRA implementation, only relevant for a project not yet migrated
to Vite: a `scripts/inject-version.js` run via `pre*` npm hooks writes
`REACT_APP_VERSION` into `.env.local` from `package.json`, cross-platform,
no shell-specific env syntax — see `mtg`'s `scripts/inject-version.js` for
the reference implementation.)

## Versioning

`package.json`'s `version` follows **SemVer** (`MAJOR.MINOR.PATCH`):
`MAJOR` for breaking changes, `MINOR` for backward-compatible features,
`PATCH` for backward-compatible fixes. Maps naturally onto the Conventional
Commits used for commit messages (see Commit convention below) —
`fix:` → patch, `feat:` → minor, a `BREAKING CHANGE:` footer/`!` → major.
This is also the value exposed as `window.APP_VERSION` (see above), so an
unbumped version after a real change means the in-app version display is
lying.

`mtg` automates this bump (`.github/workflows/version-bump.yml`, added for
the v1.1.1 release): on every push to `main`, it parses commit subjects
since the last tag and computes the next version per the mapping above,
commits `chore(release): bump version to vX.Y.Z`, and pushes using the same
deploy PAT (`ACTIONS_DEPLOY_ACCESS_TOKEN`) `deploy.yml` already uses —
required so the push re-triggers `deploy.yml`/`release.yml`, since pushes
made with the default `GITHUB_TOKEN` don't chain further workflow runs.
This makes Conventional Commits functionally required, not just style: a
commit that doesn't follow the format won't count toward any bump. Prefer
this pattern (a small hand-rolled workflow, no `semantic-release`/
`standard-version` dependency) when scaffolding release automation for a
new project too.

## Releases and release branches

`mtg` is the reference implementation for this: a long-lived `release/x.y.z`
branch (currently `release/1.0.0`) is the actual PR base, not `main`/the
repo's default branch — see PR base branch below, this is the #1 way this
convention trips up tooling that assumes `main` is where work lands. Day-to-day
feature/fix PRs target the release branch; `main` only moves when that
release branch is cut/merged in, at which point `package.json`'s version
should already reflect the release being cut. When starting a project fresh,
plain trunk-based development against `main` is fine until there's an actual
need to stabilize a release while new work continues — don't introduce a
release branch preemptively.

**Merging the release branch into `main` does not create a git tag or
GitHub Release by itself** — that's always a separate, explicit step.
Automate it with a `release.yml` workflow (`on: push: branches: ["main"]`,
`permissions: contents: write`): read the version from `package.json`,
check `git ls-remote --tags origin` for a matching `vX.Y.Z` tag, and if it
doesn't exist, tag the commit + `gh release create --generate-notes`. Make
it idempotent (skip if the tag already exists) rather than assuming every
push to main is a fresh release — a re-run or an unrelated push shouldn't
fail on a duplicate tag. Uses the default `GITHUB_TOKEN`, no extra secret.
`mtg`'s v1.0.0 release was tagged by hand before this workflow existed —
don't repeat that manual step on the next project.

After cutting a release: create a milestone named after the version, retro-
assign it to every issue that shipped in that release, close the
milestone, and archive (not delete) those issues' Project-board items so
the board's default view only shows active/upcoming work — see Issue
labels and Project board Status below for the archive-item mutation and
its gotchas.

## Folder layout

```
src/
  components/           # Reusable, presentational React components
    index.tsx            # Barrel export
    tests/                # Component tests live alongside, in their own subfolder
  types/
    index.ts             # Shared TS types, one barrel file unless it grows large
  utils/
    index.ts             # Barrel export
    <specific>.ts         # e.g. supabase client, parsers — one concern per file
  styles/                 # SCSS, one file per theme/concern, imported from a single entry point
  i18n/                   # Only if the project is multi-language
  data/                   # Static assets imported by the app (not just served from /public)
  App.tsx                 # Root component — orchestrates state/effects, composes sections
  App.test.tsx
  index.tsx                # Entry point
  declarations.d.ts        # Ambient module declarations (*.scss, *.min.css, __APP_VERSION__, etc)
  setupTests.ts
```

For a form-heavy or section-heavy `App.tsx`: split into per-section
presentational components (`<Thing>Section.tsx`) that take shared state
(e.g. a Formik instance) as props, rather than letting `App.tsx` grow into
a monolith. `App.tsx` should end up only owning state/effects/handlers and
composing the pieces (see `mtg`'s `CardStyleSection`/`ImageUploadSection`/
`CardDataSection` split, issue #14).

## Linting

**ESLint flat config** (`eslint.config.js`), not the legacy `eslintConfig`
field in `package.json`. The portfolio already uses flat config; `mtg`
still uses the legacy field (tracked as backlog debt — don't silently
"fix" this mid-unrelated-PR, it's its own migration).

`npm run lint` / `yarn lint` must run with zero tolerance for warnings in
CI (`--max-warnings 0` or equivalent) — a lint step that only warns is a
lint step nobody reads.

## Formatting

Prettier, wired into a **husky pre-commit hook + lint-staged** so it's
enforced automatically on every commit, not just optionally run. If
retrofitting Prettier onto a project with no prior formatting standard,
do NOT mass-reformat the whole tree in the same PR that introduces the
tool — it creates a huge diff that conflicts with every other in-flight
PR. Configure the tool, enforce it going forward, and do the full reformat
as its own isolated PR once other work has landed (see `mtg` issue #15's
reasoning).

## Testing

**Vitest** (Vite-native), not CRA's bundled Jest — faster, and it's the
test runner that ships when a project is on Vite. Configure a coverage
threshold (portfolio uses 80% branches/functions/lines/statements) and
enforce it in CI, not just locally.

When writing component tests: comply with `eslint-plugin-testing-library`
rules — use `screen.getByRole`/`getAllByRole`, never
`container.querySelector`/`.closest()`/direct DOM traversal. MUI multiline
`TextField`s render a hidden shadow `<textarea>` with the same accessible
name — `getAllByRole(...)[0]` is the established pattern for picking the
real one.

## CI/CD (GitHub Actions)

Two workflows, kept separate so a PR never triggers a deploy:

- `ci.yml` — `on: pull_request` (against the repo's actual review-base
  branch, which may not be the default branch — check for a
  release-branch flow first): install, lint, test (with coverage), build.
  Never deploys.
- `deploy.yml` — `on: push` to the default branch only: install, build,
  deploy (e.g. `gh-pages`). Never runs on `pull_request`.

Both branch-protect the review-base branch and the default branch: PR
required, the CI job's status check required (note the exact job name —
if you rename the job, update branch protection's required check in the
same PR or it looks "stuck pending" forever).

## PR base branch

**Never assume the repo's default branch is the PR base.** `gh pr create`
with no `--base` silently targets the default branch — for a repo on a
release-branch flow (e.g. `mtg` targets `release/1.0.0`, not `main`) this
opens the PR against the wrong branch without erroring. Before opening a
PR, check what recent merged PRs actually targeted:

```
gh pr list --state merged --limit 5 --json baseRefName
```

If a PR already landed on the wrong base, fix it with `gh pr edit <n>
--base <correct-branch>` rather than closing/reopening.

## Sequencing dependent work across multiple issues/PRs

When a batch of backlog issues is being worked through in one release and
some of them share a data model or design decision (e.g. one issue defines
a serialization format, another issue's feature consumes it), don't
implement them as independent parallel PRs — that risks defining the
shared piece twice and hitting a merge conflict or design mismatch when
the first one changes after review. Instead:

1. Identify the dependency chain up front and say so explicitly (e.g. "A
   needs B's data format, B needs A merged first" isn't fine, but "A
   defines the format, B builds on it" is a real A→B chain).
2. Implement in dependency order. For genuinely independent items in the
   same batch, order doesn't matter — call that out too so it's clear
   what *is* parallelizable.
3. For a downstream item whose upstream dependency isn't merged yet,
   branch it off the upstream's branch (not off the release branch) and
   open it as a **stacked PR** — its base is the upstream branch, not
   `release/x.y.z`. State the stack order explicitly in the PR
   description so review order is unambiguous (e.g. "Stacked on #N (base
   branch) — review that one first").
4. If the upstream PR changes after review, the downstream branch needs a
   rebase — expect this, don't treat it as a problem.

This was worked out for `mtg`'s gallery (issue #7) depending on JSON save/
load (issue #6)'s token-serialization format, with print-sheet layout
(issue #10) stacked another level on top of #7 for its per-card copy
count. Stacking doesn't
change that each PR in the chain still needs its own review/merge
approval, it only changes what branch it's opened against.

## Monetization (AdSense)

Same AdSense publisher account reused across projects (one Publisher ID,
configured once as the `REACT_APP_ADSENSE_PUBLISHER_ID` GitHub Actions
**variable** per repo — see Env vars below). Two independent pieces, both
required, neither substitutes for the other:

- **Consent-gated ad script** — a `SupportSidebar` component (see `mtg`'s
  `src/SupportSidebar.tsx`, ported to the portfolio's
  `src/components/SupportSidebar.tsx`) that only injects the
  `adsbygoogle.js` script and calls `(adsbygoogle = adsbygoogle ||
  []).push({})` after the user explicitly accepts a cookie-consent prompt
  (stored in `localStorage`). This is a legal requirement, not UX
  polish — never load the ad script unconditionally. Renders nothing if
  no Publisher ID is configured (e.g. local dev).
- **Site-ownership verification meta tag** — `<meta
  name="google-adsense-account" content="%REACT_APP_ADSENSE_PUBLISHER_ID%">`
  in `index.html` / `public/index.html`. Google reads this at crawl time
  regardless of consent state, so it's unconditional and independent of
  the SupportSidebar's consent gate. Both CRA (`public/index.html`) and
  Vite (`index.html`, given `envPrefix: 'REACT_APP_'`) support the
  `%VAR%` substitution natively — verify with a local build
  (`REACT_APP_ADSENSE_PUBLISHER_ID=<id> npm run build` then grep the
  built `index.html`) rather than assuming it works.

When porting mtg's MUI-based `SupportSidebar` to a non-MUI project, swap
`@mui/material` `Button`/`Typography` for plain `<button>`/`<p>` with the
project's own styling — don't add MUI as a new dependency just for this.

## Issue labels and Project board Status

**Labels** — every issue gets exactly one type label distinguishing what
kind of work it is: `bug` (behavior is wrong) vs `enhancement` (new
capability) vs `tech-debt` (refactor/cleanup/infra, no user-facing
behavior change) vs `documentation` (docs-only). The default GitHub label
set covers `bug`/`enhancement`/`documentation`; `tech-debt` is a custom
addition (`gh label create "tech-debt" --description "..." --color
"fbca04"`) that both `mtg` and the portfolio now have — add it to any new
repo rather than overloading `enhancement` for maintenance work.

**Status field** — the Projects v2 board's Status field is `Triage, Todo,
In Progress, Done` (four options, `Triage` first). `Triage` = filed but
not yet reviewed/prioritized — this is where a freshly-filed issue (e.g.
from a code-review pass) starts, distinct from `Todo` (reviewed, ready to
pick up, prioritized). Both project boards were originally missing
`Triage`; it was added after the fact via `gh api graphql` calling
`updateProjectV2Field`.

**Danger when editing an existing Status field's options**:
`updateProjectV2Field`'s `singleSelectOptions` argument replaces the
*entire* option list — there is no "add one option" mutation in the
public API. Even re-submitting the existing option names generates new
option IDs for all of them, which **silently unsets every item's current
Status** (GitHub Projects stores each item's value by option ID, not
name) — hit this firsthand adding `Triage` to both boards, had to
reconstruct every item's Status from issue open/closed state afterward.
Before running this mutation on a board with existing items: 1) snapshot
every item's current Status first (`fieldValueByName(name: "Status")` per
item), 2) run the option-replacing mutation, 3) immediately restore every
item's Status via `updateProjectV2ItemFieldValue` using the *new* option
IDs the mutation just returned. Don't skip step 1 — reconstructing status
after the fact from issue open/closed state (open→Todo, closed→Done) is
a lossy approximation, not a real recovery, since it can't distinguish
Triage/Todo/In-Progress for still-open issues.

## GitHub Project board sync

`project-status.yml` (`on: pull_request`, `types: [opened, reopened,
closed]`) moves issues referenced via "Closes #N" in a PR body to "In
Progress" on open/reopen, "Done" on merge, via the GraphQL Projects v2
API. Needs a classic PAT (`repo` + `project` scopes) as a secret — the
default `GITHUB_TOKEN` can't write to user-owned Projects v2. Reuse an
existing PAT-backed secret (e.g. the one already added for `deploy.yml`)
rather than provisioning a new one per workflow, if its scopes already
cover this.

**`PROJECT_NUMBER` is per-repo, not a shared constant** — each repo has
its own board (verify via GraphQL: `user(login: "...")  { projectsV2 {
nodes { number title } } }`) and its Status field's option names can
differ; check both before porting this workflow to a new project, don't
copy the source repo's `PROJECT_NUMBER` verbatim.

## Branch protection

Once `ci.yml` exists and its job has a stable name, protect the
repo's actual base branch (see PR base branch above — may not be
`main`/`master`):

```
gh api repos/<owner>/<repo>/branches/<base>/protection -X PUT \
  -H "Accept: application/vnd.github+json" --input protection.json
```

with `protection.json` setting `required_status_checks.contexts` to the
exact CI job name (e.g. `"build (20.x)"`), `strict: true`, and
`enforce_admins`/`required_pull_request_reviews`/`restrictions` per the
repo's needs. The API needs a real JSON body (`--input`, not `-f`/`-F`
flags — GitHub's schema validation rejects the flattened form for nested
objects like `required_status_checks`).

## Branch pruning

Do periodically (when asked to "check the repo"/"clean up", or after a
batch of merges — not on some fixed schedule):

1. `git fetch --prune origin` first — GitHub already auto-deletes a
   remote branch when its PR merges via the UI/`gh pr merge
   --delete-branch`, so a big chunk of apparently-stale remote-tracking
   refs are often just local staleness, not real cleanup work. Re-check
   the branch list after pruning before deciding what's actually left.
2. For each remaining local/remote branch, diff it against the base
   branch (`git log --oneline <base>..<branch>`). Zero commits ahead =
   safe to delete, it's already merged. **Confirm with the repo owner
   before deleting anything** — branch deletion is destructive; batch the
   list into one confirmation rather than asking per-branch.
3. For a branch that still has unmerged commits but hasn't moved in a
   long time (weeks+, check `git log -1 --format=%cd <branch>`), don't
   assume it's safe to delete just because it's old — check relevance
   first (is it superseded by work already on the base branch, e.g. a
   feature that shipped a different way? Is it genuinely still WIP?)
   and say what you found rather than silently dropping it.

## Commit convention

Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `test:`,
`refactor:`). Both projects expose `commit`/`yarn commit` running
`git-cz`'s interactive prompt as a convenience. In `mtg` specifically this
is functionally required, not just style, once release automation parses
commit history to bump the version (see Versioning above) — commits made
on behalf of the user in this project must follow the format.

## Docs

- `README.md` with badges reflecting the actual current stack (check
  badges/CI links after a repo rename or workflow rename — they go stale
  silently).
- `CONTRIBUTING.md` covering setup, pre-PR checks, commit convention, and
  branching.
- `docs/ARCHITECTURE.md` for any project complex enough to need onboarding
  context beyond the README.
- `.github/PULL_REQUEST_TEMPLATE.md` with a summary + test-plan checklist.

## Env vars and secrets

- Client-exposed config: `REACT_APP_*` prefix (see above), read via
  `process.env`/`import.meta.env` in code, never hardcoded.
- Non-sensitive build-time values (e.g. an AdSense Publisher ID — already
  public in the deployed HTML) go in GitHub Actions **variables**
  (`vars.*`), not secrets.
- Actually sensitive values (API keys, tokens) go in **secrets**
  (`secrets.*`).
- Never commit a hardcoded value that should come from an env var, even
  temporarily for local QA — double-check before committing.

## Known cross-project debt (don't silently "fix" these mid-PR — they're tracked)

- `mtg`: migrated off CRA to Vite (#20, 2026-08-25) — tests moved to
  Vitest in the same change (react-scripts' Jest can't parse
  `import.meta.env`, so the two couldn't ship as separate PRs). Flat
  ESLint config, Prettier enforced in CI, husky+lint-staged, and the
  `components`/`utils` folder structure with barrel exports (#47) are
  all done too. Deliberately has **no `types/` folder** — audited what
  would go in it and every candidate type was tightly coupled to the
  one module that produces it (one is literally derived from a constant
  in the same file), so a separate barrel would only add an awkward
  import direction with no real benefit. Don't treat a missing `types/`
  as debt here without re-checking whether a genuinely shared,
  module-independent type exists yet to justify it.
- Portfolio: now has `ci.yml`, `deploy.yml`, branch protection, and
  Dependabot PRs are triaged promptly — this used to be debt (PRs sat
  unreviewed for months pre-CI) but isn't anymore as of 2026-08-20.
  Don't assume a repo without CI/deploy/protection still lacks them by
  the time you read this — check current state, not this list.

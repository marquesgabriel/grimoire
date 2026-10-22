---
name: scaffolding-projects
description: An opinionated standard for React/TypeScript front-end projects on GitHub - Vite, versioning and automated releases, CI/CD, branch protection, labels and a Projects board, pull-request flow, docs and env vars - distilled from real projects. Use when setting up a new front-end project, or when auditing an existing one and bringing it in line with the standard.
---

# Scaffolding projects

An opinionated standard for React/TypeScript front-end projects, distilled
from real projects. Use it in two ways:

- **New project:** set things up in the order of the sections below, asking
  only about what the standard leaves open.
- **Audit:** check an existing project section by section and report what
  matches, what's missing and what deviates. Fix only what was asked, one
  concern per pull request. A deviation can be deliberate: look for a reason
  in the project's docs before calling it debt.

Always **check the project's current state** instead of assuming it: files,
workflows, branch protection, the board and recent pull requests.

## Package manager

**Not standardized.** Keep whatever the project uses (`yarn.lock` or
`package-lock.json`); never switch it unless asked. For a new project, ask.

## Build tool

**Vite**, not Create React App (unmaintained).

Keep the **`REACT_APP_` env prefix** even on Vite (`envPrefix:
'REACT_APP_'`, or `['VITE_', 'REACT_APP_']`), so env var names don't change
when a project migrates off CRA and `.env` files stay portable between
projects.

## App version

Every app exposes its running version as `window.APP_VERSION`, checkable in
the browser console at any time, not just a startup log that scrolls away:

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

Declare `__APP_VERSION__` in `src/declarations.d.ts`.

## Versioning

`package.json`'s `version` follows **SemVer**, mapped from Conventional
Commits: `fix:` → patch, `feat:` → minor, `BREAKING CHANGE:` or `!` → major.
An unbumped version after a real change means `window.APP_VERSION` lies.

Automate the bump with a small hand-rolled workflow
(`.github/workflows/version-bump.yml`) instead of a dependency like
`semantic-release`. On push to `main` it:

1. parses the commit subjects since the last tag;
2. computes the next version;
3. commits `chore(release): bump version to vX.Y.Z`.

Push that commit with a PAT, not the default `GITHUB_TOKEN`. Pushes made with
`GITHUB_TOKEN` don't trigger other workflows, so deploy and release wouldn't
run. Reuse the PAT the deploy already uses.

This makes Conventional Commits functionally required: a commit outside the
format doesn't count toward any bump.

## Releases and release branches

Start **trunk-based against `main`**. Add a release branch only when there's
a real need to stabilize a release while new work continues; don't
introduce one preemptively.

With a release-branch flow:

- Day-to-day pull requests target the active `release/<name>` branch.
- `main` only receives the release promotion (plus the automated version
  bump).
- Prefer batching related work into one release over releasing after every
  pull request.

**Merging into `main` doesn't create a tag or a GitHub Release by itself.**
Automate it with a `release.yml` workflow:

- triggered by `on: push: branches: [main]`, with `permissions: contents:
  write`;
- reads the version from `package.json`;
- if `git ls-remote --tags origin` has no `vX.Y.Z` tag yet, tags the commit
  and runs `gh release create --generate-notes`.

Make it idempotent: a re-run or an unrelated push skips an existing tag
instead of failing. It uses the default `GITHUB_TOKEN`.

After a release, archive the board items of the issues it shipped, so the
board's default view shows only active and upcoming work. A milestone named
after the version is optional.

## Folder layout

```
src/
  components/      # Reusable presentational components
    index.tsx      # Barrel export
    tests/         # Component tests, in their own subfolder
  types/           # Shared types; only when a genuinely shared type exists
    index.ts
  utils/           # One concern per file (API client, parsers...)
    index.ts       # Barrel export
  styles/          # SCSS, one file per theme or concern, one entry point
  i18n/            # Only for multi-language projects
  data/            # Static data imported by the app
  App.tsx          # Owns state, effects and handlers; composes sections
  App.test.tsx
  index.tsx        # Entry point
  declarations.d.ts  # Ambient declarations (*.scss, __APP_VERSION__...)
  setupTests.ts
```

Don't create `types/` for types tightly coupled to the one module that
produces them. A barrel adds nothing there.

A form- or section-heavy `App.tsx` is split into presentational
`<Thing>Section.tsx` components that receive shared state (such as a
Formik instance) as props, instead of growing into a monolith.

## Linting

**ESLint flat config** (`eslint.config.js`), not the `eslintConfig` field in
`package.json`. Lint runs with zero tolerance for warnings in CI
(`--max-warnings 0`): a lint step that only warns is one nobody reads.

## Formatting

**Prettier**, enforced by a **husky pre-commit hook with lint-staged** and
by `format:check` in CI.

When adding Prettier to an existing project, **don't reformat the whole tree
in the same pull request**. That diff conflicts with every pull request in
flight. Configure and enforce it going forward first, then reformat
everything in a separate pull request once other work has landed.

## Testing

**Vitest**, not Jest. Set a coverage threshold (80% for branches,
functions, lines and statements is a good default) and enforce it in CI, not
just locally.

Component tests follow `eslint-plugin-testing-library`: query with
`screen.getByRole` and similar, never `container.querySelector`,
`.closest()` or other DOM traversal. With MUI, a multiline `TextField`
renders a hidden shadow `<textarea>` with the same accessible name;
`getAllByRole(...)[0]` picks the real one.

## CI/CD (GitHub Actions)

Two workflows, so a pull request never deploys:

- **`ci.yml`**, on `pull_request` against the integration branch (which may
  not be the default branch): install, lint, format check, type-check and
  build, tests with coverage. Never deploys.
- **`deploy.yml`**, on push to the default branch only: install, build,
  deploy (such as `gh-pages`).

## Branch protection

Once `ci.yml` has a stable job name, protect the integration branch (and
the default branch, if different):

- a pull request is required;
- the CI job is a required status check, with its exact name (such as
  `build (20.x)`).

```
gh api repos/<owner>/<repo>/branches/<branch>/protection -X PUT \
  -H "Accept: application/vnd.github+json" --input protection.json
```

`protection.json` sets `required_status_checks.contexts` to the job name and
`strict: true`. The API needs a real JSON body (`--input`); flattened `-f`
flags fail on nested objects.

**Renaming the CI job breaks protection silently:** the required check
waits forever. Update protection in the same pull request.

Branch protection on private repositories needs a paid GitHub plan; skip it
there and say so.

## Pull requests

- **Never assume the default branch is the base.** `gh pr create` without
  `--base` silently targets the default branch. Check where recent pull
  requests went:
  `gh pr list --state merged --limit 5 --json baseRefName`.
  Fix a wrong base with `gh pr edit <n> --base <branch>`, not by reopening.
- `Closes #N` in the body for every issue the pull request resolves.
- One concern per pull request where practical.

### Dependent pull requests

When one pull request builds on another (for example, one defines a data
format and the next consumes it):

1. **Say the dependency up front**, and also which items are independent and
   can go in parallel.
2. **Implement in dependency order.** Branch the later pull request **from
   the earlier one's branch, but keep the integration branch as the base of
   both**. Don't set the earlier branch as the base.
3. **State the merge order** in the later pull request's description, for
   example: "Depends on #N (branched from it); merge #N first."
4. **After the earlier one merges**, the later one shows only its own
   changes. If the earlier one changes during review, rebase the later one.

**Why not stack the bases:** a pull request based on another pull request's
branch merges *into that branch*. If the earlier pull request was already
merged and its branch kept, the later merge never reaches the integration
branch, and nothing warns about it. This happened in LaTeX-Resume (Oct 2026)
and lost a whole section from a release.

Each pull request still needs its own review and merge.

## Labels and the Projects board

**Labels.** Every issue gets exactly one type label:

| Label | Meaning |
|---|---|
| `bug` | Behavior is wrong |
| `enhancement` | New capability |
| `tech-debt` | Refactor, cleanup or infra, no user-facing change |
| `documentation` | Docs only |

`tech-debt` isn't a GitHub default; create it:
`gh label create tech-debt --description "..." --color fbca04`.

**Board.** A Projects v2 board per repository, named `<Project> Roadmap`. Its
Status field is `Triage, Todo, In Progress, Done`, with `Triage` first:

- **Triage:** filed but not reviewed yet.
- **Todo:** reviewed and ready to pick up.

**Editing an existing Status field's options resets every item.**
`updateProjectV2Field` replaces the whole option list and generates new
option IDs, even for unchanged names. Items store the option ID, so all of
them lose their Status (learned when adding `Triage` to existing boards in
Aug 2026). Before running it on a board with items:

1. Snapshot every item's Status.
2. Run the mutation.
3. Restore each item with `updateProjectV2ItemFieldValue`, using the new
   option IDs.

Rebuilding from open/closed state afterwards is lossy: it can't tell Triage,
Todo and In Progress apart.

### Board sync

A `project-status.yml` workflow (on `pull_request`: `opened`, `reopened`,
`closed`) reads `Closes #N` from the body:

- On open or reopen, it moves the issue to In Progress.
- On merge, it moves the issue to Done and closes it.

Closing it in the workflow matters on release branches, where GitHub's
auto-close doesn't fire.

- It needs a classic PAT with `repo` and `project` scopes as a secret: the
  default `GITHUB_TOKEN` can't write to user-owned boards. Reuse an existing
  PAT secret if its scopes cover it.
- **The project number and Status option names are per repository.** Check
  them before porting the workflow; never copy another repository's values.

## Commits

Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `test:`,
`refactor:`). A `commit` script running `git-cz` is a convenient extra. With
the version-bump automation, the format is required.

## Docs

- **`README.md`:** what it is, badges for the real stack and CI. Badges and
  CI links go stale silently after a rename; check them.
- **`CONTRIBUTING.md`:** setup, checks before a pull request, commit
  convention, branching and pull requests.
- **`docs/ARCHITECTURE.md`:** for anything that needs onboarding beyond the
  README.
- **`docs/REVIEW-CONVENTIONS.md`:** started when the project has its first
  non-obvious convention; see Grimoire's
  [review conventions](https://github.com/marquesgabriel/grimoire/blob/main/incubator/docs/review-conventions/README.md).
- **`.github/PULL_REQUEST_TEMPLATE.md`:** summary, test plan and
  `Closes #`.

## Env vars and secrets

- Client-side config uses the `REACT_APP_*` prefix, read from
  `import.meta.env`, never hardcoded.
- Non-sensitive build values (such as an AdSense Publisher ID, public in the
  deployed HTML) go in GitHub Actions **variables** (`vars.*`).
- Sensitive values (API keys, tokens) go in **secrets** (`secrets.*`).
- Never commit a value that should come from an env var, not even
  temporarily for local QA.

## Ads (optional)

If the project shows AdSense ads, it needs two independent pieces:

- **Consent-gated script.** A `SupportSidebar`-style component loads
  `adsbygoogle.js` and pushes the ad only after the user accepts a cookie
  consent prompt, stored in `localStorage`. It renders nothing without a
  Publisher ID, as in local dev. This is a legal requirement: never load the
  script unconditionally.
- **Ownership meta tag.** `<meta name="google-adsense-account"
  content="%REACT_APP_ADSENSE_PUBLISHER_ID%">` in `index.html`.
  - Google reads it at crawl time, so it doesn't depend on consent.
  - Vite substitutes `%VAR%` itself. Check a local build's `index.html`
    instead of assuming it works.

Use the project's own UI components; don't add a UI library just for this.

## Branch cleanup

After a batch of merges, or when asked to clean up:

1. `git fetch --prune origin` first. Much of what looks stale is only local.
2. For each remaining branch, check `git log --oneline <base>..<branch>`.
   Zero commits ahead means it's already merged.
3. For an old branch with unmerged commits, check whether it's superseded or
   still in progress, and report it instead of dropping it.
4. **Confirm with the owner before deleting anything**, as one list rather
   than branch by branch.

# Index

Everything in the grimoire, by maturity. See
[CONTRIBUTING.md](CONTRIBUTING.md#maturity) for what each level means.

## Library

Ready to use; installed with the `grimoire` plugin.

### Skills

| Skill | What it does |
|---|---|
| `gathering-requirements` | Interviews the user like a Product Owner and writes a requirements document. First step of the requirements → stories → code pipeline. |
| `writing-user-stories` | Breaks a requirements document into epics, features and user stories, with acceptance criteria, estimates, an implementation order and a review of technical gaps and business-rule risks. |
| `curating-resume` | Keeps a résumé kept as code up to date: confirms career facts with the user, records them, writes the bullets, builds and opens the pull request. Project specifics come from `docs/RESUME.md`; the job-tailoring mode is still provisional ([#9](https://github.com/marquesgabriel/grimoire/issues/9)). |

## Incubator

Works, but still being shaped. Not published.

### Skills

| Skill | What it does | What's missing |
|---|---|---|
| `coding-user-stories` | Implements a backlog story by story: one issue on the board and one branch and pull request per story, with tests, the project's checks and `Closes #N`, respecting dependencies and acceptance criteria. Last step of the requirements → stories → code pipeline. | A first real use in a project before promotion ([#6](https://github.com/marquesgabriel/grimoire/issues/6)). |
| `scaffolding-projects` | An opinionated standard for React/TypeScript projects on GitHub: Vite, versioning and releases, CI/CD, branch protection, labels and board, pull requests, docs. Sets up new projects or audits existing ones. | Promotion, once the rewrite is reviewed ([#7](https://github.com/marquesgabriel/grimoire/issues/7)). |

### Docs

| Doc | What it covers | What's missing |
|---|---|---|
| `review-conventions` | General review checks, and how to write a project's `docs/REVIEW-CONVENTIONS.md` so reviewers (and `/code-review`) know its non-obvious rules. | Use in a second project ([#5](https://github.com/marquesgabriel/grimoire/issues/5), [#10](https://github.com/marquesgabriel/grimoire/issues/10)). |

## Graveyard

Retired or abandoned. Not published.

### Skills

| Skill | What it did | Epitaph |
|---|---|---|
| `reviewing-code` | Reviewed pull requests against mtg's conventions. | Replaced by `/code-review` plus project conventions ([epitaph](graveyard/skills/reviewing-code/EPITAPH.md)). |
| `writing-image-prompts` | Wrote prompts and parameters for a local SDXL generator. | Tied to an inactive project and to SDXL-era prompting ([epitaph](graveyard/skills/writing-image-prompts/EPITAPH.md)). |
| `playtesting-games` | Played Earth Driller through Playwright and simulated its balance. | Tied to an inactive game; a good base for a generic playtest skill ([epitaph](graveyard/skills/playtesting-games/EPITAPH.md)). |

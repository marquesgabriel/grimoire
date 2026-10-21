# Contributing

Grimoire is maintained by Gabriel Marques. Issues and suggestions are
welcome; every change goes through a pull request and a human review.

## Workflow

1. Pick or open an issue on the
   [Grimoire Roadmap](https://github.com/users/marquesgabriel/projects/5)
   board. New issues start in **Triage**.
2. Branch from an up-to-date `main`: `feat/…`, `fix/…`, `docs/…` or
   `tech-debt/…`. Never commit to `main` directly.
3. Run the checks locally (see below), push and open a pull request against
   `main` with `Closes #N`.
4. CI must pass. The pull request is merged only after review.

When pull requests depend on each other, branch the later one from the
earlier one but **keep `main` as the base** of both, and say so in the
description. GitHub then shows only its own changes once the first one is
merged, and merging out of order can't strand commits on a side branch.

## Conventions

- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/)
  written in Portuguese (`feat: adiciona skill X`).
- **Issues, pull requests and content:** English.
- **Skills talk in the user's language.** The text of a skill is English,
  but each one tells Claude to reply in the language the user writes in.

## Adding a skill

Each skill is a folder with a `SKILL.md` and, optionally, supporting files
(`scripts/`, `references/`, templates):

```
incubator/skills/<name>/SKILL.md
```

- **Name:** lowercase, hyphen-separated, in the gerund form that describes
  the action (`gathering-requirements`, `writing-user-stories`), at most 64
  characters, with no version number. The folder name and the `name` in the
  frontmatter must match.
- **Description:** says what the skill does and when to use it, including
  the phrases a user would actually type. At most 1024 characters.
- **Index:** add a line to [INDEX.md](INDEX.md), in the section of its
  maturity.
- New skills start in `incubator/` unless they already meet the library
  criteria.

## Maturity

| Folder | Meaning | Published |
|---|---|---|
| `library/` | Ready to use in any project | Yes, as the `grimoire` plugin |
| `incubator/` | Works, but still being shaped | No |
| `graveyard/` | Retired or abandoned, kept in case it comes back | No |

**Promote to `library/`** (move the folder) when the skill:

- has been used for real in at least one project;
- has nothing hardcoded from a specific project (paths, names, commands);
  project specifics are read from the project instead;
- passes the CI checks and is listed in the index.

**Retire to `graveyard/`** when a skill is replaced or its project is
abandoned. Add an `EPITAPH.md` next to its `SKILL.md`: why it was retired,
what replaced it (if anything), and what it would take to bring it back.
Leave the rest as it was. Versions that were simply superseded don't need
the graveyard: Git history already keeps them.

**Bring back** a retired item by moving it to `incubator/`; it reaches the
library again only through the promotion criteria.

## Checks

```bash
node scripts/validate.mjs        # frontmatter, names, index, versions
claude plugin validate .         # marketplace and plugin manifest
```

CI runs both on every pull request.

## Releases

The plugin version follows [SemVer](https://semver.org/). To release, open a
pull request that adds a `## [vX.Y.Z] — YYYY-MM-DD` entry at the top of
[CHANGELOG.md](CHANGELOG.md) and sets the same version in
`library/.claude-plugin/plugin.json`. When it's merged, CI tags the commit
and publishes a GitHub release with that entry as notes. Users with the
plugin installed receive the new version on their next update.

# Review conventions

How to give code reviews (by people, by Claude Code's `/code-review`, or by
any agent) the project knowledge that can't be read from the code itself.

Generic review is solved: `/code-review` and a careful reviewer find
correctness bugs, simplifications and security problems. What they miss are
the **conventions** a project has settled on: decisions that look arbitrary
from outside, and mistakes that already happened once. Those live in the
project, in a `docs/REVIEW-CONVENTIONS.md` that reviewers read before
reviewing.

> **Incubator:** written from one project (mtg / token-generator). It
> reaches the library once a second project uses it for real.

## General checks

These apply to any project with the usual setup (pull requests, CI,
Conventional Commits). A project's conventions file doesn't need to repeat
them.

1. **Base branch.** The pull request targets the branch the project
   actually integrates into. In a release-branch flow that isn't the default
   branch; check recent merged pull requests when unsure.
2. **Dependent pull requests.** A pull request built on another one says so
   in its description and is reviewed after it.
3. **Commit messages** follow the project's convention. It matters most
   when tooling (version bumps, changelogs) depends on it.
4. **CI gate.** The pull request doesn't disable, skip or weaken a check
   (lint, tests, type-check, build, format) without saying why. A renamed CI
   job also needs the branch protection's required check updated.
5. **Issue linkage.** A pull request that closes an issue says `Closes #N`
   in its body, so the issue and the board update on merge.
6. **Docs currency.** A change to architecture, data flow or a major
   feature updates the docs that describe it.
7. **Secrets and config.** Nothing that should be a secret is hardcoded or
   stored as a plain variable, and nothing public is stored as a secret.
8. **Leftovers.** No debug output, focused tests (`.only`), temporary
   values or local test data.

## Writing a project's conventions file

Create `docs/REVIEW-CONVENTIONS.md` in the project and point to it from
`CONTRIBUTING.md`. Start it **empty**. Add a convention only when one of
these happens:

- the team makes a decision that a reviewer would otherwise question or
  "fix" (for example, keeping an old environment variable prefix on
  purpose);
- a real bug ships, or nearly ships, and a reviewer could have caught it.

Never add speculative conventions just to fill the file. Each one is short,
concrete and says why:

```markdown
# Review conventions

Read before reviewing a pull request in this repository. General checks:
<link to this doc>.

1. **[Short rule name].** [What to check.] [Why, in one sentence; if it
   came from a real bug, say what happened.]
```

Remove a convention when it stops being true; an outdated rule is worse
than none.

## Worked example

The numbered list under "Project-specific checks" in the retired
[`reviewing-code`](../../../graveyard/skills/reviewing-code/SKILL.md) skill
is mtg's set of conventions: a package manager that must not change, an
environment variable prefix kept on purpose, a regex that once shipped
without the `g` flag, a shared parser that must be reused, and fixed print
constants. Moving it to `token-generator/docs/REVIEW-CONVENTIONS.md` is part
of [grimoire#10](https://github.com/marquesgabriel/grimoire/issues/10).

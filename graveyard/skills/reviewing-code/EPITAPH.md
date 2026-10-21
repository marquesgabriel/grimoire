# Epitaph: reviewing-code

**Was:** `code-reviewer`, in `token-generator` (mtg) and, as an empty
skeleton, in `game-space-survivor`. Retired on 2026-10-21.

**Why it was retired:** Claude Code now ships its own `/code-review`, which
looks for correctness bugs at the depth you choose. What this skill added on
top was never the generic checks, but one project's conventions: things that
aren't obvious from the code and that had already caused a real bug once.
Those belong to the project, not to a skill. The copy in
`game-space-survivor` was never filled in, which confirms it.

**What replaced it:** the built-in `/code-review`, plus a
`docs/REVIEW-CONVENTIONS.md` in each project, written from the
[review conventions](../../../incubator/docs/review-conventions/README.md)
doc. The SKILL.md here is the mtg version, kept as it was; its numbered list
is the worked example for that doc.

**To bring it back:** only if `/code-review` stops covering general bugs, or
if a review needs a fixed procedure that a conventions doc can't express
(for example, a release-promotion checklist that runs commands). In that
case, write it as a generic skill that reads the project's
`docs/REVIEW-CONVENTIONS.md`, never with conventions inside it.

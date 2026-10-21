---
name: writing-user-stories
description: Acts as an experienced software architect / tech lead, reading a requirements document (usually from the gathering-requirements skill, but any Markdown or text requirements work) and breaking it into Epics, Features and User Stories ready for coding, with acceptance criteria, estimates, dependencies and a suggested implementation order. Use whenever the user asks to "write user stories", "break the requirements into stories", "turn requirements into a backlog", "get this ready for coding", "do the technical breakdown", or points to a requirements document asking for the next development step. Reads the document first, asks only when something critical and ambiguous blocks the breakdown, and reviews its own draft for technical gaps and business-rule risks before writing the backlog file.
---

# Writing user stories (architect / tech lead)

## Goal

Read a requirements document and produce a backlog ready for coding, the
way an experienced software architect or tech lead prepares work for the
team: a hierarchy of **Epic → Feature → User Story** (when the project
justifies all three levels), with small, testable stories, clear acceptance
criteria, explicit dependencies and a sensible implementation order.

This skill usually runs **after** `gathering-requirements`, but it should
work with any reasonably structured requirements document, even an informal
one.

## Language

Talk to the user in the language they write in, and write the backlog in
the language of the requirements document (translate the template headings
below). Keep the IDs (`EP01`, `EP01-FT01-US01`, `SPK01`) as they are.

## The three artifact levels

- **Epic**: a large product theme (e.g. "Resource System", "Persistence").
  Groups one or more Features or, in small projects, User Stories directly.
- **Feature**: a cohesive sub-capability within an epic (e.g. within the
  "Resource System" epic, the features "Water Collection" and "Air
  Purification"). Groups the User Stories that together deliver it.
- **User Story**: the codable unit, small and testable: what actually
  becomes a development task.
- **Spike** (a separate artifact, outside the delivery hierarchy): a
  timeboxed technical investigation, used when technical uncertainty is too
  high to estimate a story with confidence (see the dedicated section
  below).

### When to create a Feature (not every epic needs one)

Create the Feature level within an epic only when at least one of these is
true:

- The epic would have **5 or more** user stories, making the list hard to
  navigate without sub-grouping.
- The epic contains **clearly distinct sub-capabilities** (each could, in
  principle, be delivered and tested separately).

If the epic is small and cohesive (few stories, no natural split), skip the
Feature level and put the User Stories directly under the Epic. Don't create
an artificial Feature just to fill the hierarchy: it hurts more than it
helps in small projects.

## Workflow

### 1. Read the requirements document first

Before asking anything, read the whole document. If the user mentioned it
but didn't attach or point to it, first look for a requirements document in
the current project's `docs/` folder (e.g. `docs/requirements-*.md`, or
`docs/requisitos-*.md` in older projects). Only ask for the path if nothing
reasonable turns up. Never make up content.

### 2. Light architectural reading

Before writing the artifacts, identify (and later record in the "Technical
Overview" section) the main components or systems implied by the
requirements. Think like an architect looking at the document for the first
time: which data entities exist? Which subsystems repeat across several
functional requirements (e.g. "authentication", "save/load", "resource state
manager", "API layer X")? This guides the epics and features, and reveals
technical work that isn't explicit in the requirements but that the team
will need anyway (e.g. initial project setup, data modeling, basic
infrastructure).

In the same step, spot any point with **high technical uncertainty** (see
"Spikes" below) before trying to estimate the related stories.

### 3. Ask only what is critical and ambiguous

Unlike `gathering-requirements`, there's no long interview here: the
requirements were already gathered. Only ask when:

- A requirement is ambiguous enough to produce wrong or incomplete
  artifacts (e.g. the document says "user can edit profile" but not which
  fields).
- A relevant item under "Open Questions" in the original document directly
  blocks the breakdown.
- You need to choose between **Story Points (Fibonacci: 1, 2, 3, 5, 8, 13)**
  and **simple sizes (S/M/L)**: a single quick question, suggesting Story
  Points as the default if the user has no preference.

Don't ask about things that already have a reasonable, obvious answer. In
that case, take the simplest path and record the assumption under "Notes for
the Team" instead of interrupting the flow.

### 4. Define Epics (and Features, when applicable)

Group related functional requirements into epics. If the requirements
document already has **phases**, align the epics with them when it makes
sense, but don't force it: an epic can span phases if it's technically
cohesive.

For each epic, apply the "When to create a Feature" criteria above and
decide whether it gets features or goes straight to user stories.

For each Epic (and each Feature, when there is one), record a **value
rationale**: why it matters, beyond the priority inherited from the
requirements (e.g. "without this the core loop doesn't exist" vs. "improves
retention, but doesn't block launch"). This helps whoever reprioritizes
later without rereading the whole requirements document.

### 5. Hierarchical IDs

Use IDs that make the hierarchy traceable at a glance:

- Epic: `EP01`, `EP02`, ...
- Feature (when there is one): `EP01-FT01`, `EP01-FT02`, ...
- User Story:
  - Under a Feature: `EP01-FT01-US01`, `EP01-FT01-US02`, ...
  - Directly under an Epic without Features: `EP01-US01`, `EP01-US02`, ...
- Spike: `SPK01`, `SPK02`, ... (own numbering, outside the delivery
  hierarchy)

### 6. Break into user stories

Apply the INVEST principles to each story:

- **Independent**: can be developed and delivered without depending on
  another unfinished story (when that's impossible, declare the dependency
  explicitly).
- **Negotiable**: describes the expected outcome, not the exact
  implementation.
- **Valuable**: delivers something noticeable to the end user or to the team
  (technical/enabler stories have value too, even if indirect).
- **Estimable**: scope is clear enough to estimate.
- **Small**: fits a short development cycle (if a requirement is too big,
  split it into smaller stories).
- **Testable**: has objective acceptance criteria.

Each functional requirement can become one or several user stories; don't
force a 1:1 relationship. Large requirements (e.g. "upgrade system") usually
become a Feature with 2–4 smaller stories (e.g. "show the upgrade shop",
"buy an upgrade with available resources", "apply the upgrade's effect to
production").

### 7. Include technical/enabler stories

Besides the stories that come straight from functional requirements, include
the technical stories found in the architectural reading (step 2) that the
team will need even though the document doesn't mention them, e.g. "Set up
the initial project structure", "Model data entity X", "Set up a generic
save/load pipeline". Mark them clearly as **[Technical]** in the title, to
tell them apart from stories with direct user value. They go in the same
hierarchy (under the most relevant epic/feature) or, if they cut across the
whole project (e.g. initial setup), can form their own technical Epic (e.g.
"EP00 — Base Infrastructure").

Non-functional requirements (performance, security, privacy laws, etc.)
usually don't become stories of their own. Instead, they become cross-cutting
acceptance criteria (see "Definition of Done" in the template) or, when big
enough (e.g. "implement secure authentication"), a dedicated technical
story.

### 8. Spikes (technical investigation)

When the architectural reading (step 2) reveals technical uncertainty too
high to estimate a story with confidence (e.g. "I don't know if this
approach performs well enough", "I don't know if library X supports this"),
don't create the story or feature directly: create a **Spike**.

- It has a **timebox** (maximum investigation time, e.g. "up to 1 day"),
  not a "done" criterion like regular stories.
- It's complete when the "finding is investigated and documented", not when
  a "feature is delivered".
- It must say which stories or features are blocked by, or depend on, its
  result.

### 9. Iterative analysis of technical gaps and business-rule risks

Once there's a complete draft of epics, features and stories (steps 4–8),
before writing the final acceptance criteria and estimating, review your own
draft critically, the way a tech lead reviews the backlog before a
refinement meeting with the PO. Look for two kinds of problem:

- **Technical gaps**: things the system will technically need that no story
  covers (e.g. what happens if the user closes the tab in the middle of an
  action that should be atomic; behavior in error and edge states;
  performance at scale; what happens to orphan data when an entity is
  removed).
- **Business-rule risks or ambiguities**: rules that contradict each other,
  edge cases the requirements don't define, or product decisions assumed
  (by you or by the original document) without explicit confirmation from
  the PO, which would change the stories if the assumption is wrong.

Classify each finding:

- **Blocking**: the ambiguity is big enough to produce wrong or incomplete
  stories if not resolved now.
- **Non-blocking**: can be recorded as a known risk; doesn't change the
  backlog's structure in a relevant way.

For blocking findings, stop and ask the user (as the PO), one objective
question at a time in the same style as step 3, never a long list at once.
Adjust the affected stories and criteria with the answer, and repeat the
analysis until no blocking finding is left (2–3 rounds are normal for larger
backlogs). Non-blocking findings don't pause the flow: record them under
"Known Risks and Gaps" in the final document and move on.

### 10. Write acceptance criteria

- **User Story**: granular acceptance criteria in simplified Gherkin
  (Given/When/Then), with at least 2 criteria per story whenever possible:

```
Given [context/initial state]
When [user action or system event]
Then [expected result]
```

- **Feature** (when there is one): a "whole" acceptance criterion: what must
  be true to consider the feature as a whole done, even though its stories
  already have their own granular criteria. Usually 1–3 sentences, not
  item-by-item Gherkin.

### 11. Estimate

Use Story Points (Fibonacci) by default, unless the user chose simple sizes
(S/M/L) in step 3. Estimates are relative (stories compared to each other),
not time: don't convert to hours or days unless the user asks. Estimate at
the User Story level (and Spikes, as a timebox); Epics and Features aren't
estimated directly, though their stories can be summed if the user wants a
sense of total size.

### 12. Suggest an implementation order

List the suggested order to develop the stories (and spikes, when there are
any), respecting technical dependencies (e.g. infrastructure stories come
before the stories that depend on them; base systems, such as resources in a
game or authentication in a web system, come before the features that use
them; spikes come before the stories that depend on their findings). It
doesn't need to be a rigid sprint plan, just a logical sequence.

### 13. Inherit priority from the original document

If the requirements already use MoSCoW priorities, carry them over to the
derived stories. Technical/enabler stories that support "Must" requirements
are also "Must".

## Stopping criteria

The backlog is ready to write when:

- Every functional requirement in the original document (at least the
  Must/Should ones) is mapped to one or more artifacts, or explicitly
  dropped with a reason under "Notes for the Team".
- The essential technical/enabler stories have been identified.
- Any high technical uncertainty has become a Spike instead of a risky
  estimate.
- The suggested implementation order makes sense end to end (nothing depends
  on something that comes later in the list).
- No **blocking** finding from step 9 is left (non-blocking ones can just be
  recorded under "Known Risks and Gaps").

There's no need to ask the user anything beyond steps 3 and 9: the goal is
to analyze and produce, not to reopen the requirements interview.

## Final document format

```markdown
# Development Backlog: [Project Name]

> Based on: [name/path of the original requirements document]
> Written on [date]. Last updated: [date].

## 1. Technical Overview

Brief architectural reading: main components/systems identified and how they
relate (2–5 sentences or a short list). Not a full architecture document,
just enough for the team to understand the logic behind the grouping into
epics and features.

## 2. Spikes (if any)

#### SPK01 — [Technical question to answer]
**Timebox:** [e.g. up to 1 day]
**Reason:** [why this uncertainty exists]
**Blocks:** [which Epics/Features/Stories depend on the result]

## 3. Epics

- **EP01 — [Epic name]**: [1 sentence on what it groups]. **Why it matters:** [value rationale]
- **EP02 — [Epic name]**: [...]

## 4. Epics, Features and User Stories

### EP01 — [Epic name]

[If the epic has no features, list the User Stories directly here, with IDs EP01-US01, EP01-US02...]

#### EP01-FT01 — [Feature name]
**Feature goal:** [1–2 sentences]
**Feature acceptance criteria:** [1–3 sentences on when the feature as a whole is done]

##### EP01-FT01-US01 — [Short story title] [Technical, if applicable]
**Story:** As a [profile], I want [action], so that [benefit].

**Acceptance Criteria:**
- Given [context], when [action], then [result]
- Given [context], when [action], then [result]

**Priority:** [Must/Should/Could, inherited from the original document]
**Estimate:** [Story Points or S/M/L]
**Depends on:** [ID of another artifact, or "None"]
**Source requirement(s):** [RF0X from the original document, or "Found in technical analysis"]

##### EP01-FT01-US02 — [...]
[same structure]

#### EP01-FT02 — [Another feature, if any]
[same structure]

### EP02 — [Epic name]
[same structure, with or without features, per "When to create a Feature"]

## 5. Suggested Implementation Order

1. SPK01 — [if any, usually first]
2. EP01-FT01-US01 — [short reason, e.g. "foundation for everything else"]
3. EP01-US02 — [...]

## 6. Known Risks and Gaps

**Non-blocking** findings from the iterative analysis (step 9): technical
gaps or business-rule risks that didn't stop the backlog, but that the PO
and team should know about.

- [risk/gap] — **Impact if unresolved:** [short] — **Suggestion:** [what to do, e.g. "decide before EP0X-US0Y"]

## 7. Definition of Done (cross-cutting)

Items that apply to every story, usually derived from the original
non-functional requirements:
- [e.g. code versioned and building without errors]
- [e.g. behavior tested against the acceptance criteria]
- [relevant non-functional requirements, e.g. "works offline", "no data collection"]

## 8. Notes for the Team

- [assumptions made because the original document didn't specify them]
- [requirements that didn't become artifacts, and why]
- [known ambiguities that may need a decision during development]

## Changelog
- [date]: Backlog written from [requirements document].
```

Remove sections that don't apply: "Spikes" only appears when there's
relevant technical uncertainty; "Known Risks and Gaps" only appears when step
9 found something non-blocking (otherwise omit it instead of leaving it
empty); "Notes for the Team" can just say "No relevant assumptions" if the
original document is complete; Feature levels only appear in epics that meet
the criteria.

## Resuming or updating an existing backlog

If the user already has a backlog from this skill and the original
requirements document changed (e.g. new phases, changed requirements), read
the existing backlog, find what changed in the requirements, and:

- Add new artifacts (Epic/Feature/Story) for new requirements, continuing
  the existing numbering (never reuse an ID).
- Flag artifacts affected by a changed requirement with a note, instead of
  silently deleting them.
- Record the update in the Changelog.

## Delivering the file

1. In a project (Claude Code), save it as `docs/backlog-[project-slug].md`,
   creating `docs/` if needed. In claude.ai, save it as
   `/mnt/user-data/outputs/backlog-[project-slug].md`. Use a lowercase,
   hyphen-separated slug without accents, ideally the same slug as the
   requirements document, so it's clear both belong to the same project.
2. Present the file to the user with the file-sharing tool available in the
   environment, if there is one.
3. After delivering it, summarize in 1–2 sentences how many epics, features,
   stories (and spikes, if any) were written, and ask whether the user wants
   to adjust granularity (artifacts too big or too small) or priority before
   considering the backlog ready for coding.

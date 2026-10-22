---
name: coding-user-stories
description: Implements the user stories of a structured backlog (usually from the writing-user-stories skill) one by one, each on its own branch and pull request, respecting dependencies and acceptance criteria, with each story tracked as an issue on the project's GitHub board. Use when the user asks to "start coding the backlog", "implement the next story", "work through the stories", "what's next", or points to a backlog file asking to start development. Creates the issues on first run, then for each story picks the next one, implements it with tests, runs the project's checks, opens the pull request with Closes #N and moves on, keeping at most 3 of its pull requests open for review.
---

# Coding user stories

> **Incubator:** rewritten to implement stories through branches and pull
> requests ([grimoire#6](https://github.com/marquesgabriel/grimoire/issues/6)).
> It moves to the library after its first real use in a project.

Last step of the requirements → stories → code pipeline. You implement the
backlog's stories yourself, **one branch and one pull request per story**,
and the user reviews and merges. The board shows where each story is.

## Language

Talk to the user in the language they write in. Issues, pull requests,
commits and code follow the project's conventions.

## Before the first story

1. **Read the backlog** (the path the user gives, or `docs/backlog-*.md`;
   ask if there are several or none). Read it whole: stories, spikes,
   implementation order, known risks, Definition of Done.
2. **Read the project's conventions**: `CONTRIBUTING.md`,
   `docs/ARCHITECTURE.md`, `docs/REVIEW-CONVENTIONS.md`, the CI workflows
   and the package scripts. From them, take:
   - the **integration branch** (pull requests may not target the default
     branch; check where recent ones went with
     `gh pr list --state merged --limit 5 --json baseRefName`);
   - the **checks** to run before a pull request (lint, format, type-check,
     tests, build);
   - the **commit convention** and branch naming.
   What's missing, ask once, and suggest writing it into `CONTRIBUTING.md`.
3. **Find the board**: the GitHub Projects board linked to the repository
   (`gh project list --owner <owner>`), its Status field and options. Check
   whether a workflow already moves issues from `Closes #N` (such as
   `project-status.yml`); if not, you move them yourself.
4. **Create one issue per story and spike**, after showing the user the list
   (IDs, titles, labels) and getting a go-ahead once:
   - title: `<ID> — <title>` (e.g. `EP01-FT01-US02 — Save the draft`);
   - body: the story, the acceptance criteria as a checklist, priority,
     estimate, `Depends on #N` for each dependency, the source requirement
     and a link to the story in the backlog;
   - label: the project's type label (`enhancement` for user-facing
     stories, `tech-debt` for `[Technical]` ones, if those labels exist);
   - added to the board with Status `Todo` (the backlog was already
     reviewed).
   Skip stories that already have an issue (resuming). Then open one small
   pull request that writes each issue number into the backlog
   (`**Issue:** #N` under each story), so the document links to the board.
   The board holds the status from here on; the backlog stays the
   specification.

**No board in the project:** offer to create one (see `scaffolding-projects`
in Grimoire). If the user prefers not to, keep the status in an
"Implementation Progress" table at the end of the backlog, updated in each
story's pull request.

## The loop: one story at a time

### 1. Pick the next story

Follow the suggested implementation order, taking the first story that is:

- not done and without an open pull request;
- unblocked: every dependency is merged, **or** has an open pull request
  you can build on (see "Dependent stories").

Spikes come first when they block what's next. If nothing can start, say
why and stop.

Before starting, show the story in a few lines (ID, title, acceptance
criteria, dependencies) and go on, unless the user asked to confirm each
one.

### 2. Start it

- Move the issue to `In Progress` (unless a workflow does it when the pull
  request opens).
- Create the branch from the up-to-date integration branch, named per the
  project's convention, or `<type>/<id>-<short-title>` (e.g.
  `feat/ep01-ft01-us02-save-draft`).

### 3. Clear blocking doubts only

Ask only when an ambiguity blocks the implementation or a design choice has
real trade-offs the backlog doesn't settle. Record the answer as a comment
on the issue, so the decision stays with the story. Don't ask what the
acceptance criteria, the backlog notes or the code already answer.

### 4. Implement

- **Scope is the acceptance criteria.** Don't build the next story's part,
  and don't refactor unrelated code. Something worth doing outside the
  scope becomes a new issue in `Triage`, linked from the pull request.
- Follow the architecture and conventions of the project, not your own.
- **Tests for every acceptance criterion** that can be tested
  automatically, in the project's test setup.
- Honor the backlog's Definition of Done and the known risks that touch
  this story.

### 5. Check

- Run the project's checks until they all pass. Never weaken a check (skip
  a test, lower a threshold, disable a lint rule) to get green.
- Go through each acceptance criterion and note how it was verified: which
  test, or what you checked by hand. If something can only be verified by
  the user (visual result, a device, an external account), say exactly what
  to check.

### 6. Open the pull request

- Commit with the project's convention, then push.
- Pull request against the integration branch:
  - title: the story's ID and title;
  - body: what was done, the **acceptance-criteria checklist with how each
    one was verified**, anything the user must check by hand, decisions
    made, and `Closes #N`;
  - if it builds on another open pull request: `Depends on #M (branched from
    it); merge #M first`.
- Wait for CI. If it fails, fix it on the same branch.
- **Don't merge.** The user reviews and merges.

### 7. Go on, within the limit

Keep **at most 3 of your pull requests open** at once. Below the limit, go
back to step 1. At the limit, stop and report: which pull requests are
waiting for review, in which merge order, and what comes next.

## Dependent stories

When the next story depends on one whose pull request is still open:

- branch from that pull request's branch, but **keep the integration branch
  as the base** of the new pull request (never the other branch: a pull
  request based on another branch merges into it, and can silently miss the
  integration branch);
- state the merge order in the description;
- if the earlier pull request changes during review, rebase the later one.

## Review feedback

When the user asks you to address review comments, read them all on the pull
request, fix them on the same branch, answer each one briefly, and rerun the
checks. If the change affects pull requests built on this one, rebase them.

## Spikes

A spike answers a technical question within its timebox; it doesn't ship
features. Investigate (prototype if useful), then open a pull request with a
short write-up, such as `docs/spikes/SPK01-<topic>.md`: the question, what
was tried, the answer and its impact on the blocked stories. Throwaway
prototype code doesn't go in. If the answer changes stories, propose the
backlog update in the same pull request.

## Blocked stories

If a story can't go on (a missing decision, an external dependency, a
failing assumption), comment on the issue with what's blocking it and what
would unblock it, tell the user, and move to the next story that doesn't
depend on it.

## Resuming

Don't rely on memory between sessions. Rebuild the state from the board and
GitHub: the issues' statuses, your open pull requests and their checks, and
what was merged. Then summarize in a few lines (done, in review, next) and
continue the loop.

## Always

- One story per branch and per pull request; `Closes #N` in every one.
- Never commit to the integration branch, never merge, never force-push a
  branch someone else is working on.
- Never change the backlog's scope on your own: propose it, and let the
  user decide.

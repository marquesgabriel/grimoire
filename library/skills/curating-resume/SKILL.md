---
name: curating-resume
description: Keeps a résumé kept as code (LaTeX, Markdown or any source versioned with Git) up to date from the user's career achievements and facts. Use when the user shares an achievement, recent or old ("add this to my résumé", "I did X at work", "I remembered something from a previous job"), asks to update, review or release their résumé, or asks to tailor it to a job posting. Reads the project's specifics from docs/RESUME.md (fact log, content files, build and checks, privacy, workflow), offering to create that file when it's missing. Records the fact, confirms it with the user, proposes the bullet, updates the source, checks the build and opens the pull request.
---

# Curating the résumé

> The job-tailoring mode (mode 3) is still provisional
> ([grimoire#9](https://github.com/marquesgabriel/grimoire/issues/9)).

Keeps a résumé that lives in a repository up to date, following the flow:
**fact → confirm → record → bullet → source → build → pull request → (the
user merges) → release**.

The person you're talking to owns the résumé. Every fact that goes into it
comes from them and is confirmed by them: never write something they didn't
say or confirm.

## Before anything: the project file

Everything specific to a project is declared in **`docs/RESUME.md`**, a plain
file that people and any tool can read. Read it first, then the files it
points to (content guidelines, fact log, contributing notes).

If it doesn't exist:

1. Look around the repository (README, build files, folders, CI) and draft
   it from [`resume-project.template.md`](resume-project.template.md),
   filling in what you can infer.
2. Show the draft to the user and ask about what's missing or uncertain, 3
   to 4 questions at a time. Don't guess commands or privacy rules.
3. Commit it on a branch and open a pull request, like any other change.

When `docs/RESUME.md` leaves something out, ask the user instead of
assuming, and suggest adding the answer to the file.

## Language

Talk to the user in the language they write in. Use the languages declared
in `docs/RESUME.md` for the résumé, the fact log, commits and pull requests.

**Several language versions.** When `docs/RESUME.md` declares the résumé in
more than one language, all versions carry the same content: every change
(a bullet, a date, a cut) goes into each of them, in the same pull request.
Write each version following that language's conventions as declared in the
project (section titles, date format, which terms stay untranslated), not
as a word-for-word translation, and show every version when you confirm the
bullet. A change meant for one language only (such as a typo fix) is the
exception; follow what the project file says for it.

## Mode 1: record an achievement

1. **Understand the fact.** If something essential is missing (when, which
   company, what their role was, any number), ask at most 3 to 4 questions at
   a time. Don't ask what's already in the fact log.
2. **Confirm it.** Repeat the fact back as you understood it, with dates,
   scope and numbers, and ask the user to confirm. Only confirmed facts go
   into the résumé. What they aren't sure about is recorded as pending, not
   written as fact.
3. **Branch** from the up-to-date main branch, with the naming declared in
   the project file. Never commit to the main branch.
4. **Record it in the fact log**, in the right section and with the
   project's markers (confirmed / pending, plus the date of the note). Write
   the full fact, even if the résumé will only use part of it: the log is
   the source of truth; the résumé is a selection. If the project has no
   fact log, suggest one before going on.
5. **Propose the bullet** in the résumé's language (in each one, when
   there are several): action verb + what was done + result or scale.
   Follow the project's content guidelines, and always:
   - only confirmed facts; no numbers estimated by you;
   - numbers only with evidence: scale they know (apps, components, people,
     users) can go in; gains (percentages, time or money saved) only if
     measured. Without evidence, describe what was done and its scope,
     without pushing for a metric;
   - don't attribute to them what isn't theirs (the team's or the client's
     work);
   - acronym plus full term on the first mention of searchable terms
     ("Amazon Web Services (AWS)");
   - dates in the résumé's format, consistent everywhere; year only when the
     month is unknown (and record it as pending);
   - respect the privacy rules (names that must not appear, placeholders to
     use instead).
   Show the bullet to the user and adjust it if they ask. If they already
   said to go ahead without review, continue and leave the review for the
   pull request.
6. **Update the source.** Place the bullet under the right entry, in every
   language version, with the format rules declared in the project file
   (macros, escaping). If a block grows past the size the guidelines
   allow, suggest what to merge or cut.
7. **Check** with the commands and limits declared in the project file
   (build, text extraction, page limit, warnings), for every language
   version, including any check that the versions are in sync. If the
   local toolchain isn't available, use the CI route it declares. If the
   résumé goes over the page limit, suggest cuts in the oldest or least
   relevant items, never in the current position. When only one language
   overflows, tighten its wording first, so the versions keep the same
   content.
8. **Commit** with the project's commit convention. Never commit the files
   declared as private.
9. **Pull request** against the main branch, with a summary, a test plan
   and `Closes #N` when there's an issue. **Don't merge**: the user reviews.

## Mode 2: release a version

Once the changes for a version are merged, follow the release steps in the
project file (typically a changelog entry on a branch and a pull request,
with CI publishing the PDF on merge). Check the published release (asset,
notes, latest); don't create tags by hand unless the project says so.

## Mode 3: tailor to a job posting

Provisional. If the project file declares how variants work, follow it.
Otherwise:

1. Take the job description and list its key terms (stack, tools,
   responsibilities).
2. Compare with the résumé and the fact log: what already appears, what's in
   the log but not in the résumé, and what's really missing. Show the current
   fit: how many of the essential terms appear (target: ~75–85%).
3. Propose changes **only with confirmed facts**, using the posting's terms
   openly (acronym plus full term) inside bullets and skills. What the user
   doesn't have stays out, even if it lowers the fit. No ATS tricks (white
   text, prompt injection).
4. Make the changes on a `variant/<company-or-role>` branch and open the pull
   request as a draft, so it doesn't mix with the main version. With
   several language versions, tailor the one in the posting's language, and
   ask before touching the others.

## Always

- When unsure about a fact, record it as pending and ask; never make it up.
- Every change goes through a branch and a pull request.

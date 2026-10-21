---
name: curating-resume
description: Keeps Gabriel's résumé (the LaTeX-Resume repository) up to date from career achievements and facts. Use when Gabriel shares an achievement, recent or old ("add this to my résumé", "I did X at work", "I remembered something from a previous job"), asks to update or review the résumé, or asks to tailor it to a job posting. Records the fact in career-log.md, proposes the bullet, updates sections/*.tex, checks the PDF and opens the pull request.
---

# Curating the résumé

> **Incubator:** this skill only works inside
> [LaTeX-Resume](https://github.com/marquesgabriel/LaTeX-Resume): it relies
> on that repository's files, build and guidelines. Making it reusable is
> tracked in [grimoire#8](https://github.com/marquesgabriel/grimoire/issues/8),
> and the job-tailoring mode in
> [grimoire#9](https://github.com/marquesgabriel/grimoire/issues/9).

Automates the flow the repository already follows: **fact → record → bullet
→ `.tex` → build → PR → (Gabriel merges) → release**. Read first:
`CLAUDE.md`, `docs/CONTENT-GUIDELINES.md`, `CONTRIBUTING.md` and
`career-log.md`.

## Language

Talk to Gabriel in the language they write in (usually Portuguese). Notes in
`career-log.md`, commits and the CHANGELOG are in Portuguese; the résumé,
issues and pull requests are in English.

## Mode 1: record an achievement

1. **Understand the fact.** If something essential is missing (when, which
   company, what their role was, any number), ask at most 3 to 4 questions at
   a time. Don't ask what's already in `career-log.md`.
2. **Branch.** Create `feat/<short-description>` from an up-to-date `main`.
   Never commit to `main`.
3. **Record it in `career-log.md`**, in the right job's section:
   - `✅` for what Gabriel confirmed, `❓` for what's still missing, always
     with `*(anotado YYYY-MM-DD)*`.
   - Write the full fact, even if the résumé will only use part of it. The
     log is the source of truth; the résumé is a selection.
4. **Propose the bullet** in American English: action verb + what was done +
   result or scale. Follow `docs/CONTENT-GUIDELINES.md`:
   - never write the client's name: use `\clientref` ("one of the largest
     U.S. health insurers" in the public version; the name only appears in
     the internal version, through `\clientname` in the gitignored
     `professional.contact.tex`);
   - don't attribute to them what isn't theirs (e.g. the client's API
     architecture);
   - only ✅ facts; no numbers estimated by you;
   - numbers only with evidence ("ATS and impact" in the guidelines): scale
     they know (apps, components, people, users) can go in; gains
     (percentages, time or money saved) only if measured. Without evidence,
     describe what was done and its scope, without pushing for a metric;
   - acronym plus full term on the first mention of searchable terms
     ("Amazon Web Services (AWS)");
   - dates as `Mon YYYY -- Mon YYYY`; year only when the month is unknown
     (and record a ❓);
   - technical focus on dev / dev lead, web; mobile only as breadth.
   Show the bullet to Gabriel and adjust it if they ask. If they already said to
   go ahead without review, continue and leave the review for the PR.
5. **Update `sections/*.tex`.** Place the bullet under the right job; if the
   block goes over ~9 bullets, suggest what to merge or cut. Use only the
   `resume.cls` macros (`\role`, `\position`, `\entry`, `\subtitle`,
   `\skillline`). Escape `&`, `%`, `~`, `#`, `_` and use `--` for date
   ranges.
6. **Check.**
   - With local TeX: `make pdf` (2 pages, no `Overfull`) and `make ats`.
   - Without local TeX: push and run `gh workflow run build.yml --ref
     <branch>`. CI fails over 2 pages, on any `Overfull`, or if text
     extraction scrambles the sections. Download the `resume` artifact and
     check the PDF.
   - If it goes over 2 pages, suggest cuts in the oldest or least relevant
     items, never in the current position.
7. **Commit** in Portuguese, Conventional Commits (`feat: ...`), with no
   Claude attribution.
8. **Pull request** in English against `main`, with a summary, a test plan
   and `Closes #N` when there's an issue. **Don't merge**: Gabriel reviews.

## Mode 2: close a version

Once a phase's pull requests are in `main`:

1. On a branch, add the entry at the top of `CHANGELOG.md` (`## [vX.Y] —
   YYYY-MM-DD`, Keep a Changelog format, in Portuguese) and update the
   status in `ROADMAP.md`. Open the pull request.
2. When Gabriel merges it, CI creates the tag and publishes the release with
   `Gabriel-Marques-Resume.pdf` on its own. Check the release (asset, notes,
   "Latest"); don't create the tag by hand.

## Mode 3: tailor to a job posting

> ❓ **Depends on Phase 6** (per-job variant mechanism, LaTeX-Resume#8),
> not defined yet. Until then:

1. Take the job description and list its key terms (stack, tools,
   responsibilities).
2. Compare with `sections/*.tex` and `career-log.md`: what already appears,
   what's in the log but not in the résumé, and what's really missing. Show
   the current fit: how many of the essential terms appear (target: ~75–85%).
3. Propose changes **only with ✅ facts**, using the posting's terms openly
   (acronym plus full term) inside bullets and skills. What they don't have
   stays out, even if it lowers the fit. No ATS tricks (white text, prompt
   injection).
4. Make the changes on a `variant/<company-or-role>` branch and open the pull
   request as a draft, so it doesn't mix with the main version.

## Always

- When unsure about a fact, record a `❓` in `career-log.md` and ask; never
  make it up.
- Every change goes through a branch and a pull request.

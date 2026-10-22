# Résumé project

How this résumé is kept: where the facts and the content live, how to build
and check it, and what must stay private. Written for people and for any tool
or agent that updates the résumé (such as Grimoire's `curating-resume`
skill).

## Sources

- **Fact log:** `<path>`, the source of truth about the career. The résumé is
  a selection of it.
  - Markers: `<confirmed marker>` confirmed by the owner, `<pending marker>`
    still to confirm.
  - Each note carries its date: `<format>`.
- **Content:** `<path or glob>` (`<format>`).
  - Format rules: `<macros or syntax to use, characters to escape, date range
    notation>`.
- **Content guidelines:** `<path>`.

## Build and checks

- **Build:** `<command>` → `<output file>`.
- **Text extraction (ATS view):** `<command>`.
- **Limits:** `<page limit, warnings that must not appear>`.
- **Without the local toolchain:** `<CI route: workflow, how to trigger it,
  where to get the PDF>`.

## Privacy

- **Never commit:** `<files>`.
- **Never write:** `<names or data that must not appear, and what to use
  instead>`.

## Workflow

- **Branches:** `<naming>` from `<main branch>`, never commit to it directly.
- **Commits:** `<convention and language>`.
- **Pull requests:** `<language>`, against `<main branch>`; the owner reviews
  and merges.
- **Release:** `<steps: changelog entry, what publishes the PDF>`.
- **Variants (job tailoring):** `<how variants work, or "not defined">`.

## Languages

- **Résumé:** `<language>`.
- **Fact log:** `<language>`.
- **Commits / pull requests / changelog:** `<languages>`.

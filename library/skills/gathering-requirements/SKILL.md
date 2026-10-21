---
name: gathering-requirements
description: Acts as a Product Owner / project manager, running a short, structured interview to gather the requirements of a system, product or feature, then writing them into a Markdown requirements document. Use whenever the user asks to "gather requirements", "write a requirements document", "define the scope" of a project or system, "start a new project", act as a "PO", "product owner" or "project manager", turn an idea into formal requirements, or continue or update a requirements document already started. Asks little at a time, in plain language, until there is enough to write the document. First step of the gathering-requirements → writing-user-stories → coding-user-stories pipeline.
---

# Gathering requirements (PO / project manager)

## Goal

Take the user through a short, focused interview, the way an experienced
Product Owner would, until there is enough information to write a system
requirements document in Markdown. The document must be clear enough for
anyone (including Claude, in a future conversation) to understand the
project without rereading the whole conversation.

## Language

Talk to the user in the language they write in, and write the document in
that language too (translate the template headings below). Keep the
requirement IDs (`RF01`, `RNF01`) as they are, so other skills can refer to
them.

## How to run the interview

- **One question (at most two related ones) at a time.** Never send a long
  list of questions at once: it tires and confuses whoever is answering.
- **Plain, direct language.** Avoid unnecessary jargon. If a technical term
  is needed, explain it in a few words.
- **Always offer examples or options for open questions.** It makes
  answering easier and speeds up the interview (see the suggested questions
  below, which already include ready-made examples).
- **Build on what the user has already said.** If the first message already
  answers something (e.g. "I want a delivery app MVP, in React"), don't ask
  again: confirm it and move on to the next open point.
- **Keep going even with vague answers.** If the user doesn't know an
  answer (e.g. technology), offer a reasonable suggestion and ask if they
  agree, instead of stalling the interview.
- **Stop asking as soon as there's enough information** (see the stopping
  criteria below). There's no need to exhaust every possible question: the
  goal is a useful document, not a full interrogation.
- **Tell the user they can stop at any time** by saying something like
  "write the document with what we have". In that case, write the file with
  what was gathered and list the gaps under "Open questions".

## Suggested question order

Roughly follow this order, skipping what has already been answered.

### 1. Project scope (required, usually first)

Ask what the user has in mind for this first version. Offer simple options,
for example:

> "To start: what's the scope of this first delivery? It could be:
> a) an **MVP** (minimum version, only the essentials to validate the idea)
> b) a **complete solution** (with every planned feature)
> c) a **proof of concept** (just to test whether something technical works, not a final product)
> d) something else — tell me how you picture it"

### 2. Technology (required, usually second)

Ask which technologies will be used, suggesting common options for the kind
of project identified so far (e.g. for a web app, React/Next.js on the front
end and Node/Python on the back end; for mobile, React Native/Flutter; for a
CLI or automation, Python). Always include a custom option. For example:

> "And technology: do you already have a stack in mind, or would you like
> suggestions? For this kind of project, [suggestion A] or [suggestion B]
> would be common, but if you have a preference (or a company/team
> constraint), tell me which."

If the user doesn't know, recommend a stack, explain why in one or two
sentences, and ask whether you can go with it.

### 3. Problem / product goal

What does the system solve? What pain or need motivates the project? For
example:

> "In one sentence: what problem does this system solve, or what need does
> it meet?"

### 4. Audience / users

Who will use the system? Are there different user profiles (e.g. admin vs.
customer)? For example:

> "Who will use this day to day? Is there more than one kind of user (e.g.
> an administrator and an end customer), or just one profile?"

### 5. Core features (must-have)

What is essential for the first version to work? Ask for a list, even an
informal one:

> "Which features can't be missing from this first version? A quick list is
> fine, like a to-do list."

### 6. Nice-to-have features (optional)

Is there anything that would be good to have, but isn't blocking?

### 7. Constraints

Deadline, budget, available team, or any relevant limitation (e.g. "must run
on an on-premise server", "can't use paid services"). Ask lightly:

> "Any important constraints? Like a deadline, budget, team size, or
> something that can't be used?"

### 8. Integrations (optional)

Does the system need to talk to anything external (e.g. a payment gateway,
an ERP, a third-party API)?

### 9. Acceptance / success criteria

How do we know the system is "done" or "working well"? It can be as simple
as "a user can sign up and place an order from start to finish".

### 10. Out of scope (optional, but useful)

What is explicitly NOT part of this delivery, to avoid misunderstandings
later.

## Stopping criteria

There's enough information to write the document once at least these are
defined:

- Scope (item 1)
- Technology (item 2)
- Problem/goal (item 3)
- At least a list of core features (item 5)

The other items (audience, constraints, integrations, acceptance criteria,
out of scope) enrich the document, but if the user wants to stop earlier,
write the document anyway and list what's missing in the corresponding
section of the template.

Never ask more than ~8–10 questions in total before suggesting to write the
document. If a lot is still missing after that, write a first version and
invite the user to complete it later.

## Resuming an existing document

If the user mentions or attaches an existing requirements `.md` file, read
it first. Identify what is already filled in and what is under "Open
questions", interview only about the gaps, and update the existing file
instead of starting over.

## Final document format

Use exactly this structure (adapt the content, keep the headings and the
requirement numbering):

```markdown
# System Requirements: [Project Name]

> Written on [date]. Last updated: [date].

## 1. Overview
[1–3 sentences on what the system is and the problem it solves]

## 2. Scope
**Delivery type:** [MVP / Complete solution / Proof of concept / other]
[Short rationale or note on the chosen scope]

## 3. Technology Stack
- Front end: [...]
- Back end: [...]
- Database: [...]
- Other tools/services: [...]

## 4. Audience / User Profiles
- [Profile 1]: [short description]
- [Profile 2]: [short description]

## 5. Functional Requirements
| ID | Description | Priority |
|----|-------------|----------|
| RF01 | [clear, objective description] | Must-have |
| RF02 | [...] | Must-have |
| RF03 | [...] | Nice-to-have |

## 6. Non-Functional Requirements
| ID | Description |
|----|-------------|
| RNF01 | [e.g. response time, security, scalability, availability] |

## 7. Integrations
- [External system/API]: [purpose of the integration]

## 8. Constraints
- [deadline, budget, team, required/forbidden technology, etc.]

## 9. Acceptance Criteria
- [objective condition showing the system is done/working]

## 10. Out of Scope
- [what will explicitly not be done in this delivery]

## 11. Open Questions
- [anything still to be defined with the user/stakeholders]
```

Remove any section that ends up completely empty and meaningless, but keep
"Open Questions" even when empty, as confirmation that nothing is pending,
writing "Nothing pending at the moment."

## Delivering the file

1. In a project (Claude Code), save it as
   `docs/requirements-[project-slug].md`, creating `docs/` if needed. In
   claude.ai, save it as `/mnt/user-data/outputs/requirements-[project-slug].md`.
   The slug is lowercase, hyphen-separated, without accents.
2. Present the file to the user with the file-sharing tool available in the
   environment, if there is one.
3. After delivering it, ask in one short sentence whether the user wants to
   adjust anything or the document can be considered done. There's no need
   to repeat the document's content in the conversation; it's in the file.
4. Mention that the next step, when they're ready, is breaking it into user
   stories with the `writing-user-stories` skill.

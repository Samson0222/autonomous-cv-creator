# WS05 - AI tailoring assistant

## Objective

Create an evidence-bounded assistant that analyzes a job description and returns
reviewable proposals without directly updating content or recipes.

## Ownership

```text
app/backend/assistant/**
fixtures/assistant/**
tests/assistant/**
```

Do not edit the content repository, API routes, frontend, renderer, or quality
service.

## Functions

- Parse a pasted job description into role requirements and weighted themes.
- Calculate explainable relevance scores for existing projects and skills.
- Recommend project ordering.
- Suggest verified bullets from the existing bullet pool.
- Identify missing but genuinely supported keywords.
- Propose professional-summary and headline alternatives.
- Compare the draft resume with the job description.
- Return an approve/reject proposal set.
- Flag claims that lack ownership, technology, or evidence support.

## Guardrails

- The assistant receives only the supplied evidence bundle and job description.
- Output must conform to the proposal contract.
- Every selection or wording proposal cites source record/evidence IDs.
- A skill appearing only in the job description is not eligible for automatic
  addition.
- Unsupported content is marked `needs_verification`, never `verified`.
- The assistant has no repository write capability.
- Applying proposals requires explicit user-selected proposal IDs through a
  separate API operation.
- Prompt-injection-like instructions inside job descriptions are treated as
  untrusted job content, not system instructions.

## Independent-development method

Implement a provider interface and use a deterministic fake provider in tests.
The workstream consumes fixture evidence bundles and returns proposal fixtures;
it does not require the real API or content store.

## Evaluation set

Include fixtures covering:

- A role strongly matching an existing project
- A role asking for unsupported technologies
- Team and tutorial projects with ownership restrictions
- Conflicting requirements and page limits
- A malicious or instruction-like job description
- A resume with missing evidence

## Acceptance criteria

- Relevance results include reasons, not only scores.
- Unsupported technologies are absent from verified suggestions.
- Project and bullet suggestions refer to existing stable IDs.
- Headline/summary changes are proposals with before/after values.
- Rejected proposals cause no patch.
- Accepted proposals create a preview patch but do not persist it.
- Evaluation tests verify the evidence and approval invariants independently of
  the selected model provider.


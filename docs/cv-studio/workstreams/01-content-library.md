# WS01 - Content library and migration

## Objective

Create a reusable, validated, Git-friendly content library and resume recipe
compiler inputs without depending on the API, UI, renderer, or AI assistant.

## Ownership

```text
content/**
resumes/**
app/backend/domain/**
app/backend/repositories/**
tools/migrate_content/**
tests/content/**
```

Do not edit the renderer, frontend, API, assistant, quality service, existing CV
sources, or GitHub workflows.

## Deliverables

- Type-specific domain models for profile, project, skill, experience,
  education, award, bullet, evidence, and resume recipe.
- YAML repository with atomic writes, stable IDs, search, archive, and restore.
- Referential validation for selected records and bullet IDs.
- Deterministic resolution of a recipe into a complete content snapshot.
- Migration tool that reads copies of the existing general, Axiom, and
  FootfallCam YAML files and produces proposed catalog/recipe files.
- Migration report listing preserved content, duplicates, and unresolved facts.

## Independent-development method

Use the fixture contracts from `contracts.md`. Tests stop at a resolved snapshot;
they do not invoke RenderCV or HTTP endpoints.

## Acceptance criteria

- Adding one project makes it selectable by multiple recipes.
- Recipe-local wording does not mutate the shared record.
- Archived content remains readable by historical snapshots but cannot be newly
  selected without an explicit override.
- Missing record and bullet references return stable error codes.
- Repeated compilation of unchanged inputs produces identical serialized output.
- The migration tool never modifies the current CV sources.


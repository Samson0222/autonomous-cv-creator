# WS04 - Frontend UI

## Objective

Build a complete no-YAML editing experience against the frozen API contract and
mock responses.

## Ownership

```text
app/frontend/**
tests/frontend/**
```

Do not edit backend services, content files, render scripts, or shared contracts.

## Screens

- Dashboard with resumes, recent builds, and quality status
- Content library with search, filters, tags, archive, and restore
- Project editor with ownership, technologies, bullets, links, and evidence
- Skill and experience editors
- Resume builder with section/project ordering and bullet selection
- PDF preview and build details
- AI analysis with relevance explanations and approve/reject diffs
- Quality panel with findings linked to the affected field
- Build history and restore/download actions
- Settings for page limit, theme, output name, and default-promotion intent

## Independent-development method

Use a mock server generated from the OpenAPI/fixture contract. PDF preview uses a
checked-in non-sensitive fixture. The UI must be fully navigable without a live
backend.

## Acceptance criteria

- A user can create and edit content without seeing YAML.
- Draft form values survive server-style validation errors.
- Records and projects can be reordered accessibly.
- Shared wording and recipe-local overrides are visually distinguished.
- AI proposals show current/proposed values, reason, sources, evidence status,
  and explicit accept/reject controls.
- `needs_verification` proposals cannot be accepted.
- Build status, quality findings, YAML download, and PDF download are visible.
- Destructive or default-promotion actions require clear confirmation.


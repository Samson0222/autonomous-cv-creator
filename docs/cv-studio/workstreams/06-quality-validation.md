# WS06 - Quality and claims validation

## Objective

Produce deterministic, structured quality findings for a compiled resume and
rendered PDF without modifying either artifact.

## Ownership

```text
app/backend/quality/**
fixtures/quality/**
tests/quality/**
```

Do not edit content records, API routes, frontend, renderer, or AI logic.

## Checks

- Required profile and section fields
- Section and selected-project order
- Missing, archived, or unverified references
- Page count against recipe limit
- ATS-readable text extraction
- Private-use and replacement characters
- Embedded email, telephone, and web links
- HTTP status for public links with timeout/caching behavior
- Duplicate or near-duplicate bullets
- Unsupported claims and missing evidence metadata
- RenderCV version recorded in the build manifest
- Output-name and artifact-presence checks

Visual inspection remains a user step in the MVP; automated checks must not
claim that layout is visually correct when they only inspect text and metadata.

## Independent-development method

Use fixture manifests, YAML snapshots, PDFs, and extracted text. Network link
checks use a fake HTTP client in tests.

## Acceptance criteria

- Every finding follows the shared finding contract and identifies its target.
- Errors and warnings are deterministic for the same inputs.
- Network failures are distinguishable from confirmed broken links.
- A release decision can require zero blocking findings without hiding warnings.
- ATS tests detect icon/private-use glyph regressions.
- Claims without evidence are flagged but never rewritten automatically.
- The service returns a machine-readable report suitable for the UI and build
  manifest.


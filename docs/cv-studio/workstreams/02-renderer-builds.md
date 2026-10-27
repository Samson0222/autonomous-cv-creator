# WS02 - Resume compiler output, renderer, and builds

## Objective

Convert a complete RenderCV document into an immutable, reproducible build using
the pinned RenderCV version.

## Ownership

```text
app/backend/rendering/**
app/backend/builds/**
scripts/render-recipe.ps1
tests/rendering/**
tests/builds/**
```

Do not interpret content-library records or modify the API, frontend, assistant,
quality service, current `render-cv.ps1`, or GitHub workflows.

## Deliverables

- Renderer port accepting complete YAML plus build metadata.
- RenderCV 2.6 command adapter with version and schema checks.
- Unique build-directory allocator.
- Build manifest, source snapshot, PDF, log, and failure result.
- Explicit, separately callable default-CV promotion operation.
- Fake renderer for isolated tests and other workstreams.

## Independent-development method

Use fixed valid and invalid RenderCV YAML fixtures. Do not depend on WS01 to
produce them.

## Acceptance criteria

- Concurrent requests cannot write to the same build directory.
- Failed renders preserve useful diagnostics and do not create a passed build.
- A normal build never overwrites `cv/cv.yaml` or the tracked default PDF.
- The manifest records source hash, recipe ID, RenderCV version, timestamps, and
  artifact paths.
- Promotion requires an explicit flag and rejects failed or incomplete builds.
- Existing pinned RenderCV behavior is preserved.


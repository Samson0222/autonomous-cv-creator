# Architecture

## System overview

```text
React + TypeScript UI
        |
        | versioned HTTP/JSON contract
        v
FastAPI orchestration layer
        |
        +--> content repository ------> YAML content library
        |
        +--> recipe compiler ---------> complete RenderCV YAML
        |
        +--> render/build service ----> RenderCV 2.6 ----> PDF build
        |
        +--> quality service ---------> findings and release status
        |
        +--> AI proposal service -----> proposal set, never direct writes
```

## Source-of-truth model

The content library stores reusable facts. Resume recipes store selections and
tailored presentation. Generated RenderCV YAML and PDFs are build artifacts.

```text
content facts + resume recipe -> compiled snapshot -> RenderCV YAML -> PDF
```

This prevents a tailored resume from silently changing the shared description
used by another resume.

## Proposed repository layout

```text
app/
  backend/
    api/                 # WS03
    assistant/           # WS05
    domain/              # WS01
    quality/             # WS06
    rendering/           # WS02
  frontend/              # WS04
content/
  profile.yaml
  projects.yaml
  skills.yaml
  experience.yaml
  education.yaml
  awards.yaml
resumes/
  general.yaml
  axiom.yaml
  footfallcam.yaml
builds/                  # ignored generated output
tools/
  migrate_content/       # WS01
docs/
  cv-studio/
```

The current `cv/cv.yaml`, variants, and generation script stay in place until
the migration has passed equivalence checks.

## Component responsibilities

### Content repository

- Reads and writes validated YAML records.
- Assigns stable IDs.
- Supports search, tags, archive, and restore.
- Uses atomic file replacement to avoid partial writes.
- Never performs PDF generation.

### Recipe compiler

- Resolves referenced records and bullet IDs.
- Applies recipe-local overrides.
- Produces a complete, deterministic RenderCV document.
- Reports missing or archived references instead of guessing.

### Render and build service

- Accepts compiled RenderCV YAML, not domain records.
- Verifies the pinned RenderCV version and schema.
- Renders in a unique temporary/build directory.
- Saves YAML, PDF, manifest, and logs together.
- Does not overwrite the default CV.

### Quality service

- Evaluates the generated snapshot and PDF.
- Returns structured findings rather than modifying content.
- Distinguishes errors, warnings, and informational findings.

### AI proposal service

- Accepts a job description and an evidence-bounded resume snapshot.
- Returns proposals containing reasons and source/evidence references.
- Cannot call repository write methods.
- Marks unsupported suggestions as `needs_verification`.

## Build lifecycle

```text
Draft recipe
  -> compile
  -> schema validation
  -> render
  -> PDF/text/link checks
  -> visual review
  -> final build
  -> optional explicit promotion to default CV
```

Each build directory contains:

```text
builds/<timestamp>_<recipe-id>/
  recipe-snapshot.yaml
  rendercv.yaml
  cv.pdf
  manifest.json
  render.log
  quality.json
```

## Storage decision

YAML is preferred over a database for the MVP because the application is
single-user, the existing project is file-based, Git provides useful history,
and users retain editable data outside the application. A database migration
should be considered only when remote access, multiple users, concurrent edits,
or large-scale querying becomes a real requirement.

## Safety properties

- Archive records instead of hard-deleting referenced content.
- Require explicit confirmation before promoting a build to `cv/cv.yaml`.
- Keep accepted AI changes attributable to a proposal and user action.
- Escape output paths and restrict builds to the configured build root.
- Never expose secrets in content files or build manifests.
- Preserve the current manual workflow as a fallback through the MVP.


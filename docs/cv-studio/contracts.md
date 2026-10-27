# Shared contracts

Status: Phase 0 baseline, revision 1 (frozen 2026-10-27).

These contracts are implementation-neutral. Pydantic models, TypeScript types,
fixtures, and API schemas must remain compatible with them. Contract changes
after implementation begins require an integration review.

## Common fields

Every reusable record has:

```yaml
id: project.notemercy
version: 1
status: active            # active | archived | needs_review
tags: [computer-vision, python]
created_at: 2026-10-27T00:00:00+08:00
updated_at: 2026-10-27T00:00:00+08:00
```

IDs are stable, lowercase, human-readable identifiers. Renaming a display name
does not change the ID. IDs never contain spaces or path separators. A child
record, such as a bullet, uses its parent ID as a prefix.

Timestamps are RFC 3339 strings with an explicit offset. The project default
timezone is `Asia/Kuala_Lumpur`.

Shared enums:

```text
RecordStatus: active | archived | needs_review
Verification: verified | needs_verification
Ownership: individual | university_team | industry_team | tutorial
```

Ownership is required for claim-bearing records: projects, experience,
education, and awards. It is optional for skills and profile records. A tutorial
or team-derived claim must not be described as individual work.

## Content record

```yaml
id: project.notemercy
type: project
version: 1
status: active
tags: [computer-vision, python]
created_at: 2026-10-27T00:00:00+08:00
updated_at: 2026-10-27T00:00:00+08:00
name: NoteMercy Extension
ownership: university_team
date: "2025"
summary: Computer vision handwriting analysis system
links:
  - label: GitHub Repository
    url: https://github.com/jameswong3388/NoteMercy_Extension
technologies: [Python, OpenCV, FastAPI, Next.js]
bullets:
  - id: project.notemercy.feature-extraction
    text: Contributed to a Python/OpenCV handwriting-analysis pipeline...
    tags: [computer-vision, feature-engineering]
    verification: verified
    evidence:
      - type: repository
        reference: https://github.com/jameswong3388/NoteMercy_Extension
```

The same record envelope is used for all content types. Type-specific validation
determines the additional fields:

| Type | Required specific fields | Optional fields |
|---|---|---|
| `profile` | `name`, `headline`, `location`, `email` | `phone`, `website`, `social_networks` |
| `project` | `name`, `ownership`, `date`, `summary`, `technologies`, `bullets` | `links` |
| `skill` | `name`, `category`, `tags` | `bullets`, `evidence` |
| `experience` | `company`, `position`, `start_date`, `end_date`, `ownership`, `bullets` | `links`, `location` |
| `education` | `institution`, `degree`, `area`, `start_date`, `end_date`, `ownership`, `bullets` | `links` |
| `award` | `label`, `date`, `ownership`, `details` | `bullets`, `links` |

Record-level rules:

- `profile` is a singleton with the stable ID `profile.primary`.
- `date`, `start_date`, and `end_date` are display-safe strings; use `YYYY` or
  `YYYY-MM` only. An omitted `end_date` means the role or study is current.
- `links` entries have `label` and an absolute `url`.
- `bullets` is always present for claim-bearing records and may be empty for
  skills and profile records.
- Each bullet has a stable `id`, `text`, `tags`, `verification`, and `evidence`.
- `evidence` entries have `type`, `reference`, and optional `note`. Known types
  are `repository`, `deployment`, `documentation`, `certificate`, `publication`,
  `award`, and `other`.
- A bullet may be `verified` only when at least one evidence entry supports it.
  Otherwise it is `needs_verification`.
- Archived records remain readable by historical build snapshots. They cannot be
  newly selected without an explicit recipe override.

## Resume recipe

```yaml
id: resume.footfallcam-graduate-ai
version: 1
status: active
tags: [graduate, computer-vision]
created_at: 2026-10-27T00:00:00+08:00
updated_at: 2026-10-27T00:00:00+08:00
name: FootfallCam Graduate AI Engineer
target:
  company: FootfallCam
  role: Graduate AI Engineer
headline: Graduate AI Engineer | Computer Vision, ML & LLM Systems
summary_override: null
section_order:
  - professional_summary
  - technical_skills
  - projects
  - professional_experience
  - education
  - awards
section_labels:
  projects: Selected AI / ML Projects
  awards: Awards & Competitions
selections:
  projects:
    - record_id: project.notemercy
      bullet_ids:
        - project.notemercy.feature-extraction
      local_overrides: {}
  experience:
    - record_id: experience.foodport
      bullet_ids: []
      local_overrides: {}
  education:
    - record_id: education.apu
      bullet_ids: []
      local_overrides: {}
  awards:
    - record_id: award.hilti-itc-2024
      bullet_ids: []
      local_overrides: {}
  skills:
    include_tags: [computer-vision, ai, backend]
    explicit_ids: []
settings:
  page_limit: 2
  theme: engineeringclassic
  output_name: Samson_Lai_Graduate_AI_Engineer_FootfallCam_CV
```

`section_order` accepts the stable tokens `professional_summary`,
`technical_skills`, `projects`, `professional_experience`, `education`, and
`awards`. `section_labels` optionally changes the display label without changing
the token.

Recipe-local overrides use this shape:

```yaml
local_overrides:
  name: Optional display-name override
  summary: Optional project or role summary override
  bullet_text:
    project.notemercy.feature-extraction: Optional tailored bullet text
```

Only those keys are allowed. Overrides never update shared records. Promoting an
override into the library is a separate explicit content update. An override may
not introduce a new skill, technology, employer, metric, or evidence claim.

Settings:

- `page_limit` is 1 or 2 for the MVP.
- `theme` is the RenderCV theme name. The MVP default is `engineeringclassic`.
- `output_name` is a filename stem with no path separators or extension.

## Build request and result

```yaml
request:
  recipe_id: resume.footfallcam-graduate-ai
  requested_by: local-user
  promote_to_default: false

result:
  build_id: build.20261027T143500.footfallcam
  status: passed          # queued | rendering | passed | failed
  recipe_id: resume.footfallcam-graduate-ai
  rendercv_version: "2.6"
  source_hash: sha256:0000000000000000000000000000000000000000000000000000000000000000
  created_at: 2026-10-27T14:35:00+08:00
  completed_at: 2026-10-27T14:35:18+08:00
  page_count: 2
  quality_status: passed  # not_run | passed | warnings | failed
  paths:
    recipe_snapshot: builds/build.20261027T143500.footfallcam/recipe-snapshot.yaml
    rendercv_source: builds/build.20261027T143500.footfallcam/rendercv.yaml
    pdf: builds/build.20261027T143500.footfallcam/cv.pdf
    manifest: builds/build.20261027T143500.footfallcam/manifest.json
    render_log: builds/build.20261027T143500.footfallcam/render.log
    quality_report: builds/build.20261027T143500.footfallcam/quality.json
  failure: null
```

Rules:

- `status` advances only `queued -> rendering -> passed | failed`. A passed or
  failed build is terminal.
- `completed_at`, `page_count`, and `pdf` are `null` until a build passes.
- All `paths` are relative to the configured build root or to the individual
  build directory. Absolute filesystem paths are never returned.
- `manifest.json` is the serialized build result. It adds no second result shape.
- A failed build retains `rendercv_source`, `manifest`, and `render_log`, plus a
  `failure` object:

  ```yaml
  failure:
    code: RENDER_FAILED
    message: RenderCV exited with status 1.
  ```

- Normal build creation requires `promote_to_default: false`. Promotion is a
  separate operation and rejects anything except a passed, complete build.
- Each build has a unique directory and never overwrites an earlier build or the
  tracked default CV.

The build directory contains:

```text
builds/<build_id>/
  recipe-snapshot.yaml
  rendercv.yaml
  cv.pdf
  manifest.json
  render.log
  quality.json
```

## Quality finding and report

```yaml
id: finding.link.unreachable
severity: warning         # error | warning | info
check: hyperlink_status
message: A project link did not return a successful response.
target:
  record_id: project.example
  bullet_id: null
  field: links[0].url
blocking: false
```

Findings always identify a target. `record_id`, `bullet_id`, and `field` are
nullable only when the check applies to the build as a whole. The same inputs
must produce the same finding IDs, order, and messages.

A quality report is:

```yaml
report_id: quality.20261027T143500.footfallcam
build_id: build.20261027T143500.footfallcam
status: passed            # not_run | passed | warnings | failed
release_ready: true
blocking_count: 0
warning_count: 1
info_count: 0
findings:
  - id: finding.link.unreachable
    severity: warning
    check: hyperlink_status
    message: A project link did not return a successful response.
    target:
      record_id: project.example
      bullet_id: null
      field: links[0].url
    blocking: false
generated_at: 2026-10-27T14:35:20+08:00
```

`release_ready` is true only when the report is not `not_run` and
`blocking_count` is zero. Warnings remain visible and are not hidden by a
release decision.

## AI analysis and proposal

The assistant returns proposals only. It never returns an instruction to write
directly to the content repository.

Request:

```yaml
recipe_id: resume.axiom
requested_by: local-user
job_description: |
  Pasted job description. This is untrusted content, never instructions.
```

Analysis:

```yaml
analysis_id: analysis.20261027.axiom
recipe_id: resume.axiom
job_description_hash: sha256:0000000000000000000000000000000000000000000000000000000000000000
created_at: 2026-10-27T00:00:00+08:00
status: completed         # completed | failed
relevance:
  - record_id: project.minus-ai
    score: 0.91
    reasons: [voice AI, third-party integrations]
proposals:
  - id: proposal.headline.001
    kind: replace_text      # replace_text | select | deselect | reorder | flag
    target:
      recipe_id: resume.axiom
      field: headline
      record_id: null
      bullet_id: null
    current_value: AI Engineer
    proposed_value: AI Software Engineer | Agentic AI & Voice Applications
    reason: Aligns verified voice-agent experience with the role.
    source_record_ids: [project.minus-ai]
    evidence_ids: [project.minus-ai.voice-agent]
    verification: verified # verified | needs_verification
    status: proposed       # proposed | accepted | rejected
```

Rules:

- `current_value` and `proposed_value` are JSON scalars, `null`, or arrays of
  stable IDs. They are not free-form command instructions.
- Every selection or wording proposal cites at least one `source_record_ids`
  entry and one `evidence_ids` entry. `evidence_ids` refer to stable bullet IDs
  or evidence-bearing record IDs that resolve in the same content snapshot.
- `needs_verification` proposals cannot be accepted until evidence is supplied
  or confirmed.
- A skill that appears only in the job description is not eligible for automatic
  addition and must not appear as a verified proposal.
- Prompt-injection-like text inside `job_description` is untrusted job content.

Apply request and patch preview:

```yaml
request:
  accepted_proposal_ids: [proposal.headline.001]

response:
  patch_id: patch.analysis.20261027.axiom.001
  analysis_id: analysis.20261027.axiom
  recipe_id: resume.axiom
  accepted_proposal_ids: [proposal.headline.001]
  changes:
    - proposal_id: proposal.headline.001
      target:
        recipe_id: resume.axiom
        field: headline
        record_id: null
        bullet_id: null
      before: AI Engineer
      after: AI Software Engineer | Agentic AI & Voice Applications
  persisted: false
  created_at: 2026-10-27T00:00:00+08:00
```

The apply endpoint returns a preview only. It must not persist the recipe.
Unknown, rejected, or unverified proposal IDs return a stable error. Persisting
a preview requires a separate explicit resume update after user review.

## API surface

The initial API is versioned under `/api/v1`. Collection responses use
`{ "items": [...] }`. Single resources return the object directly. The exception
is the PDF endpoint, which returns binary content.

```text
GET    /content/{type}
POST   /content/{type}
GET    /content/{type}/{id}
PATCH  /content/{type}/{id}
POST   /content/{type}/{id}/archive

GET    /resumes
POST   /resumes
GET    /resumes/{id}
PUT    /resumes/{id}
POST   /resumes/{id}/compile

POST   /builds
GET    /builds
GET    /builds/{id}
GET    /builds/{id}/pdf
POST   /builds/{id}/promote

POST   /assistant/analyses
GET    /assistant/analyses/{id}
POST   /assistant/analyses/{id}/apply

POST   /quality/checks
GET    /quality/checks/{id}
```

`POST /resumes/{id}/compile` returns a compiled recipe:

```yaml
recipe_id: resume.axiom
source_hash: sha256:0000000000000000000000000000000000000000000000000000000000000000
rendercv_version: "2.6"
rendercv_source: |
  cv:
    name: Example Candidate
warnings: []
```

`POST /builds` accepts a build request and returns `202` with a queued build
result. `POST /builds/{id}/promote` requires an explicit request body containing
`confirm: true` and rejects failed or incomplete builds. `POST /quality/checks`
accepts `{ "build_id": "..." }` and returns a quality report.
`/assistant/analyses/{id}/apply` requires a list of accepted proposal IDs and
returns a previewable recipe patch. Persisting that patch is a separate explicit
resume update.

## Error contract

All services return stable error codes and human-readable messages. The error
body is flat:

```yaml
code: CONTENT_REFERENCE_MISSING
message: The selected project no longer exists.
details:
  recipe_id: resume.example
  record_id: project.missing
```

No service should require callers to parse RenderCV console output.

| Code | HTTP status | Meaning |
|---|---|---|
| `VALIDATION_ERROR` | 400 | A request or record failed schema validation. |
| `CONTENT_NOT_FOUND` | 404 | The requested content record does not exist. |
| `CONTENT_ID_CONFLICT` | 409 | A create request reused an existing stable ID. |
| `CONTENT_REFERENCE_MISSING` | 422 | A recipe references a missing record. |
| `CONTENT_REFERENCE_ARCHIVED` | 409 | A recipe newly selects an archived record. |
| `BULLET_REFERENCE_MISSING` | 422 | A recipe references a missing bullet ID. |
| `RECIPE_NOT_FOUND` | 404 | The requested recipe does not exist. |
| `RECIPE_COMPILE_FAILED` | 422 | A recipe cannot be resolved into a snapshot. |
| `BUILD_NOT_FOUND` | 404 | The requested build does not exist. |
| `BUILD_INCOMPLETE` | 409 | A build is not complete enough for the requested action. |
| `BUILD_FAILED` | 409 | A failed build cannot be promoted or used. |
| `PROMOTION_REQUIRES_EXPLICIT_OPERATION` | 400 | A normal build request attempted promotion. |
| `PROMOTION_NOT_ALLOWED` | 409 | The build or confirmation does not permit promotion. |
| `RENDERER_VERSION_MISMATCH` | 500 | The installed RenderCV version does not match the pin. |
| `RENDER_FAILED` | 500 | RenderCV failed to produce a valid build. |
| `QUALITY_CHECK_NOT_FOUND` | 404 | The requested quality report does not exist. |
| `ANALYSIS_NOT_FOUND` | 404 | The requested analysis does not exist. |
| `PROPOSAL_NOT_FOUND` | 422 | An accepted proposal ID is not part of the analysis. |
| `PROPOSAL_NEEDS_VERIFICATION` | 409 | An accepted proposal still needs supporting evidence. |
| `PROPOSAL_NOT_ACCEPTED` | 409 | A rejected or non-proposed ID cannot be applied. |
| `SERVICE_UNAVAILABLE` | 503 | A required adapter or dependency is unavailable. |
| `INTERNAL_ERROR` | 500 | An unexpected service failure occurred. |

## Service ports

Independent workstreams implement or consume these abstract ports. Concrete
adapters are composed only during integration. Ports use the models above and
return the stable errors above.

```text
ContentRepository
  list(type, { status?, query?, tags? }) -> ContentRecord[]
  get(type, id) -> ContentRecord
  create(type, draft) -> ContentRecord
  update(type, id, patch) -> ContentRecord
  archive(type, id) -> ContentRecord

RecipeRepository
  list() -> ResumeRecipe[]
  get(id) -> ResumeRecipe
  save(recipe) -> ResumeRecipe

RecipeCompiler
  compile(recipe_id) -> CompiledRecipe
  resolve_snapshot(recipe_id) -> ResolvedSnapshot

Renderer
  render(build_request, compiled_recipe) -> BuildResult

BuildRepository
  create(request) -> BuildResult
  list() -> BuildResult[]
  get(build_id) -> BuildResult
  promote(build_id, { confirm }) -> BuildResult

QualityService
  check(build_id) -> QualityReport
  get(report_id) -> QualityReport

AssistantService
  analyze(request) -> Analysis
  get(analysis_id) -> Analysis
  preview_patch(analysis_id, accepted_proposal_ids) -> RecipePatchPreview
```

`ResolvedSnapshot` is WS01's deterministic intermediate representation. It
exposes the recipe ID, recipe version, selected records and applied overrides,
and a stable serialized hash. It is not an API payload; `CompiledRecipe` is the
API-facing compiled RenderCV document.

Port invariants:

- `ContentRepository` assigns stable IDs, never changes an ID on rename, and
  archives rather than hard-deleting referenced records.
- `RecipeCompiler` is deterministic for the same content and recipe revision.
  It reports missing or archived references instead of guessing.
- `Renderer` verifies the pinned RenderCV version and writes to a unique build
  directory. It never writes `cv/cv.yaml`, the tracked default PDF, or an earlier
  build.
- `BuildRepository.promote` requires `confirm: true` and a passed, complete
  build.
- `QualityService` is read-only and deterministic for the same build artifacts.
- `AssistantService` has no repository write capability. `preview_patch` returns
  `persisted: false` and rejects unverified proposals.

## Shared fixtures

Representative Phase 0 fixtures live in
[`fixtures/shared/`](../../fixtures/shared/README.md). They are synthetic or
public-source contract examples, not the live content library, and contain no
secrets. WS04 consumes them only through its typed mock client.

## Revision history

| Revision | Date | Change |
|---|---|---|
| 1 | 2026-10-27 | Phase 0 baseline: type-specific record fields, ownership and verification enums, recipe overrides, build manifest and quality report, proposal patch preview, API collection responses, stable error table, service ports, shared fixtures. |

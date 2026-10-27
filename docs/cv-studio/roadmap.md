# Delivery roadmap

## Phase 0 - Contract freeze

This is the only prerequisite for parallel development.

1. Review and approve `contracts.md`.
2. Create shared JSON/YAML fixtures for content, recipes, builds, findings, and
   AI proposals.
3. Assign directory ownership from the workstream documents.
4. Record any contract revisions before implementation starts.

Exit condition: each workstream can run its tests without importing another
workstream's unfinished code.

## Phase 1 - Parallel implementation

Six workstreams run concurrently:

| Workstream | Depends on during development | Produces |
|---|---|---|
| WS01 Content library | Frozen contracts and existing CV copies | Repository adapter, compiler inputs, migration report |
| WS02 Renderer/builds | Frozen build fixtures | RenderCV adapter and immutable build service |
| WS03 Backend API | Frozen API and fake service ports | HTTP API and OpenAPI document |
| WS04 Frontend UI | Frozen OpenAPI/mock responses | Usable library, builder, preview, and review UI |
| WS05 AI assistant | Frozen proposal/evidence fixtures | Evidence-bounded proposal engine |
| WS06 Quality checks | Frozen build/finding fixtures | Deterministic quality report engine |

No workstream waits for another implementation. Fakes and fixtures provide all
external behavior.

## Phase 2 - Integration gates

The main integration owner performs these in order:

1. Connect the real content repository to the API ports.
2. Connect compiler output to the renderer.
3. Connect completed builds to the quality service.
4. Connect the frontend to the live API instead of the mock server.
5. Connect the assistant provider and proposal review flow.
6. Run one end-to-end build without changing the current default CV.

Each connection is a small adapter change. Workstream internals should not need
rewriting during integration.

## Phase 3 - Existing-CV migration

1. Import the general, Axiom, and FootfallCam sources into the shared catalog.
2. Produce three recipes that preserve current wording and ordering.
3. Render both legacy and recipe-generated PDFs.
4. Compare extracted text, page count, URLs, and visual layout.
5. Resolve differences and record intentional changes.
6. Keep legacy files available until all three equivalence reports pass.

## Phase 4 - Hardening and delivery

- Add schema, unit, integration, and end-to-end tests to CI.
- Update GitHub Actions only after the new render command is stable.
- Document local startup, backup, restore, and troubleshooting.
- Add a controlled `promote to default` operation.
- Package a one-command local development workflow.

## Phase 5 - Optional future work

- Cloud hosting and authenticated remote access
- PostgreSQL storage adapter
- Multi-user collaboration
- Additional themes and cover-letter generation
- Public-job import integrations
- Automated evaluation of AI proposal quality

## Release gates

### Alpha

- Content and recipes can be managed using fixtures.
- Renderer and quality services pass isolated tests.
- Frontend works completely against mock APIs.

### Beta

- Live API and UI are connected.
- All three existing resumes render through the new path.
- AI proposals are reviewable and cannot write directly.

### MVP release

- Migration equivalence reports pass.
- Two-page constraints and ATS extraction pass for existing tailored resumes.
- Link checks and build history work.
- Manual fallback and restore procedures are documented.


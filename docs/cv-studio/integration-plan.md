# Integration plan

Integration is intentionally owned by the main project owner rather than a
parallel workstream. This keeps cross-cutting decisions and conflict resolution
in one place.

## Merge order

1. Contracts and shared fixtures
2. Content repository and compiler ports
3. Render/build and quality services
4. Backend API composition
5. Frontend live-client switch
6. AI provider and proposal-application adapter
7. Existing-CV migration
8. CI and default-CV promotion workflow

## Required adapter checks

- API payloads match the frozen contracts.
- Repository writes are atomic and preserve stable IDs.
- Compiled YAML is deterministic for the same snapshot.
- Renderer uses the exact project pin and a unique output directory.
- Quality findings point back to record IDs and fields.
- Assistant proposals include evidence references and never invoke writes.
- Frontend displays server validation errors without losing draft input.

## End-to-end scenarios

1. Add a new verified skill through the UI and include it in a draft resume.
2. Add a team project with evidence, choose two bullets, and render a PDF.
3. Reorder projects and confirm only the recipe changes.
4. Paste a job description, reject one AI proposal, accept another, preview the
   patch, and explicitly save it.
5. Generate a two-page PDF, review quality findings, and download both PDF and
   YAML.
6. Restore a prior build and reproduce the same source hash.
7. Attempt to promote a failed build to the default CV and confirm it is blocked.

## Migration comparison

For each current CV, record:

- Extracted text comparison
- Page count
- Embedded URLs
- Section and project ordering
- RenderCV version
- Visual review result
- Intentional wording/layout differences

Promotion of the new general recipe is allowed only after the comparison report
is accepted.

## Conflict policy

- Workstream owners do not edit files outside their ownership boundary.
- Shared contract changes are proposed in documentation before code changes.
- Integration adapters are preferred over changing completed workstream logic.
- Existing unrelated repository changes are preserved.


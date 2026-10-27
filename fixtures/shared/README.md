# Shared Phase 0 fixtures

Revision: `phase0-2026-10-27` (contracts revision 1).

These fixtures freeze representative payloads for the independent workstreams.
They are JSON representations of the shared contracts, not the live content
library or generated build artifacts.

- `content.json` - profile, project, skill, experience, education, and award
  records with stable IDs, ownership, bullets, and evidence.
- `recipes.json` - two resume recipes with selections, section labels, settings,
  and recipe-local overrides.
- `builds.json` - passed, failed, and in-progress build results plus a normal
  build request.
- `quality.json` - quality reports and standalone finding examples, including a
  blocking finding.
- `assistant.json` - an analysis with verified and `needs_verification`
  proposals, an apply request, and a preview-only patch.
- `errors.json` - representative stable error responses with HTTP statuses.

Fixture content is synthetic or drawn from the public CV sources. It is not a
statement that the example profile or award belongs to the CV owner. Do not add
secrets, credentials, private contact details, or unverified claims. Generated
paths and hashes are deterministic placeholders.

Consumers:

- WS01 may load content and recipe fixtures into its isolated tests.
- WS02 may use build results and build requests with its fake renderer.
- WS03 may use every payload to test request/response validation.
- WS04 uses the fixtures through its typed mock client only.
- WS05 may use the analysis and proposal shapes, then add its own richer
  evaluation cases under `fixtures/assistant/`.
- WS06 may use quality reports and finding examples, then add its own fixtures
  under `fixtures/quality/`.

The authoritative field definitions and invariants are in
[`contracts.md`](../../docs/cv-studio/contracts.md). A fixture shape change that
affects more than one workstream is a contract revision and must be recorded in
the progress tracker before implementation.

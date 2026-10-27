# CV Studio project plan

CV Studio is a local-first user interface for maintaining a reusable CV content
library, assembling job-specific resumes, generating RenderCV source and PDFs,
and reviewing AI-assisted tailoring suggestions without writing YAML manually.

## Product outcome

A user can:

1. Add a project, skill, experience, education item, or award through a form.
2. Reuse that content across multiple resumes without copying it.
3. Select and reorder sections, projects, skills, and bullet points.
4. Describe work in plain language and receive optional resume-writing proposals.
5. Review every AI proposal as a diff before accepting it.
6. Generate an editable RenderCV YAML file and a versioned PDF.
7. Preview the PDF and review page-count, ATS, hyperlink, and claim checks.
8. Restore any prior build with its exact content snapshot.

## Decisions

- The first release is single-user and local-first.
- YAML files remain the canonical, Git-friendly content store.
- RenderCV remains the PDF engine and stays pinned to version 2.6 until a
  separately tested migration is approved.
- The UI edits structured content; users are not required to edit YAML.
- Resume recipes reference stable content IDs instead of duplicating whole CVs.
- Tailored wording is stored as a recipe override unless explicitly promoted to
  the shared library.
- AI output is always an untrusted proposal. It cannot silently write to the
  content library or resume recipe.
- Existing `cv/cv.yaml` is not overwritten unless the user explicitly promotes
  a validated build to the default CV.

## Documentation map

- [Architecture](architecture.md)
- [Shared contracts](contracts.md)
- [Delivery roadmap](roadmap.md)
- [Small-task execution sequence](task-sequence-diagram.md)
- [Integration plan](integration-plan.md)
- [OpenCode and shadcn development guide](opencode-shadcn-guide.md)
- Parallel execution plans:
  - [WS01 - Content library and migration](workstreams/01-content-library.md)
  - [WS02 - Resume compiler, renderer, and builds](workstreams/02-renderer-builds.md)
  - [WS03 - Backend API](workstreams/03-backend-api.md)
  - [WS04 - Frontend UI](workstreams/04-frontend-ui.md)
  - [WS05 - AI tailoring assistant](workstreams/05-ai-assistant.md)
  - [WS06 - Quality and claims validation](workstreams/06-quality-validation.md)

## Parallel-development rule

The contracts in `contracts.md` are frozen before implementation begins. Each
workstream then owns a separate directory and uses fixtures, fakes, or mock APIs.
Workstreams do not import another workstream's unfinished implementation and do
not edit another workstream's files. The main integration pass connects the
adapters only after each workstream satisfies its own acceptance tests.

## MVP completion criteria

- General, Axiom, and FootfallCam resumes can be represented as recipes using a
  shared content library.
- A new project or skill can be created through the UI and reused immediately.
- All three recipes generate valid RenderCV 2.6 YAML and PDFs.
- Builds are written to unique directories and never overwrite earlier builds.
- The UI shows validation results and retains the source snapshot for each PDF.
- AI-assisted tailoring supports relevance ranking, project ordering, verified
  bullet suggestions, supported keyword gaps, summary/headline alternatives,
  job-description comparison, and approve/reject diffs.
- No AI change is persisted without explicit user approval.
- Existing manual generation remains usable during migration.

## Explicit non-goals for the MVP

- Multi-user collaboration and permissions
- Cloud synchronization or production hosting
- Automatic job applications
- Silent rewriting of shared content
- Automatic addition of unsupported skills or technologies
- Replacing RenderCV with a custom PDF layout engine


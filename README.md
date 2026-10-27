This repo contains my CV, generated with **RenderCV**, and **CV Studio**, a
React application for managing CV content, recipes, builds, and AI-assisted
reviews.

## CV generation

- **Source of truth**: `cv/cv.yaml`
- **Automation**:
  - **PR opened/updated**: renders **old (base)** vs **new (PR head)** CV PDFs, uploads both as artifacts, and comments the PR with links
  - **PR merged**: re-renders the CV on the base branch and commits the updated PDF back to the repo (or opens a fallback PR if the base branch is protected)
- **Tracked output**: `cv/Samson_CV.pdf`

### Local generation

Run the project script from PowerShell:

```powershell
cd C:\Coding\autonomous-cv-creator\cv
.\scripts\render-cv.ps1
```

The script reads the exact version from `requirements-rendercv.txt`, renders the
CV, updates `cv/Samson_CV.pdf`, and saves a timestamped copy under `cv_version/`.
It also refuses to run if the `cv/cv.yaml` schema version differs from the
dependency pin. Both GitHub workflows perform the same version and schema check.
Do not invoke an unpinned `rendercv` or `uvx rendercv` command: RenderCV `2.8`
changes the Engineering Classic education entry to use a narrow degree column,
which breaks this CV's layout.

## CV Studio

CV Studio is a Vite, React, TypeScript, and shadcn/ui application at
`app/frontend`. The current WS04-A implementation provides the responsive
application shell, dashboard, settings, and a typed mock API backed by shared
fixtures. Content editing, resume ordering, PDF builds, and AI proposals are not
connected yet.

### Prerequisites

- Node.js `^20.19.0` or `>=22.12.0` (tested with Node.js 24)
- npm

### Start the app

From the repository root:

```powershell
cd app\frontend
npm install
npm run dev
```

Open <http://localhost:5173/>. Press `Ctrl+C` to stop the server.

`npm install` is only needed after a fresh clone or a dependency change; an
existing local `node_modules` can be reused.

### Checks and production build

From the repository root:

```powershell
cd app\frontend
npm test
npm run typecheck
npm run lint
npm run build
npm run preview
```

`npm run preview` serves the production build at <http://localhost:4173/> by
default. Use `npm run test:watch` for continuous test runs.

All application data is currently mock/fixture data. The Dashboard and Settings
screens are functional; Content Library, Resume Builder, Builds, and AI
Assistant are placeholders for later workstreams.

## GitHub repo settings (required for the merge workflow)

If the "PR merged" workflow can't push updates back to `main`, check:

- **Actions token permissions**: Settings → Actions → General → Workflow permissions → **Read and write permissions**
- **If `main` is protected**:
  - Either allow GitHub Actions to push/merge via your branch rules, or
  - Allow Actions to create PRs: Settings → Actions → General → **Allow GitHub Actions to create and approve pull requests**

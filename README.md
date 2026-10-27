This repo contains my CV, generated with **RenderCV**.

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

## GitHub repo settings (required for the merge workflow)

If the "PR merged" workflow can't push updates back to `main`, check:

- **Actions token permissions**: Settings → Actions → General → Workflow permissions → **Read and write permissions**
- **If `main` is protected**:
  - Either allow GitHub Actions to push/merge via your branch rules, or
  - Allow Actions to create PRs: Settings → Actions → General → **Allow GitHub Actions to create and approve pull requests**

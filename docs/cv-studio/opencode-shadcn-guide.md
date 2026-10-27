# OpenCode and shadcn Development Guide

This guide is for implementing CV Studio with OpenCode using the selected fast
model and shadcn/ui. It keeps each request small enough to review, follows the
project execution graph, and prevents one session from silently changing
multiple workstreams.

## Recommended operating model

Do not ask OpenCode to "build the whole project" in one request. Use one fresh
session for one small task ID from
[`task-sequence-diagram.md`](task-sequence-diagram.md). A task is complete only
after its focused checks pass and OpenCode reports the exact files changed.

Use this cycle:

1. Select the desired model in OpenCode.
2. Use the Plan agent to inspect the task and propose a file-level plan without
   editing.
3. Review the plan against the task's ownership boundary.
4. Switch to the Build agent and submit the implementation prompt.
5. Require focused tests, type checking, linting, and a production build where
   applicable.
6. Review the diff and completion report before starting the next task.
7. Start dependent tasks only after their prerequisite task has passed.

If tasks are executed concurrently, each task must have an isolated checkout or
worktree and an exclusive ownership boundary. Do not let two sessions edit the
same files. Creating branches, worktrees, commits, or remote changes still
requires explicit user authorization.

## OpenCode setup

Open the repository root:

```powershell
cd C:\Coding\autonomous-cv-creator\cv
opencode
```

Inside OpenCode:

1. Use `/connect` to configure the provider if it is not already connected.
2. Use `/models` to select the desired model.
3. If the exact model name is unclear, run `opencode models` outside the TUI and
   copy the displayed `provider/model-id`. Do not guess the model identifier.
4. Confirm that the root `AGENTS.md` is being applied.
5. Start in Plan mode for the Phase 0 audit or the selected task.

OpenCode reads project instructions from `AGENTS.md`. Its Plan agent is intended
for analysis without ordinary implementation writes, while its Build agent has
the tools needed for development. The model can be selected interactively or
configured using the exact provider/model identifier reported by OpenCode.

Official references:

- [OpenCode instructions](https://opencode.ai/docs/rules/)
- [OpenCode agents](https://opencode.ai/docs/agents/)
- [OpenCode models](https://opencode.ai/docs/models/)
- [OpenCode providers](https://opencode.ai/docs/providers/)

## Architecture decision for the frontend

The repository does not currently contain a frontend package or
`components.json`. WS04-A owns initialization.

Use this baseline unless the contracts are deliberately revised:

- Vite
- React
- TypeScript
- shadcn/ui
- Tailwind through the shadcn-generated setup
- A separate FastAPI backend reached through a typed HTTP client
- Mock API responses until Integration 05
- Official `@shadcn` registry components by default

Vite is suitable because this is a local application with a separate FastAPI
backend and does not require a second server-side web framework for the MVP.
Do not introduce Next.js only to host the UI.

During WS04-A, OpenCode should inspect current CLI help before initializing. A
likely initialization flow is to run the shadcn CLI from the `app` directory so
that it creates `app/frontend`, but the agent must verify the destination before
executing it:

```powershell
npx shadcn@latest init --help
npx shadcn@latest init --name frontend --template vite --preset base-nova
npx shadcn@latest info --json
```

After initialization, use the package runner reported by shadcn project info.
Do not mix npm, pnpm, yarn, or Bun lockfiles.

## Mandatory shadcn workflow

For every screen or component task, OpenCode must:

1. Run `npx shadcn@latest info --json` and use the reported framework, aliases,
   primitive base, icon library, Tailwind version, CSS file, and package manager.
2. Inspect installed components before adding anything.
3. Search the official registry before writing a custom primitive:

   ```powershell
   npx shadcn@latest search @shadcn -q "sidebar"
   ```

4. Read current documentation for every component it plans to use:

   ```powershell
   npx shadcn@latest docs sidebar card table field
   ```

5. Inspect uninstalled items with `view` and preview updates with `--dry-run`
   and `--diff`.
6. Add only the components required for the current task.
7. Read every generated file and correct imports, composition, accessibility,
   and icon-library mismatches.
8. Run focused tests, type checking, linting, and the frontend production build.

Never use `--overwrite` without explicit approval. Do not use a community
registry unless the user names or approves that registry.

## shadcn composition rules

- Use `FieldGroup` and `Field` for form layout.
- Put option sets of two to seven choices in `ToggleGroup`.
- Put related checkboxes or radio controls in `FieldSet` with `FieldLegend`.
- Use `data-invalid` on `Field` and `aria-invalid` on its control.
- Use complete Card composition: header, title, description, content, and footer
  where those regions exist.
- Put Select, DropdownMenu, Command, and Tabs items inside their required group
  or list components.
- Give Dialog, Sheet, and Drawer an accessible title.
- Use `Alert` for callouts, `Empty` for empty states, `Skeleton` for loading,
  `Spinner` for pending actions, `Badge` for statuses, `Separator` for dividers,
  and `sonner` for toast feedback.
- Use semantic tokens such as `bg-background`, `text-foreground`, and
  `text-muted-foreground`; do not hardcode application colors.
- Use flex or grid with `gap-*`, not `space-x-*` or `space-y-*`.
- Use `cn()` for conditional classes and do not add manual overlay z-indexes.
- Use the icon library reported by shadcn info. Icons in buttons use
  `data-icon` and no manual sizing class.
- Prefer built-in variants and sizes over restyling component internals.

## Screen-to-component map

This is a starting composition map, not permission to install everything at
once.

| Screen | Preferred shadcn composition |
|---|---|
| Application shell | Sidebar, SidebarProvider, Breadcrumb, Separator, Tooltip |
| Dashboard | Card, Badge, Progress, Table, Empty, Skeleton |
| Content library | InputGroup, Table, Badge, DropdownMenu, Sheet, AlertDialog, Pagination |
| Project editor | FieldGroup, Field, Input, Textarea, Select, Checkbox, FieldSet, Button |
| Skill and experience editors | FieldGroup, Field, Combobox or Select, ToggleGroup, Badge |
| Resume builder | Card, Accordion, Checkbox, Button, Alert, ScrollArea |
| Build preview | Resizable, Tabs, Card, Skeleton, Alert, Button |
| AI proposal review | Card, Badge, Tabs, Collapsible, Alert, Checkbox, Button |
| Quality findings | Table, Badge, Alert, Tooltip, Collapsible |
| Build history | Table, Badge, DropdownMenu, AlertDialog, Pagination |
| Feedback states | sonner, Spinner, Progress, Skeleton, Empty, Alert |

For accessible project and section ordering, first search the configured
registry for a suitable sortable pattern. If none is approved, provide explicit
Move up and Move down Buttons with accessible labels before adding a drag-and-
drop dependency.

## Master implementation prompt

Use this at the beginning of a new Build session, replacing the bracketed task
values:

```text
You are implementing one bounded task in the CV Studio project.

Task: [TASK ID AND NAME]
Owned paths: [COPY FROM THE RELEVANT WORKSTREAM PLAN]
Required output: [TASK-SPECIFIC DELIVERABLE]

First read, in order:
1. AGENTS.md
2. docs/cv-studio/README.md
3. docs/cv-studio/contracts.md
4. docs/cv-studio/task-sequence-diagram.md
5. the relevant docs/cv-studio/workstreams/*.md file
6. docs/cv-studio/integration-plan.md only if this is an integration task

Before editing:
- Inspect the current working tree and preserve all unrelated changes.
- Confirm this task's hard dependencies are complete.
- List the exact files you expect to create or modify.
- Stop and report a conflict if the task requires changing a frozen contract or
  another workstream's files.

Implementation rules:
- Implement only this task; do not begin the next task.
- Stay inside the owned paths.
- Use fixtures, fakes, or mock APIs for unfinished workstreams.
- Do not commit, push, merge, reset, deploy, or modify remote state.
- Do not change the current cv/cv.yaml, tracked CV PDF, RenderCV pin, or existing
  generation workflow unless this task explicitly owns that change.
- Do not invent CV claims, metrics, ownership, technologies, or evidence.
- Make the smallest coherent implementation that meets the documented contract.

If this task touches app/frontend:
- Run the shadcn project-info command first and follow the detected package
  manager, aliases, primitive base, icon library, and Tailwind version.
- Search the official @shadcn registry before custom UI.
- Read current shadcn docs for every component before using it.
- Reuse installed components; add only what this task needs.
- Follow the shadcn composition, form, semantic-color, spacing, icon, loading,
  empty-state, dialog-title, and accessibility rules in AGENTS.md and
  docs/cv-studio/opencode-shadcn-guide.md.
- Do not use --overwrite or an unspecified community registry.

Verification:
- Run the narrow unit or component tests for this task.
- Run type checking and linting for changed code.
- Run a production build for frontend changes.
- Re-read every generated shadcn file and fix invalid composition or imports.

Finish with:
1. outcome;
2. files changed;
3. commands and checks run with results;
4. acceptance criteria satisfied;
5. assumptions or unresolved blockers;
6. the next task that is now unblocked, without starting it.
```

## First prompt: Phase 0 audit

Run this in Plan mode before implementation:

```text
Audit the CV Studio Phase 0 contract baseline. Read AGENTS.md and every file in
docs/cv-studio, but do not modify application code or existing CV sources.

Check whether contracts.md fully defines the content records, recipes, builds,
quality findings, errors, assistant proposals, and service ports required for
WS01 through WS06 to work independently. Compare it with the workstream plans
and task-sequence diagram. Identify missing or contradictory fields, ambiguous
ownership, and fixtures that still need to be created.

Return:
- a pass/fail result for the Phase 0 start condition;
- a concise list of contract gaps, grouped by blocking and non-blocking;
- the exact documentation or fixture files that would need changes;
- a proposed minimal patch plan;
- no implementation changes.
```

If this audit finds blocking contract gaps, resolve and review those gaps before
starting any workstream.

## First frontend build prompt: WS04-A

Use this only after Phase 0 passes:

```text
Implement WS04-A: UI shell and mock API client.

Read AGENTS.md, docs/cv-studio/contracts.md,
docs/cv-studio/task-sequence-diagram.md,
docs/cv-studio/workstreams/04-frontend-ui.md, and
docs/cv-studio/opencode-shadcn-guide.md first.

Ownership is limited to app/frontend/** and tests/frontend/**. Do not edit
backend, content, resume, rendering, quality, assistant, current CV, workflow,
or shared-contract files.

The repository currently has no frontend package or components.json. Initialize
a Vite React TypeScript frontend at app/frontend using the official shadcn CLI
and a restrained professional preset. Before executing, inspect current shadcn
CLI help and confirm the destination will be app/frontend. Do not create a
second package outside that directory and do not mix package managers.

After initialization:
- run the shadcn info command and follow its reported aliases, primitive base,
  icon library, Tailwind version, CSS location, and package manager;
- search the official @shadcn registry and read current docs before adding the
  shell components;
- create an accessible application shell using shadcn Sidebar, Breadcrumb,
  Button, Tooltip, Separator, Skeleton, Empty, and sonner where appropriate;
- add routes or screen placeholders for Dashboard, Content Library, Resume
  Builder, Builds, AI Assistant, and Settings;
- create a typed mock API boundary from the frozen contracts without embedding
  backend behavior in React components;
- provide loading, empty, success, and error examples through shared UI states;
- keep the visual style professional, compact, responsive, and based entirely
  on semantic theme tokens;
- add focused tests for navigation and the mock-client boundary.

Do not implement WS04-B or later screen functionality. Do not connect a live
backend.

Run tests, type checking, linting, and the production build. Review every file
added by shadcn. Finish with the standard completion report and identify WS04-B,
WS04-C, WS04-D, and WS04-E as unblocked without starting them.
```

## Prompt for later small tasks

After WS04-A, use the master prompt and append a focused task clause. Example:

```text
Task clause for WS04-B:

Implement only the Content Library and editor forms against the existing mock
API. Use the screen-to-component map as a starting point, but search the
official registry and read current docs before choosing components. Cover
profile, project, skill, experience, education, and award records. Preserve
draft values after server-style validation errors. Use FieldGroup and Field,
show evidence and ownership clearly, and use AlertDialog for archive or restore
confirmation. Add component tests for create, edit, validation failure, archive,
and restore flows. Do not implement resume ordering, build preview, or AI
proposal review.
```

Use the same pattern for every task ID: name one deliverable, copy its owned
paths and dependencies, enumerate exclusions, state acceptance tests, and stop
after completion.

## Review prompt after each task

Run this in a separate Plan or read-only review session:

```text
Review the completed [TASK ID] implementation without editing files.

Read AGENTS.md, the task's workstream plan, contracts.md, and the relevant diff.
Check:
- ownership-boundary violations;
- accidental changes to existing CV files or workflows;
- contract mismatches;
- missing acceptance criteria or tests;
- unsafe filesystem or promotion behavior;
- for frontend work, shadcn composition, current component APIs, semantic
  tokens, accessibility, responsive behavior, loading and error states, and
  unnecessary custom markup;
- generated shadcn files that were not reviewed or have wrong aliases/icons;
- dependency or lockfile changes that are not justified.

Return findings ordered by severity with file paths and concrete fixes. If no
blocking findings remain, say that the next dependency task may start. Do not
make changes.
```

## When to stop and ask for a decision

OpenCode should stop rather than guess when:

- a frozen contract must change;
- two workstreams need to edit the same file;
- the shadcn CLI destination or package manager is ambiguous;
- a preset would overwrite existing styling or components;
- a community registry or a new major dependency appears necessary;
- a task would modify the existing default CV or promote a build;
- the requested model/provider identifier is not visible in `opencode models`;
- tests expose an architectural conflict instead of a local implementation bug.

This keeps the fast model useful for implementation while reserving contract,
architecture, and integration decisions for an explicit review.

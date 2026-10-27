import {
  FileQuestionIcon,
  FileStackIcon,
  HammerIcon,
  LayoutDashboardIcon,
  LibraryBigIcon,
  SettingsIcon,
  SparklesIcon,
  type LucideIcon,
} from "lucide-react"

export interface StudioRouteMeta {
  path: string
  label: string
  section: string
  description: string
  icon: LucideIcon
  task?: string
  features?: string[]
}

export interface NavigationGroup {
  label: string
  items: StudioRouteMeta[]
}

export const STUDIO_ROUTES = {
  dashboard: {
    path: "/",
    label: "Dashboard",
    section: "Overview",
    description:
      "A local view of your content, resume recipes, and recent builds.",
    icon: LayoutDashboardIcon,
  },
  content: {
    path: "/content",
    label: "Content Library",
    section: "Workspace",
    description:
      "Keep reusable facts, evidence, and ownership metadata in one searchable place.",
    icon: LibraryBigIcon,
    task: "WS04-B",
    features: [
      "Profile, project, skill, experience, education, and award editors",
      "Search, status filters, tags, archive, and restore",
      "Evidence and ownership fields on every claim",
      "Draft values preserved after validation errors",
    ],
  },
  resumes: {
    path: "/resumes",
    label: "Resume Builder",
    section: "Workspace",
    description:
      "Turn shared content into a tailored recipe without editing YAML.",
    icon: FileStackIcon,
    task: "WS04-C",
    features: [
      "Section order and accessible project reordering",
      "Bullet selection with shared facts and local overrides distinguished",
      "Page limit, theme, and output-name controls",
      "Compiled-source preview before a build",
    ],
  },
  builds: {
    path: "/builds",
    label: "Builds",
    section: "Delivery",
    description:
      "Review RenderCV outputs, quality findings, and guarded promotion.",
    icon: HammerIcon,
    task: "WS04-D",
    features: [
      "Build history with status, page count, and artifacts",
      "PDF preview plus YAML and PDF downloads",
      "Quality findings linked to the affected field",
      "Explicit confirmation before promoting a default CV",
    ],
  },
  assistant: {
    path: "/assistant",
    label: "AI Assistant",
    section: "Delivery",
    description:
      "Analyze a pasted job description and review evidence-linked proposals.",
    icon: SparklesIcon,
    task: "WS04-E",
    features: [
      "Untrusted job-description input with a clear boundary",
      "Relevance explanations tied to source records",
      "Current and proposed values with evidence status",
      "Accept and reject controls that only produce a patch preview",
    ],
  },
  settings: {
    path: "/settings",
    label: "Settings",
    section: "System",
    description:
      "Workspace defaults and shared interface state examples for the shell.",
    icon: SettingsIcon,
  },
} satisfies Record<string, StudioRouteMeta>

export const NAVIGATION_GROUPS: NavigationGroup[] = [
  {
    label: "Workspace",
    items: [
      STUDIO_ROUTES.dashboard,
      STUDIO_ROUTES.content,
      STUDIO_ROUTES.resumes,
    ],
  },
  {
    label: "Delivery",
    items: [STUDIO_ROUTES.builds, STUDIO_ROUTES.assistant],
  },
  {
    label: "System",
    items: [STUDIO_ROUTES.settings],
  },
]

export const NOT_FOUND_ROUTE: StudioRouteMeta = {
  path: "*",
  label: "Page not found",
  section: "System",
  description: "That route is not part of the CV Studio shell yet.",
  icon: FileQuestionIcon,
}

const ROUTE_LOOKUP: StudioRouteMeta[] = [
  ...NAVIGATION_GROUPS.flatMap((group) => group.items),
]

export function getRouteMeta(pathname: string): StudioRouteMeta {
  return (
    ROUTE_LOOKUP.find((route) => route.path === pathname) ?? NOT_FOUND_ROUTE
  )
}

import type { CvStudioApi, RequestOptions } from "@/api"
import { CONTENT_TYPES } from "@/api"
import type {
  BuildResult,
  ContentRecord,
  ContentType,
  ResumeRecipe,
} from "@/api"

export interface ContentSummary {
  items: ContentRecord[]
  total: number
  active: number
  needsReview: number
  archived: number
  byType: Record<ContentType, number>
}

export interface DashboardSnapshot {
  content: ContentSummary
  recipes: ResumeRecipe[]
  builds: BuildResult[]
}

function summarizeContent(items: ContentRecord[]): ContentSummary {
  const byType: Record<ContentType, number> = {
    profile: 0,
    project: 0,
    skill: 0,
    experience: 0,
    education: 0,
    award: 0,
  }

  for (const item of items) {
    byType[item.type] += 1
  }

  return {
    items,
    total: items.length,
    active: items.filter((item) => item.status === "active").length,
    needsReview: items.filter((item) => item.status === "needs_review").length,
    archived: items.filter((item) => item.status === "archived").length,
    byType,
  }
}

export async function loadDashboard(
  api: CvStudioApi,
  options: RequestOptions = {}
): Promise<DashboardSnapshot> {
  const [contentResponses, recipes, builds] = await Promise.all([
    Promise.all(
      CONTENT_TYPES.map((type) => api.listContent(type, undefined, options))
    ),
    api.listResumes(options),
    api.listBuilds(options),
  ])

  return {
    content: summarizeContent(
      contentResponses.flatMap((response) => response.items)
    ),
    recipes: recipes.items,
    builds: builds.items,
  }
}

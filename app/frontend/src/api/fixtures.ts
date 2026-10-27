import assistantJson from "@fixtures/assistant.json"
import buildsJson from "@fixtures/builds.json"
import contentJson from "@fixtures/content.json"
import errorsJson from "@fixtures/errors.json"
import qualityJson from "@fixtures/quality.json"
import recipesJson from "@fixtures/recipes.json"

import type { ApiErrorBody } from "./errors"
import type {
  Analysis,
  AnalysisRequest,
  ApplyRequest,
  BuildRequest,
  BuildResult,
  ContentRecord,
  PatchPreview,
  QualityFinding,
  QualityReport,
  ResumeRecipe,
} from "./types"

export interface ContentFixture {
  revision: string
  records: ContentRecord[]
}

export interface RecipesFixture {
  revision: string
  recipes: ResumeRecipe[]
}

export interface BuildsFixture {
  revision: string
  requests: BuildRequest[]
  promotion_request: {
    confirm: boolean
  }
  builds: BuildResult[]
}

export interface QualityFixture {
  revision: string
  reports: QualityReport[]
  finding_examples: QualityFinding[]
}

export interface AssistantFixture {
  revision: string
  request: AnalysisRequest
  analysis: Analysis
  apply_request: ApplyRequest
  blocked_apply_request: ApplyRequest
  patch_preview: PatchPreview
}

export interface ErrorFixtureEntry extends ApiErrorBody {
  http_status: number
}

export interface ErrorsFixture {
  revision: string
  errors: ErrorFixtureEntry[]
}

/**
 * The JSON files are generated from the frozen Phase 0 contract. TypeScript
 * widens JSON string literals, so the boundary asserts the contract shape once
 * here and every consumer receives the narrow domain types.
 */
export const contentFixture = contentJson as unknown as ContentFixture
export const recipesFixture = recipesJson as unknown as RecipesFixture
export const buildsFixture = buildsJson as unknown as BuildsFixture
export const qualityFixture = qualityJson as unknown as QualityFixture
export const assistantFixture = assistantJson as unknown as AssistantFixture
export const errorsFixture = errorsJson as unknown as ErrorsFixture

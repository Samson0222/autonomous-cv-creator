import { ApiError } from "./errors"
import {
  assistantFixture,
  buildsFixture,
  contentFixture,
  errorsFixture,
  qualityFixture,
  recipesFixture,
} from "./fixtures"
import type {
  Analysis,
  BuildResult,
  ContentFilters,
  ContentRecord,
  ContentType,
  ItemsResponse,
  QualityReport,
  ResumeRecipe,
} from "./types"

export type MockScenario = "default" | "empty" | "unavailable"

export interface MockApiOptions {
  latencyMs?: number
  scenario?: MockScenario
}

export interface RequestOptions {
  signal?: AbortSignal
}

export interface CvStudioApi {
  listContent(
    type: ContentType,
    filters?: ContentFilters,
    options?: RequestOptions
  ): Promise<ItemsResponse<ContentRecord>>
  getContent(
    type: ContentType,
    id: string,
    options?: RequestOptions
  ): Promise<ContentRecord>
  listResumes(options?: RequestOptions): Promise<ItemsResponse<ResumeRecipe>>
  getResume(id: string, options?: RequestOptions): Promise<ResumeRecipe>
  listBuilds(options?: RequestOptions): Promise<ItemsResponse<BuildResult>>
  getBuild(id: string, options?: RequestOptions): Promise<BuildResult>
  getQualityReport(id: string, options?: RequestOptions): Promise<QualityReport>
  getAnalysis(id: string, options?: RequestOptions): Promise<Analysis>
}

const DEFAULT_LATENCY_MS = 350

function copy<T>(value: T): T {
  return structuredClone(value)
}

function byNewest<T>(
  getTimestamp: (value: T) => string,
  getTieBreaker: (value: T) => string
) {
  return (left: T, right: T) =>
    getTimestamp(right).localeCompare(getTimestamp(left)) ||
    getTieBreaker(left).localeCompare(getTieBreaker(right))
}

function recordSearchText(record: ContentRecord): string {
  const fields: string[] = [
    record.id,
    record.tags.join(" "),
    record.bullets.map((bullet) => bullet.text).join(" "),
  ]

  switch (record.type) {
    case "profile":
      fields.push(record.name, record.headline, record.location, record.email)
      break
    case "project":
      fields.push(
        record.name,
        record.summary,
        record.technologies.join(" "),
        record.date
      )
      break
    case "skill":
      fields.push(record.name, record.category)
      break
    case "experience":
      fields.push(
        record.company,
        record.position,
        record.location ?? "",
        record.start_date,
        record.end_date ?? ""
      )
      break
    case "education":
      fields.push(
        record.institution,
        record.degree,
        record.area,
        record.start_date,
        record.end_date ?? ""
      )
      break
    case "award":
      fields.push(record.label, record.details, record.date)
      break
  }

  return fields.join(" ").toLocaleLowerCase()
}

function matchesFilters(record: ContentRecord, filters: ContentFilters) {
  if (filters.status && record.status !== filters.status) {
    return false
  }

  if (filters.query) {
    const query = filters.query.trim().toLocaleLowerCase()
    if (query && !recordSearchText(record).includes(query)) {
      return false
    }
  }

  if (filters.tags?.length) {
    const recordTags = new Set(record.tags)
    if (!filters.tags.every((tag) => recordTags.has(tag))) {
      return false
    }
  }

  return true
}

function abortError() {
  return new DOMException("The request was aborted.", "AbortError")
}

function delay(milliseconds: number, signal?: AbortSignal) {
  if (signal?.aborted) {
    return Promise.reject(abortError())
  }

  if (milliseconds <= 0) {
    return Promise.resolve()
  }

  return new Promise<void>((resolve, reject) => {
    const timer = globalThis.setTimeout(() => {
      signal?.removeEventListener("abort", handleAbort)
      resolve()
    }, milliseconds)

    function handleAbort() {
      globalThis.clearTimeout(timer)
      signal?.removeEventListener("abort", handleAbort)
      reject(abortError())
    }

    signal?.addEventListener("abort", handleAbort, { once: true })
  })
}

function notFound(
  code:
    | "CONTENT_NOT_FOUND"
    | "RECIPE_NOT_FOUND"
    | "BUILD_NOT_FOUND"
    | "QUALITY_CHECK_NOT_FOUND"
    | "ANALYSIS_NOT_FOUND",
  resource: string,
  id: string
) {
  return new ApiError(
    {
      code,
      message: `The requested ${resource} "${id}" was not found.`,
      details: { id },
    },
    404
  )
}

export class MockApiClient implements CvStudioApi {
  private readonly latencyMs: number
  private readonly scenario: MockScenario

  constructor(options: MockApiOptions = {}) {
    this.latencyMs = options.latencyMs ?? DEFAULT_LATENCY_MS
    this.scenario = options.scenario ?? "default"
  }

  private async respond(options: RequestOptions = {}) {
    await delay(this.latencyMs, options.signal)

    if (this.scenario === "unavailable") {
      const fixtureError = errorsFixture.errors.find(
        (error) => error.code === "SERVICE_UNAVAILABLE"
      )

      throw new ApiError(
        fixtureError ?? {
          code: "SERVICE_UNAVAILABLE",
          message: "The mock service is unavailable.",
          details: {},
        },
        fixtureError?.http_status ?? 503
      )
    }
  }

  async listContent(
    type: ContentType,
    filters: ContentFilters = {},
    options: RequestOptions = {}
  ): Promise<ItemsResponse<ContentRecord>> {
    await this.respond(options)

    if (this.scenario === "empty") {
      return { items: [] }
    }

    const items = contentFixture.records
      .filter(
        (record) => record.type === type && matchesFilters(record, filters)
      )
      .sort(
        byNewest(
          (record) => record.updated_at,
          (record) => record.id
        )
      )

    return { items: copy(items) }
  }

  async getContent(
    type: ContentType,
    id: string,
    options: RequestOptions = {}
  ): Promise<ContentRecord> {
    await this.respond(options)

    const record = contentFixture.records.find(
      (candidate) => candidate.type === type && candidate.id === id
    )

    if (!record) {
      throw notFound("CONTENT_NOT_FOUND", "content record", id)
    }

    return copy(record)
  }

  async listResumes(
    options: RequestOptions = {}
  ): Promise<ItemsResponse<ResumeRecipe>> {
    await this.respond(options)

    if (this.scenario === "empty") {
      return { items: [] }
    }

    const items = [...recipesFixture.recipes].sort(
      byNewest(
        (recipe) => recipe.updated_at,
        (recipe) => recipe.id
      )
    )

    return { items: copy(items) }
  }

  async getResume(
    id: string,
    options: RequestOptions = {}
  ): Promise<ResumeRecipe> {
    await this.respond(options)

    const recipe = recipesFixture.recipes.find(
      (candidate) => candidate.id === id
    )

    if (!recipe) {
      throw notFound("RECIPE_NOT_FOUND", "resume recipe", id)
    }

    return copy(recipe)
  }

  async listBuilds(
    options: RequestOptions = {}
  ): Promise<ItemsResponse<BuildResult>> {
    await this.respond(options)

    if (this.scenario === "empty") {
      return { items: [] }
    }

    const items = [...buildsFixture.builds].sort(
      byNewest(
        (build) => build.created_at,
        (build) => build.build_id
      )
    )

    return { items: copy(items) }
  }

  async getBuild(
    id: string,
    options: RequestOptions = {}
  ): Promise<BuildResult> {
    await this.respond(options)

    const build = buildsFixture.builds.find(
      (candidate) => candidate.build_id === id
    )

    if (!build) {
      throw notFound("BUILD_NOT_FOUND", "build", id)
    }

    return copy(build)
  }

  async getQualityReport(
    id: string,
    options: RequestOptions = {}
  ): Promise<QualityReport> {
    await this.respond(options)

    const report = qualityFixture.reports.find(
      (candidate) => candidate.report_id === id
    )

    if (!report) {
      throw notFound("QUALITY_CHECK_NOT_FOUND", "quality report", id)
    }

    return copy(report)
  }

  async getAnalysis(
    id: string,
    options: RequestOptions = {}
  ): Promise<Analysis> {
    await this.respond(options)

    if (assistantFixture.analysis.analysis_id !== id) {
      throw notFound("ANALYSIS_NOT_FOUND", "analysis", id)
    }

    return copy(assistantFixture.analysis)
  }
}

export function createMockApiClient(options: MockApiOptions = {}): CvStudioApi {
  return new MockApiClient(options)
}

export const defaultMockApi = createMockApiClient()

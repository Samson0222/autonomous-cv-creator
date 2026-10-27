import { describe, expect, it } from "vitest"

import { ApiError, createMockApiClient } from "@/api"

describe("typed mock API boundary", () => {
  it("returns deterministic collections in newest-first order", async () => {
    const client = createMockApiClient({ latencyMs: 0 })

    const recipes = await client.listResumes()
    expect(recipes.items.map((recipe) => recipe.id)).toEqual([
      "resume.footfallcam-graduate-ai",
      "resume.general",
    ])

    const builds = await client.listBuilds()
    expect(builds.items.map((build) => build.build_id)).toEqual([
      "build.20261027T150000.general",
      "build.20261027T143500.footfallcam",
      "build.20261026T091500.general",
      "build.20261025T184000.general",
    ])
  })

  it("filters content by type, status, query, and tags", async () => {
    const client = createMockApiClient({ latencyMs: 0 })

    const matchingProjects = await client.listContent("project", {
      query: "vision",
      tags: ["python"],
      status: "active",
    })

    expect(matchingProjects.items.map((record) => record.id)).toEqual([
      "project.notemercy",
    ])

    const archived = await client.listContent("project", {
      status: "archived",
    })
    expect(archived.items).toEqual([])
  })

  it("throws stable errors for missing resources", async () => {
    const client = createMockApiClient({ latencyMs: 0 })

    const contentRequest = client.getContent("project", "project.missing")
    await expect(contentRequest).rejects.toBeInstanceOf(ApiError)
    await expect(contentRequest).rejects.toMatchObject({
      code: "CONTENT_NOT_FOUND",
      status: 404,
    })

    await expect(
      client.getQualityReport("quality.missing")
    ).rejects.toMatchObject({
      code: "QUALITY_CHECK_NOT_FOUND",
      status: 404,
    })
  })

  it("supports empty and unavailable scenarios", async () => {
    const emptyClient = createMockApiClient({
      latencyMs: 0,
      scenario: "empty",
    })
    expect((await emptyClient.listBuilds()).items).toEqual([])
    expect((await emptyClient.listResumes()).items).toEqual([])

    const unavailableClient = createMockApiClient({
      latencyMs: 0,
      scenario: "unavailable",
    })
    await expect(unavailableClient.listResumes()).rejects.toMatchObject({
      code: "SERVICE_UNAVAILABLE",
      status: 503,
    })
  })

  it("returns isolated copies instead of mutable fixture references", async () => {
    const client = createMockApiClient({ latencyMs: 0 })

    const first = await client.getContent("project", "project.notemercy")
    first.tags.push("mutated")
    const second = await client.getContent("project", "project.notemercy")

    expect(second.tags).not.toContain("mutated")
  })

  it("honours an aborted request signal", async () => {
    const client = createMockApiClient({ latencyMs: 10 })
    const controller = new AbortController()
    controller.abort()

    await expect(
      client.listBuilds({ signal: controller.signal })
    ).rejects.toMatchObject({ name: "AbortError" })
  })
})

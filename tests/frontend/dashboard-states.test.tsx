import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { renderStudio } from "./render-studio"

describe("dashboard shared states", () => {
  it("renders fixture-backed success content", async () => {
    renderStudio("/", { latencyMs: 0 })

    expect(await screen.findByText("Recent builds")).toBeInTheDocument()
    expect(
      screen.getAllByText("FootfallCam Graduate AI Engineer").length
    ).toBeGreaterThan(0)
    expect(screen.getAllByText("General CV").length).toBeGreaterThan(0)
  })

  it("renders empty states when the mock workspace has no records", async () => {
    renderStudio("/", { latencyMs: 0, scenario: "empty" })

    expect(await screen.findByText("No builds yet")).toBeInTheDocument()
    expect(screen.getByText("No resume recipes")).toBeInTheDocument()
    expect(screen.getByText("No content yet")).toBeInTheDocument()
  })

  it("renders a stable error state when the mock API is unavailable", async () => {
    renderStudio("/", { latencyMs: 0, scenario: "unavailable" })

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Dashboard unavailable"
    )
    expect(screen.getByText("SERVICE_UNAVAILABLE")).toBeInTheDocument()
    expect(screen.queryByText("Recent builds")).not.toBeInTheDocument()
  })
})

import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { renderStudio } from "./render-studio"

const destinations = [
  { link: "Content Library", heading: "Content Library" },
  { link: "Resume Builder", heading: "Resume Builder" },
  { link: "Builds", heading: "Builds" },
  { link: "AI Assistant", heading: "AI Assistant" },
  { link: "Settings", heading: "Settings" },
  { link: "Dashboard", heading: "Dashboard" },
]

describe("application navigation", () => {
  it("moves between every primary screen and marks the active link", async () => {
    const { user } = renderStudio()

    expect(
      await screen.findByRole("heading", { level: 1, name: "Dashboard" })
    ).toBeInTheDocument()

    for (const destination of destinations) {
      await user.click(screen.getByRole("link", { name: destination.link }))

      expect(
        await screen.findByRole("heading", {
          level: 1,
          name: destination.heading,
        })
      ).toBeInTheDocument()
      expect(
        screen
          .getAllByRole("link", { name: destination.link })
          .some((link) => link.getAttribute("aria-current") === "page")
      ).toBe(true)
    }
  })

  it("renders a not-found screen for an unknown route", async () => {
    renderStudio("/unknown-route")

    expect(
      await screen.findByRole("heading", { level: 1, name: "Page not found" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: "Back to dashboard" })
    ).toHaveAttribute("href", "/")
  })
})

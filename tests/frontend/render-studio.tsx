import { render } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"

import { createMockApiClient, type MockApiOptions } from "@/api"
import { StudioApp } from "@/app/studio-app"

export function renderStudio(initialPath = "/", options: MockApiOptions = {}) {
  const client = createMockApiClient({ latencyMs: 0, ...options })
  const user = userEvent.setup()
  const view = render(
    <MemoryRouter initialEntries={[initialPath]}>
      <StudioApp client={client} />
    </MemoryRouter>
  )

  return { client, user, ...view }
}

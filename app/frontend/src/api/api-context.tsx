import { createContext, useContext, type ReactNode } from "react"

import type { CvStudioApi } from "./mock-client"

const ApiContext = createContext<CvStudioApi | null>(null)

export function ApiProvider({
  client,
  children,
}: {
  client: CvStudioApi
  children: ReactNode
}) {
  return <ApiContext.Provider value={client}>{children}</ApiContext.Provider>
}

export function useApi() {
  const client = useContext(ApiContext)

  if (!client) {
    throw new Error("useApi must be used within an ApiProvider")
  }

  return client
}

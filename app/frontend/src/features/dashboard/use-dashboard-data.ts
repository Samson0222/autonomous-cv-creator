import { useCallback, useEffect, useRef, useState } from "react"

import { normalizeApiError, useApi, type ApiError } from "@/api"

import { loadDashboard, type DashboardSnapshot } from "./dashboard-data"

export interface DashboardQuery {
  data: DashboardSnapshot | null
  error: ApiError | null
  isLoading: boolean
  isRefreshing: boolean
  refresh: () => Promise<DashboardSnapshot | null>
}

export function useDashboardData(): DashboardQuery {
  const api = useApi()
  const [data, setData] = useState<DashboardSnapshot | null>(null)
  const [error, setError] = useState<ApiError | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const inFlight = useRef<AbortController | null>(null)

  const execute = useCallback(
    async (controller: AbortController) => {
      try {
        const snapshot = await loadDashboard(api, {
          signal: controller.signal,
        })

        if (!controller.signal.aborted) {
          setData(snapshot)
          return snapshot
        }
      } catch (cause) {
        if (!controller.signal.aborted) {
          setError(normalizeApiError(cause))
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
          setIsRefreshing(false)
        }
      }

      return null
    },
    [api]
  )

  useEffect(() => {
    inFlight.current?.abort()
    const controller = new AbortController()
    inFlight.current = controller
    // Fetching on mount is the intended use of an effect. This helper only
    // updates state after the awaited mock request settles.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void execute(controller)

    return () => {
      controller.abort()
    }
  }, [execute])

  const refresh = useCallback(() => {
    inFlight.current?.abort()
    const controller = new AbortController()
    inFlight.current = controller
    setIsRefreshing(true)
    setError(null)

    return execute(controller)
  }, [execute])

  return { data, error, isLoading, isRefreshing, refresh }
}

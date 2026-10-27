import { ApiProvider, defaultMockApi, type CvStudioApi } from "@/api"
import { AppRoutes } from "@/app/app-routes"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

export function StudioApp({
  client = defaultMockApi,
}: {
  client?: CvStudioApi
}) {
  return (
    <ThemeProvider storageKey="cv-studio-theme">
      <ApiProvider client={client}>
        <TooltipProvider>
          <AppRoutes />
          <Toaster position="bottom-right" closeButton />
        </TooltipProvider>
      </ApiProvider>
    </ThemeProvider>
  )
}

import { Route, Routes } from "react-router-dom"

import { AppShell } from "@/app/app-shell"
import { DashboardPage } from "@/features/dashboard/dashboard-page"
import { AssistantPage } from "@/pages/assistant-page"
import { BuildsPage } from "@/pages/builds-page"
import { ContentLibraryPage } from "@/pages/content-library-page"
import { NotFoundPage } from "@/pages/not-found-page"
import { ResumeBuilderPage } from "@/pages/resume-builder-page"
import { SettingsPage } from "@/pages/settings-page"

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<DashboardPage />} />
        <Route path="content" element={<ContentLibraryPage />} />
        <Route path="resumes" element={<ResumeBuilderPage />} />
        <Route path="builds" element={<BuildsPage />} />
        <Route path="assistant" element={<AssistantPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

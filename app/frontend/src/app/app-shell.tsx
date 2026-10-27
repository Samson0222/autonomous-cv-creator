import { Outlet } from "react-router-dom"

import { AppHeader } from "@/app/app-header"
import { AppSidebar } from "@/app/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export function AppShell() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
          <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

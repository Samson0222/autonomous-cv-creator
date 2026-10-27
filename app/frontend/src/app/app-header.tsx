import { Link, useLocation } from "react-router-dom"

import { getRouteMeta } from "@/app/route-meta"
import { ThemeToggle } from "@/components/theme-toggle"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function AppHeader() {
  const { pathname } = useLocation()
  const route = getRouteMeta(pathname)
  const isDashboard = route.path === "/"

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="data-vertical:h-4 data-vertical:self-auto"
      />
      <Breadcrumb className="min-w-0">
        <BreadcrumbList className="flex-nowrap gap-1.5">
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink asChild>
              <Link to="/">CV Studio</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {!isDashboard ? (
            <>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden text-muted-foreground sm:block">
                {route.section}
              </BreadcrumbItem>
            </>
          ) : null}
          <BreadcrumbSeparator
            className={isDashboard ? "hidden md:block" : "hidden sm:block"}
          />
          <BreadcrumbItem className="min-w-0">
            <BreadcrumbPage className="truncate">{route.label}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex shrink-0 items-center gap-1.5">
        <Badge variant="outline" className="hidden gap-1.5 sm:inline-flex">
          <span
            className="size-1.5 rounded-full bg-muted-foreground"
            aria-hidden="true"
          />
          Mock data
        </Badge>
        <ThemeToggle />
      </div>
    </header>
  )
}

import { Link } from "react-router-dom"

import type { StudioRouteMeta } from "@/app/route-meta"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export function FeaturePlaceholder({ route }: { route: StudioRouteMeta }) {
  const Icon = route.icon
  const taskLabel = route.task ?? "a later WS04 task"

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={route.label}
        description={route.description}
        actions={<Badge variant="outline">{route.task ?? "Planned"}</Badge>}
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
        <Card className="min-h-80">
          <CardContent className="flex h-full items-center justify-center py-8">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Icon aria-hidden="true" />
                </EmptyMedia>
                <EmptyTitle>{route.label} is scaffolded</EmptyTitle>
                <EmptyDescription>
                  The routes and shared states are ready. The full workflow
                  arrives in {taskLabel}.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <div className="flex flex-wrap justify-center gap-2">
                  <Button asChild>
                    <Link to="/">Back to dashboard</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/settings">Preview shared states</Link>
                  </Button>
                </div>
              </EmptyContent>
            </Empty>
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardTitle>Planned scope</CardTitle>
            <CardDescription>
              Frozen in the WS04 workstream plan and not implemented in this
              shell.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="flex flex-col gap-3">
              {(route.features ?? []).map((feature, index) => (
                <li key={feature} className="flex gap-2.5 text-sm">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-[0.65rem] font-medium text-muted-foreground tabular-nums">
                    {index + 1}
                  </span>
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

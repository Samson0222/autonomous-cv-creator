import { CircleCheckIcon, FolderOpenIcon, OctagonXIcon } from "lucide-react"
import type { ReactNode } from "react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"

function StateTile({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="flex min-h-36 flex-col gap-3 rounded-lg border p-3">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <div className="flex flex-1 flex-col justify-center">{children}</div>
    </div>
  )
}

export function StateGallery() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shared state reference</CardTitle>
        <CardDescription>
          The shell uses the same loading, empty, success, and error treatments
          on every route. These previews are static.
        </CardDescription>
        <CardAction>
          <Badge variant="outline">Preview</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2">
        <StateTile label="Loading">
          <div className="flex flex-col gap-3" role="status">
            <span className="sr-only">Loading preview</span>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Spinner data-icon="inline-start" />
              Loading workspace
            </div>
            <Skeleton className="h-2.5 w-full" />
            <Skeleton className="h-2.5 w-4/5" />
            <Skeleton className="h-2.5 w-2/3" />
          </div>
        </StateTile>

        <StateTile label="Empty">
          <Empty className="border p-4">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FolderOpenIcon aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>No content yet</EmptyTitle>
              <EmptyDescription>
                Create a record or load sample data to begin.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </StateTile>

        <StateTile label="Success">
          <Alert>
            <CircleCheckIcon aria-hidden="true" />
            <AlertTitle>Workspace ready</AlertTitle>
            <AlertDescription>
              Mock data loaded with 2 resumes and 4 builds.
            </AlertDescription>
          </Alert>
        </StateTile>

        <StateTile label="Error">
          <Alert variant="destructive">
            <OctagonXIcon aria-hidden="true" />
            <AlertTitle>Service unavailable</AlertTitle>
            <AlertDescription>
              The mock adapter is offline. Retry after it reconnects.{" "}
              <span className="font-mono text-xs">SERVICE_UNAVAILABLE</span>
            </AlertDescription>
          </Alert>
        </StateTile>
      </CardContent>
    </Card>
  )
}

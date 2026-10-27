import { Link } from "react-router-dom"

import { NOT_FOUND_ROUTE } from "@/app/route-meta"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export function NotFoundPage() {
  const Icon = NOT_FOUND_ROUTE.icon

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={NOT_FOUND_ROUTE.label}
        description={NOT_FOUND_ROUTE.description}
      />
      <Card className="min-h-72">
        <CardContent className="flex h-full items-center justify-center py-8">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Icon aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>This route is not in the shell</EmptyTitle>
              <EmptyDescription>
                Check the address or return to the dashboard to continue.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button asChild>
                <Link to="/">Back to dashboard</Link>
              </Button>
            </EmptyContent>
          </Empty>
        </CardContent>
      </Card>
    </div>
  )
}

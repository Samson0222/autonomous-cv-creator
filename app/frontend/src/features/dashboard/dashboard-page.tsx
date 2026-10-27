import { Fragment } from "react"
import {
  ArrowRightIcon,
  CircleCheckIcon,
  FileStackIcon,
  HammerIcon,
  LibraryBigIcon,
  OctagonXIcon,
  PlusIcon,
  RefreshCwIcon,
  ShieldCheckIcon,
} from "lucide-react"
import { Link } from "react-router-dom"
import { toast } from "sonner"

import type {
  BuildResult,
  ContentType,
  QualityStatus,
  ResumeRecipe,
} from "@/api"
import { PageHeader } from "@/components/page-header"
import {
  BuildStatusBadge,
  QualityStatusBadge,
} from "@/components/status-badges"
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  type ContentSummary,
  type DashboardSnapshot,
} from "@/features/dashboard/dashboard-data"
import { useDashboardData } from "@/features/dashboard/use-dashboard-data"
import { formatDateTime } from "@/lib/dates"

const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  profile: "Profile",
  project: "Projects",
  skill: "Skills",
  experience: "Experience",
  education: "Education",
  award: "Awards",
}

const QUALITY_LABELS: Record<QualityStatus, string> = {
  not_run: "Not run",
  passed: "Passed",
  warnings: "Warnings",
  failed: "Failed",
}

function shortBuildId(buildId: string) {
  return buildId.replace(/^build\./, "")
}

export function DashboardPage() {
  const { data, error, isLoading, isRefreshing, refresh } = useDashboardData()
  const isBusy = isLoading || isRefreshing

  async function handleRefresh() {
    const snapshot = await refresh()

    if (snapshot) {
      toast.success("Mock workspace refreshed", {
        description: `${snapshot.recipes.length} resume recipes and ${snapshot.builds.length} builds loaded.`,
      })
      return
    }

    toast.error("Refresh failed", {
      description: "The mock API did not return a workspace snapshot.",
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        description="A local view of your content, resume recipes, and recent builds. Every value comes from the Phase 0 mock fixtures."
        actions={
          <>
            <Button variant="outline" onClick={handleRefresh} disabled={isBusy}>
              {isBusy ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <RefreshCwIcon data-icon="inline-start" />
              )}
              Refresh
            </Button>
            <Button asChild>
              <Link to="/resumes">
                <PlusIcon data-icon="inline-start" />
                Open resume builder
              </Link>
            </Button>
          </>
        }
      />

      {error ? (
        <Alert variant="destructive">
          <OctagonXIcon aria-hidden="true" />
          <AlertTitle>
            {data ? "Refresh failed" : "Dashboard unavailable"}
          </AlertTitle>
          <AlertDescription>
            {error.message}{" "}
            <span className="font-mono text-xs">{error.code}</span>
          </AlertDescription>
          <AlertAction>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isBusy}
            >
              <RefreshCwIcon data-icon="inline-start" />
              Retry
            </Button>
          </AlertAction>
        </Alert>
      ) : null}

      {isLoading && !data ? <DashboardSkeleton /> : null}
      {data ? <DashboardContent snapshot={data} /> : null}
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-4" role="status" aria-busy="true">
      <span className="sr-only">Loading dashboard</span>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} size="sm">
            <CardHeader>
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-7 w-14" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-3 w-64" />
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-full" />
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-48" />
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-52 w-full rounded-xl" />
        <Skeleton className="h-52 w-full rounded-xl" />
      </div>
    </div>
  )
}

function DashboardContent({ snapshot }: { snapshot: DashboardSnapshot }) {
  const { content, recipes, builds } = snapshot
  const activeRecipes = recipes.filter((recipe) => recipe.status === "active")
  const passedBuilds = builds.filter((build) => build.status === "passed")
  const latestCompletedBuild =
    builds.find((build) => build.completed_at !== null) ?? null
  const recentBuilds = builds.slice(0, 4)
  const recipeNames = new Map(
    recipes.map((recipe) => [recipe.id, recipe.name] as const)
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          label="Resume recipes"
          value={activeRecipes.length}
          detail={`${recipes.length} total · ${activeRecipes.length} active`}
          icon={FileStackIcon}
        />
        <StatCard
          label="Content records"
          value={content.active}
          detail={`${content.total} total · ${content.needsReview} need review`}
          icon={LibraryBigIcon}
        />
        <StatCard
          label="Builds"
          value={builds.length}
          detail={`${passedBuilds.length} passed · ${builds.length - passedBuilds.length} other`}
          icon={HammerIcon}
        />
        <StatCard
          label="Latest quality"
          value={
            latestCompletedBuild
              ? QUALITY_LABELS[latestCompletedBuild.quality_status]
              : "Not run"
          }
          detail={
            latestCompletedBuild
              ? formatDateTime(latestCompletedBuild.completed_at)
              : "No completed build"
          }
          icon={ShieldCheckIcon}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)]">
        <RecentBuildsCard builds={recentBuilds} recipeNames={recipeNames} />
        <RecipesCard recipes={recipes} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ContentOverviewCard content={content} />
        <QualityCard build={latestCompletedBuild} />
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string
  value: string | number
  detail: string
  icon: typeof FileStackIcon
}) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl font-semibold tracking-tight tabular-nums">
          {value}
        </CardTitle>
        <CardAction>
          <Icon aria-hidden="true" className="size-4 text-muted-foreground" />
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  )
}

function RecentBuildsCard({
  builds,
  recipeNames,
}: {
  builds: BuildResult[]
  recipeNames: Map<string, string>
}) {
  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>Recent builds</CardTitle>
        <CardDescription>
          Latest RenderCV outputs from the mock workspace.
        </CardDescription>
        <CardAction>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/builds">
              View all
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {builds.length === 0 ? (
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <HammerIcon aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>No builds yet</EmptyTitle>
              <EmptyDescription>
                Build history will appear after a resume recipe is rendered.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="outline" asChild>
                <Link to="/resumes">Open resume builder</Link>
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Built</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Quality</TableHead>
                <TableHead className="text-right">Pages</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {builds.map((build) => (
                <TableRow key={build.build_id}>
                  <TableCell title={build.build_id}>
                    <span className="block font-medium">
                      {formatDateTime(build.created_at)}
                    </span>
                    <span className="block max-w-36 truncate text-xs text-muted-foreground sm:max-w-40">
                      {recipeNames.get(build.recipe_id) ?? build.recipe_id}
                    </span>
                  </TableCell>
                  <TableCell>
                    <BuildStatusBadge status={build.status} />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <QualityStatusBadge status={build.quality_status} />
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {build.page_count ?? "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

function RecipesCard({ recipes }: { recipes: ResumeRecipe[] }) {
  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>Resume recipes</CardTitle>
        <CardDescription>
          Tailored variants ready for selection and ordering.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {recipes.length === 0 ? (
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileStackIcon aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>No resume recipes</EmptyTitle>
              <EmptyDescription>
                Create a recipe to start selecting shared content.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="flex flex-col gap-3">
            {recipes.map((recipe, index) => (
              <Fragment key={recipe.id}>
                {index > 0 ? <Separator /> : null}
                <RecipeRow recipe={recipe} />
              </Fragment>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/resumes">
            Open resume builder
            <ArrowRightIcon data-icon="inline-end" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function RecipeRow({ recipe }: { recipe: ResumeRecipe }) {
  const target =
    [recipe.target.company, recipe.target.role].filter(Boolean).join(" · ") ||
    "General-purpose"

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-start justify-between gap-2">
        <p className="min-w-0 leading-snug font-medium">{recipe.name}</p>
        <Badge variant="outline" className="shrink-0">
          {recipe.settings.page_limit}{" "}
          {recipe.settings.page_limit === 1 ? "page" : "pages"}
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground">{target}</p>
      <div className="flex flex-wrap gap-1">
        {recipe.tags.slice(0, 3).map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  )
}

function ContentOverviewCard({ content }: { content: ContentSummary }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content library</CardTitle>
        <CardDescription>
          {content.active} active of {content.total} records across six types.
        </CardDescription>
        <CardAction>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/content">
              Browse
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {content.total === 0 ? (
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <LibraryBigIcon aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>No content yet</EmptyTitle>
              <EmptyDescription>
                The shared library will appear here once records exist.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {(Object.keys(CONTENT_TYPE_LABELS) as ContentType[]).map((type) => (
              <div key={type} className="rounded-lg border p-2">
                <p className="text-xs text-muted-foreground">
                  {CONTENT_TYPE_LABELS[type]}
                </p>
                <p className="mt-1 text-lg font-medium tabular-nums">
                  {content.byType[type]}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function QualityCard({ build }: { build: BuildResult | null }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest quality check</CardTitle>
        <CardDescription>
          From the most recently completed build.
        </CardDescription>
        <CardAction>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/builds">
              Review
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {build ? (
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <QualityStatusBadge status={build.quality_status} />
              <span className="text-xs text-muted-foreground">
                {formatDateTime(build.completed_at)}
              </span>
            </div>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div className="min-w-0">
                <dt className="text-xs text-muted-foreground">Build</dt>
                <dd
                  className="truncate font-mono text-xs"
                  title={build.build_id}
                >
                  {shortBuildId(build.build_id)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Pages</dt>
                <dd className="tabular-nums">{build.page_count ?? "—"}</dd>
              </div>
            </dl>
            <Separator />
            <p className="text-xs text-muted-foreground">
              Findings, release gating, and downloads arrive with WS04-D.
            </p>
          </div>
        ) : (
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CircleCheckIcon aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>No completed build</EmptyTitle>
              <EmptyDescription>
                Quality results appear after the first completed render.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </CardContent>
    </Card>
  )
}

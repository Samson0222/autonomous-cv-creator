import { PageHeader } from "@/components/page-header"
import { StateGallery } from "@/components/state-gallery"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const plannedSettings = [
  {
    label: "Page limit",
    value: "1 or 2 pages",
    description: "Validated before a resume is compiled or rendered.",
  },
  {
    label: "Theme",
    value: "engineeringclassic",
    description: "The RenderCV theme name stays pinned to the recipe.",
  },
  {
    label: "Output name",
    value: "Samson_Lai_Graduate_AI_Engineer_FootfallCam_CV",
    description: "A filename stem with no path separators or extension.",
  },
  {
    label: "Default promotion",
    value: "Explicit confirmation only",
    description: "Normal builds never overwrite the tracked default CV.",
  },
]

export function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Settings"
        description="Workspace defaults and the shared state treatments used by every route."
        actions={<Badge variant="outline">Scaffold</Badge>}
      />

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Planned workspace controls</CardTitle>
            <CardDescription>
              The values are read-only mock defaults in WS04-A. Editing forms
              are intentionally deferred.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {plannedSettings.map((setting, index) => (
                <div key={setting.label} className="flex flex-col gap-3">
                  {index > 0 ? <Separator /> : null}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-col gap-1">
                      <p className="text-sm font-medium">{setting.label}</p>
                      <p
                        className="truncate font-mono text-xs text-muted-foreground"
                        title={setting.value}
                      >
                        {setting.value}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {setting.description}
                      </p>
                    </div>
                    <Badge variant="outline" className="shrink-0">
                      Planned
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <StateGallery />
      </div>
    </div>
  )
}

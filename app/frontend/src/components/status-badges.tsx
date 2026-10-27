import {
  CircleCheckIcon,
  CircleHelpIcon,
  ClockIcon,
  LoaderCircleIcon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { BuildStatus, QualityStatus } from "@/api"

const buildPresentation: Record<
  BuildStatus,
  {
    label: string
    variant: "default" | "secondary" | "destructive" | "outline"
    icon: typeof ClockIcon
    spin?: boolean
  }
> = {
  queued: { label: "Queued", variant: "outline", icon: ClockIcon },
  rendering: {
    label: "Rendering",
    variant: "secondary",
    icon: LoaderCircleIcon,
    spin: true,
  },
  passed: { label: "Passed", variant: "secondary", icon: CircleCheckIcon },
  failed: { label: "Failed", variant: "destructive", icon: OctagonXIcon },
}

const qualityPresentation: Record<
  QualityStatus,
  {
    label: string
    variant: "default" | "secondary" | "destructive" | "outline"
    icon: typeof ClockIcon
  }
> = {
  not_run: { label: "Not run", variant: "outline", icon: CircleHelpIcon },
  passed: {
    label: "Quality passed",
    variant: "secondary",
    icon: CircleCheckIcon,
  },
  warnings: {
    label: "Warnings",
    variant: "outline",
    icon: TriangleAlertIcon,
  },
  failed: {
    label: "Quality failed",
    variant: "destructive",
    icon: OctagonXIcon,
  },
}

export function BuildStatusBadge({ status }: { status: BuildStatus }) {
  const presentation = buildPresentation[status]
  const Icon = presentation.icon

  return (
    <Badge variant={presentation.variant}>
      <Icon
        aria-hidden="true"
        className={cn(presentation.spin && "animate-spin")}
      />
      {presentation.label}
    </Badge>
  )
}

export function QualityStatusBadge({ status }: { status: QualityStatus }) {
  const presentation = qualityPresentation[status]
  const Icon = presentation.icon

  return (
    <Badge variant={presentation.variant}>
      <Icon aria-hidden="true" />
      {presentation.label}
    </Badge>
  )
}

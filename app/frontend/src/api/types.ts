export const CONTENT_TYPES = [
  "profile",
  "project",
  "skill",
  "experience",
  "education",
  "award",
] as const

export type ContentType = (typeof CONTENT_TYPES)[number]

export type RecordStatus = "active" | "archived" | "needs_review"
export type Verification = "verified" | "needs_verification"
export type Ownership =
  "individual" | "university_team" | "industry_team" | "tutorial"
export type EvidenceType =
  | "repository"
  | "deployment"
  | "documentation"
  | "certificate"
  | "publication"
  | "award"
  | "other"

export type BuildStatus = "queued" | "rendering" | "passed" | "failed"
export type QualityStatus = "not_run" | "passed" | "warnings" | "failed"
export type FindingSeverity = "error" | "warning" | "info"
export type ProposalKind =
  "replace_text" | "select" | "deselect" | "reorder" | "flag"
export type ProposalStatus = "proposed" | "accepted" | "rejected"
export type AnalysisStatus = "completed" | "failed"

export type ErrorCode =
  | "VALIDATION_ERROR"
  | "CONTENT_NOT_FOUND"
  | "CONTENT_ID_CONFLICT"
  | "CONTENT_REFERENCE_MISSING"
  | "CONTENT_REFERENCE_ARCHIVED"
  | "BULLET_REFERENCE_MISSING"
  | "RECIPE_NOT_FOUND"
  | "RECIPE_COMPILE_FAILED"
  | "BUILD_NOT_FOUND"
  | "BUILD_INCOMPLETE"
  | "BUILD_FAILED"
  | "PROMOTION_REQUIRES_EXPLICIT_OPERATION"
  | "PROMOTION_NOT_ALLOWED"
  | "RENDERER_VERSION_MISMATCH"
  | "RENDER_FAILED"
  | "QUALITY_CHECK_NOT_FOUND"
  | "ANALYSIS_NOT_FOUND"
  | "PROPOSAL_NOT_FOUND"
  | "PROPOSAL_NEEDS_VERIFICATION"
  | "PROPOSAL_NOT_ACCEPTED"
  | "SERVICE_UNAVAILABLE"
  | "INTERNAL_ERROR"

export interface Evidence {
  type: EvidenceType
  reference: string
  note?: string
}

export interface Bullet {
  id: string
  text: string
  tags: string[]
  verification: Verification
  evidence: Evidence[]
}

export interface ContentLink {
  label: string
  url: string
}

export interface SocialNetwork {
  network: string
  username: string
}

interface RecordEnvelope<TType extends ContentType> {
  id: string
  type: TType
  version: number
  status: RecordStatus
  tags: string[]
  created_at: string
  updated_at: string
  bullets: Bullet[]
}

export interface ProfileRecord extends RecordEnvelope<"profile"> {
  name: string
  headline: string
  location: string
  email: string
  phone?: string
  website?: string
  social_networks?: SocialNetwork[]
}

export interface ProjectRecord extends RecordEnvelope<"project"> {
  name: string
  ownership: Ownership
  date: string
  summary: string
  links?: ContentLink[]
  technologies: string[]
}

export interface SkillRecord extends RecordEnvelope<"skill"> {
  name: string
  category: string
  evidence?: Evidence[]
}

export interface ExperienceRecord extends RecordEnvelope<"experience"> {
  company: string
  position: string
  start_date: string
  end_date?: string
  ownership: Ownership
  location?: string
  links?: ContentLink[]
}

export interface EducationRecord extends RecordEnvelope<"education"> {
  institution: string
  degree: string
  area: string
  start_date: string
  end_date?: string
  ownership: Ownership
  links?: ContentLink[]
}

export interface AwardRecord extends RecordEnvelope<"award"> {
  label: string
  date: string
  ownership: Ownership
  details: string
  links?: ContentLink[]
}

export type ContentRecord =
  | ProfileRecord
  | ProjectRecord
  | SkillRecord
  | ExperienceRecord
  | EducationRecord
  | AwardRecord

export interface ContentFilters {
  status?: RecordStatus
  query?: string
  tags?: string[]
}

export type SectionToken =
  | "professional_summary"
  | "technical_skills"
  | "projects"
  | "professional_experience"
  | "education"
  | "awards"

export interface LocalOverrides {
  name?: string
  summary?: string
  bullet_text?: Record<string, string>
}

export interface RecipeSelection {
  record_id: string
  bullet_ids: string[]
  local_overrides: LocalOverrides
}

export interface ResumeSelections {
  projects: RecipeSelection[]
  experience: RecipeSelection[]
  education: RecipeSelection[]
  awards: RecipeSelection[]
  skills: {
    include_tags: string[]
    explicit_ids: string[]
  }
}

export interface ResumeSettings {
  page_limit: 1 | 2
  theme: string
  output_name: string
}

export interface ResumeRecipe {
  id: string
  version: number
  status: RecordStatus
  tags: string[]
  created_at: string
  updated_at: string
  name: string
  target: {
    company: string | null
    role: string | null
  }
  headline: string
  summary_override: string | null
  section_order: SectionToken[]
  section_labels?: Partial<Record<SectionToken, string>>
  selections: ResumeSelections
  settings: ResumeSettings
}

export interface BuildRequest {
  recipe_id: string
  requested_by: string
  promote_to_default: boolean
}

export interface BuildFailure {
  code: ErrorCode
  message: string
}

export interface BuildPaths {
  recipe_snapshot: string
  rendercv_source: string
  pdf: string | null
  manifest: string
  render_log: string
  quality_report: string | null
}

export interface BuildResult {
  build_id: string
  status: BuildStatus
  recipe_id: string
  rendercv_version: string
  source_hash: string
  created_at: string
  completed_at: string | null
  page_count: number | null
  quality_status: QualityStatus
  paths: BuildPaths
  failure: BuildFailure | null
}

export interface FindingTarget {
  record_id: string | null
  bullet_id: string | null
  field: string | null
}

export interface QualityFinding {
  id: string
  severity: FindingSeverity
  check: string
  message: string
  target: FindingTarget
  blocking: boolean
}

export interface QualityReport {
  report_id: string
  build_id: string
  status: QualityStatus
  release_ready: boolean
  blocking_count: number
  warning_count: number
  info_count: number
  findings: QualityFinding[]
  generated_at: string
}

export interface AnalysisRequest {
  recipe_id: string
  requested_by: string
  job_description: string
}

export interface RelevanceMatch {
  record_id: string
  score: number
  reasons: string[]
}

export interface ProposalTarget {
  recipe_id: string
  field: string
  record_id: string | null
  bullet_id: string | null
}

export type ProposalValue = string | number | boolean | null | string[]

export interface Proposal {
  id: string
  kind: ProposalKind
  target: ProposalTarget
  current_value: ProposalValue
  proposed_value: ProposalValue
  reason: string
  source_record_ids: string[]
  evidence_ids: string[]
  verification: Verification
  status: ProposalStatus
}

export interface Analysis {
  analysis_id: string
  recipe_id: string
  job_description_hash: string
  created_at: string
  status: AnalysisStatus
  relevance: RelevanceMatch[]
  proposals: Proposal[]
}

export interface ApplyRequest {
  accepted_proposal_ids: string[]
}

export interface PatchChange {
  proposal_id: string
  target: ProposalTarget
  before: ProposalValue
  after: ProposalValue
}

export interface PatchPreview {
  patch_id: string
  analysis_id: string
  recipe_id: string
  accepted_proposal_ids: string[]
  changes: PatchChange[]
  persisted: false
  created_at: string
}

export interface ItemsResponse<T> {
  items: T[]
}

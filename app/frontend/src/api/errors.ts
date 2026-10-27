import type { ErrorCode } from "./types"

export interface ApiErrorBody {
  code: ErrorCode
  message: string
  details: Record<string, unknown>
}

export class ApiError extends Error {
  readonly code: ErrorCode
  readonly status: number
  readonly details: Record<string, unknown>

  constructor(body: ApiErrorBody, status: number) {
    super(body.message)
    this.name = "ApiError"
    this.code = body.code
    this.status = status
    this.details = body.details
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

export function normalizeApiError(error: unknown): ApiError {
  if (isApiError(error)) {
    return error
  }

  if (error instanceof Error) {
    return new ApiError(
      {
        code: "INTERNAL_ERROR",
        message: error.message,
        details: {},
      },
      500
    )
  }

  return new ApiError(
    {
      code: "INTERNAL_ERROR",
      message: "An unexpected error interrupted the request.",
      details: {},
    },
    500
  )
}

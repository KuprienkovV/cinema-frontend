const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const getString = (value: unknown): string | undefined =>
  typeof value === 'string' ? value : undefined

const getNumber = (value: unknown): number | undefined =>
  typeof value === 'number' ? value : undefined

const extractDataMessage = (data: unknown): string | undefined => {
  if (!isRecord(data)) {
    return undefined
  }

  return getString(data.message)
}

export interface ApiError {
  message: string
  statusCode?: number
  data?: unknown
}

export function toApiError(error: unknown, fallbackMessage = 'Произошла ошибка'): ApiError {
  if (typeof error === 'string') {
    return { message: error }
  }

  if (isRecord(error)) {
    const message =
      extractDataMessage(error.data) ??
      getString(error.message) ??
      getString(error.statusMessage) ??
      fallbackMessage

    return {
      message,
      statusCode: getNumber(error.statusCode) ?? getNumber(error.status),
      data: error.data,
    }
  }

  if (error instanceof Error) {
    return { message: error.message || fallbackMessage }
  }

  return { message: fallbackMessage }
}


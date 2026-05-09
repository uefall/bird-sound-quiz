import type { ApiFailure, ApiSuccess } from "../../types/api";

function buildMeta() {
  return {
    requestId: `req_${Math.random().toString(36).slice(2, 10)}`,
    timestamp: new Date().toISOString(),
  };
}

export function ok<T>(data: T): ApiSuccess<T> {
  return {
    ok: true,
    data,
    meta: buildMeta(),
  };
}

export function fail(
  code: ApiFailure["error"]["code"],
  message: string,
  details?: Record<string, unknown>,
): ApiFailure {
  return {
    ok: false,
    error: {
      code,
      message,
      details,
    },
    meta: buildMeta(),
  };
}

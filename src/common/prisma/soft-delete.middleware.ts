export function applySoftDeleteFilter<T extends Record<string, unknown>>(
  where?: T,
): T & { is_deleted: boolean } {
  return {
    ...where,
    is_deleted: false,
  } as T & { is_deleted: boolean };
}

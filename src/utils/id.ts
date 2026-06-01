/** Generate a unique ID for a new destination record. */
export function generateId(): string {
  return `dest-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

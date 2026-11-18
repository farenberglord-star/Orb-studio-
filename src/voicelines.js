// Реплики выпуска от модели иногда приходят не массивом (строка JSON или объект {"0":…}); приводим к массиву, чтобы не падать.
export function asLines(v) {
  if (typeof v === "string") { try { v = JSON.parse(v); } catch (e) { return []; } }
  if (Array.isArray(v)) return v.filter((l) => l && typeof l === "object");
  if (v && typeof v === "object") return Object.values(v).filter((l) => l && typeof l === "object");
  return [];
}

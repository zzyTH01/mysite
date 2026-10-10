const configuredBase = import.meta.env.BASE_URL === "/" ? "/mysite" : import.meta.env.BASE_URL;

function normalize_base(base: string): string {
  return base.replace(/\/+$/, "");
}

export function with_base(path: string, baseOverride?: string): string {
  if (!path.startsWith("/")) return path;

  const base = baseOverride === undefined ? normalize_base(configuredBase) : normalize_base(baseOverride);
  if (!base) return path;

  if (path === base || path.startsWith(`${base}/`)) return path;
  return `${base}${path}`;
}

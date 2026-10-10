type Dated = { data: { date: Date } };
type LatestItemsOptions = { limit?: number };

export function latest_items<T extends Dated>(...groups: T[][]): T[];
export function latest_items<T extends Dated>(...input: [...T[][], LatestItemsOptions]): T[];
export function latest_items<T extends Dated>(...input: Array<T[] | LatestItemsOptions>): T[] {
  const maybeOptions = input.at(-1);
  const hasOptions = typeof maybeOptions === "object" && maybeOptions !== null && "limit" in maybeOptions;
  const groups = (hasOptions ? input.slice(0, -1) : input) as T[][];
  const limit = hasOptions ? Number((maybeOptions as LatestItemsOptions).limit ?? 5) : 5;
  return groups
    .flat()
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .slice(0, limit);
}

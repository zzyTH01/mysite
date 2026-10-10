import { z } from "zod";

export const blogSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.coerce.date(),
  tags: z.array(z.string()).default([]),
  cover: z.string().optional(),
  draft: z.boolean().default(false),
});

export const noteSchema = z.object({
  title: z.string().min(1),
  date: z.coerce.date(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
});

export const lifeSchema = z.object({
  title: z.string().min(1),
  date: z.coerce.date(),
  summary: z.string().min(1),
  location: z.string().optional(),
  tags: z.array(z.string()).default([]),
  photos: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
});

type Dated = { data: { date: Date } };
type Draftable = { data: { draft?: boolean } };

export function visible_entries<T extends Draftable>(entries: T[], production: boolean): T[] {
  return production ? entries.filter(({ data }) => !data.draft) : entries;
}

export const visibleEntries = visible_entries;

export function sort_by_date_desc<T extends Dated>(entries: T[]): T[] {
  return [...entries].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function format_date(date: Date): string {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

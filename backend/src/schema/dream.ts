import { z } from 'zod';

export const searchQuerySchema = z.object({
  q: z.string().optional(),
  tag: z.string().optional(),
  sort: z.enum(['newest', 'oldest', 'likes', 'comments']).default('newest')
});

export const createDreamSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です'),
  content: z.string().min(1, '内容は必須です'),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().default(true)
});

export const updateDreamSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です'),
  content: z.string().min(1, '内容は必須です'),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean()
});

export type SearchQuery = z.infer<typeof searchQuerySchema>;
export type CreateDreamInput = z.infer<typeof createDreamSchema>;
export type UpdateDreamInput = z.infer<typeof updateDreamSchema>;

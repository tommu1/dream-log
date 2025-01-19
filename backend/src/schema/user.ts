import { z } from 'zod';

export const updateProfileSchema = z.object({
  displayName: z.string().min(1, '表示名は必須です'),
  bio: z.string().optional(),
  avatarUrl: z.string().url().optional()
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

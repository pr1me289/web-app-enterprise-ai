import { defineCollection, z } from 'astro:content';

const parts = defineCollection({
  type: 'content',
  schema: z.object({
    order: z.number(),
    key: z.string(),
    eyebrow: z.string(),
    title: z.string(),
    lede: z.string().optional(),
    tone: z.enum(['default', 'muted', 'inset']).default('default'),
  }),
});

export const collections = { parts };

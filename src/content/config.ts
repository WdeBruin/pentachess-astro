import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.number().optional(),
    title: z.string(),
    date: z.coerce.date(),
    author: z.string().default('Wouter de Bruin'),
    authorSlug: z.string().default('admin'),
    excerpt: z.string().optional(),
  }),
});

export const collections = { posts };

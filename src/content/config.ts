import { defineCollection, reference, z } from "astro:content";
import { glob } from "astro/loaders";
import type { DefTree } from "./types";

const defTree: z.ZodType<DefTree> = z
  .union([
    z.string(),
    z
      .object({
        meaning: z.string(),
        examples: z
          .object({
            hs: z.string(),
            en: z.string(),
          })
          .strict()
          .array()
          .nonempty()
          .optional(),
        children: z.lazy(() => defTree).optional(),
      })
      .strict(),
  ])
  .array()
  .nonempty();

const words = defineCollection({
  loader: glob({ base: "src/content/words", pattern: "**/*.yaml" }),
  schema: z
    .object({
      ipa: z.string().optional(),
      parts: z.record(
        z.enum([
          "noun",
          "verb",
          "adjective",
          "pronoun",
          "interjection",
        ] as const),
        z
          .object({
            defs: defTree,
            etym: z.string().optional(),
            rel: reference("words").array().nonempty().optional(),
          })
          .strict(),
      ),
    })
    .strict(),
});

export const collections = { words };

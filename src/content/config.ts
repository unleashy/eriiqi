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
  schema: z.record(
    z.enum(["noun", "verb", "adjective", "pronoun"] as const),
    z
      .object({
        etym: z.string().optional(),
        defs: defTree,
        rel: reference("words").array().nonempty().optional(),
      })
      .strict(),
  ),
});

export const collections = { words };

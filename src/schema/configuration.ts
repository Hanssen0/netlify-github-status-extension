import { z } from "zod";

export const settingsSchema = z.object({
  jwt: z
    .string()
    .optional()
    .transform((arg) => (arg === "" ? undefined : arg)),
  url: z
    .string()
    .optional()
    .transform((arg) => (arg === "" ? undefined : arg)),
  enabled: z
    .union([z.string(), z.boolean()])
    .optional()
    .transform(
      (arg) =>
        ({ true: true, false: false }[arg?.toString()?.toLowerCase() ?? ""])
    ),
});

export const settingsDefaultSchema = z.object({
  jwt: settingsSchema.shape.jwt,
  url: settingsSchema.shape.url.default(
    "https://netlify-github-status.netlify.app/.netlify/functions/deployment"
  ),
  enabled: settingsSchema.shape.enabled.default(true),
});

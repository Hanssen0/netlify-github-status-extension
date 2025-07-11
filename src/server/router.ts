import { TRPCError } from "@trpc/server";
import { procedure, router } from "./trpc.js";
import {
  settingsDefaultSchema,
  settingsSchema,
} from "../schema/configuration.js";

export const appRouter = router({
  settings: {
    query: procedure.query(async ({ ctx: { teamId, siteId, client } }) => {
      if (!teamId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "teamId is required",
        });
      }

      const teamConfig = settingsSchema.safeParse(
        (await client.getTeamConfiguration(teamId))?.config ?? {}
      );
      const siteConfig = settingsSchema.safeParse(
        siteId
          ? (await client.getSiteConfiguration(teamId, siteId))?.config ?? {}
          : {}
      );
      if (!teamConfig.success || !siteConfig.success) {
        console.warn(
          "Failed to parse settings",
          JSON.stringify(teamConfig.error, null, 2),
          JSON.stringify(siteConfig.error, null, 2)
        );
      }

      const defaultConfig = settingsDefaultSchema.safeParse(
        teamConfig.data ?? {}
      );

      return {
        config: (siteId ? siteConfig.data : undefined) ?? teamConfig.data ?? {},
        default: defaultConfig.data!,
      };
    }),

    mutate: procedure
      .input(settingsSchema)
      .mutation(async ({ ctx: { teamId, siteId, client }, input }) => {
        if (!teamId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "teamId is required",
          });
        }

        try {
          const existingConfig = await (siteId
            ? client.getSiteConfiguration(teamId, siteId)
            : client.getTeamConfiguration(teamId));

          if (!existingConfig) {
            await (siteId
              ? client.createSiteConfiguration(teamId, siteId, input)
              : client.createTeamConfiguration(teamId, input));
          } else {
            await (siteId
              ? client.updateSiteConfiguration(teamId, siteId, input)
              : client.updateTeamConfiguration(teamId, input));
          }
        } catch (e) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to save configuration",
            cause: e,
          });
        }
      }),
  },
});

export type AppRouter = typeof appRouter;

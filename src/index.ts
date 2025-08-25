// Documentation: https://sdk.netlify.com/docs
import { NetlifyExtension, NetlifyExtensionClient } from "@netlify/sdk";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
import snakify from "snakify-ts";
import {
  settingsDefaultSchema,
  settingsSchema,
} from "./schema/configuration.js";

const extension = new NetlifyExtension();

const handler: Parameters<
  NetlifyExtension["addBuildEventHandler"]
>[1] = async ({ client, constants }) => {
  const { ACCOUNT_ID: teamId, SITE_ID: siteId } = constants;

  if (!teamId || !siteId) {
    console.error(
      "Could not determine team ID or site ID from build constants."
    );
    return;
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

  const defaultConfig = settingsDefaultSchema.safeParse({
    ...(teamConfig.data ?? {}),
    ...(siteConfig.data ?? {}),
  }).data!;

  if (!defaultConfig.enabled) {
    console.log("GitHub status extension is disabled.");
    return;
  }

  const { DEPLOY_ID: deployId } = process.env;
  if (!deployId) {
    console.error("Could not determine DEPLOY_ID from environment variables.");
    return;
  }

  const body = JSON.stringify(
    snakify(
      await (
        (client as any).client as NetlifyExtensionClient<
          unknown,
          unknown,
          unknown
        >
      ).getDeploy(deployId)
    )
  );

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (defaultConfig.jwt) {
    // Create a signature that matches the verification logic
    const hashedBody = crypto.createHash("sha256").update(body).digest("hex");
    const signature = jwt.sign({ sha256: hashedBody }, defaultConfig.jwt, {
      issuer: "netlify",
      algorithm: "HS256",
    });
    headers["x-webhook-signature"] = signature;
  }

  console.log(`Sending build status to ${defaultConfig.url}`);
  try {
    const response = await fetch(defaultConfig.url, {
      method: "POST",
      headers,
      body,
    });

    console.log(
      `Webhook response: ${response.status} ${response.statusText}`,
      await response.text()
    );
  } catch (error) {
    console.error("Failed to send build status", error);
  }
};

extension.addBuildEventHandler("onPreBuild", handler);
extension.addBuildEventHandler("onBuild", handler);
extension.addBuildEventHandler("onPostBuild", handler);
extension.addBuildEventHandler("onEnd", handler);

export { extension };

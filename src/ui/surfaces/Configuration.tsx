import {
  Card,
  CardLoader,
  CardTitle,
  Form,
  FormField,
  Select,
  TeamConfigurationSurface,
} from "@netlify/sdk/ui/react/components";
import { trpc } from "../trpc";
import { settingsSchema } from "../../schema/configuration";
import z from "zod";

export const Configuration = () => {
  const trpcUtils = trpc.useUtils();
  const settingsQuery = trpc.settings.query.useQuery();
  const settingsMutation = trpc.settings.mutate.useMutation({
    onSuccess: async () => {
      await trpcUtils.settings.query.invalidate();
    },
  });

  if (settingsQuery.isLoading) {
    return <CardLoader />;
  }

  return (
    <TeamConfigurationSurface>
      <Card>
        <CardTitle>GitHub Status Notification Settings</CardTitle>
        <Form
          defaultValues={{
            ...settingsQuery.data?.config,
            enabled:
              settingsQuery.data?.config?.enabled?.toString() ?? "default",
          }}
          schema={settingsSchema.extend({
            enabled: z
              .string()
              .transform((arg) => (arg === "default" ? undefined : arg)),
          })}
          onSubmit={settingsMutation.mutateAsync}
        >
          <FormField
            name="url"
            type="text"
            label="Webhook URL"
            helpText="The endpoint URL that will receive build status updates. See the project documentation for setup instructions: https://github.com/Hanssen0/netlify-github-status"
            placeholder={settingsQuery.data?.default?.url}
          />
          <FormField
            name="jwt"
            type="text"
            label="Webhook Secret (Optional)"
            helpText="An optional secret token (JWT) to secure your webhook. This will be used to sign requests, allowing your endpoint to verify they came from Netlify."
            placeholder={settingsQuery.data?.default?.jwt}
          />
          <Select
            name="enabled"
            options={[
              { label: "Enabled", value: "true" },
              { label: "Disabled", value: "false" },
              {
                label: `Default ${
                  settingsQuery.data?.default?.enabled?.toString() === "true"
                    ? "Enabled"
                    : "Disabled"
                }`,
                value: "default",
              },
            ]}
            label="Status Updates"
            helpText="Enable or disable sending build status notifications for this configuration."
          />
        </Form>
      </Card>
    </TeamConfigurationSurface>
  );
};

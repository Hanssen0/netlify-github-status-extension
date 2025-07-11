# Netlify GitHub Status Extension

[![API](https://img.shields.io/website?url=https%3A%2F%2Fnetlify-github-status.netlify.app%2F.netlify%2Ffunctions%2Fhealth&label=API)](https://netlify-github-status.netlify.app/.netlify/functions/health)
[![GitHub Bot](https://img.shields.io/badge/GitHub-Bot-green)](https://github.com/apps/netlify-github-status)
[![Netlify Extension](https://img.shields.io/badge/Netlify-Extension-blue)](https://app.netlify.com/extensions/n0pwo0qr-netlify-github-status)
[![Netlify Status](https://api.netlify.com/api/v1/badges/3feee280-e0ba-4c23-9f87-dcadb8dd90b8/deploy-status)](https://app.netlify.com/projects/netlify-github-status-extension/deploys)

This Netlify Extension sends build status notifications to a specified webhook URL. This allows you to integrate Netlify's build process with other services, such as a custom dashboard or notification system, to reflect your GitHub deployment statuses.

## Important Note: Production Use

By default, this extension is configured to use a public, shared webhook endpoint provided by the [Netlify GitHub Status Bot](https://github.com/apps/netlify-github-status). This public bot is intended for demonstration and testing purposes only.

**It is strongly recommended that you do not use the default public bot in a production environment.**

For production use, you should fork the repository and deploy your own instance of the status receiver. This ensures that your build notifications are handled by a private and secure endpoint that you control.

## Features

- **Build Status Notifications**: Automatically sends a POST request to your configured webhook URL whenever a Netlify build completes (either successfully or with an error).
- **Secure Webhooks**: Optionally secure your webhook endpoint by providing a JWT secret. The extension will sign outgoing requests, allowing your endpoint to verify their authenticity.
- **Flexible Configuration**: Configure the extension at both the team and site levels. Site-level configurations will override team-level settings, giving you granular control over your projects.

## Configuration

You can configure the extension from the Netlify UI under the "Extensions" section for your team or a specific site.

### Settings

- **Webhook URL**: The endpoint URL that will receive build status updates. The extension will send a POST request to this URL with a JSON payload containing the build status.
- **Webhook Secret (Optional)**: An optional secret token used to sign the webhook request. If provided, the extension will generate a JSON Web Signature (JWS) of the request payload and include it in the `x-webhook-signature` header. This allows your endpoint to verify that the request originated from Netlify and that its payload has not been tampered with, similar to how Netlify's standard deploy notifications are secured.
- **Status Updates**: Enable or disable sending build status notifications for the current configuration (team or site). You can select "Enabled", "Disabled", or "Default" (which will inherit the setting from the higher-level configuration).

For detailed setup instructions and information on the payload structure, please refer to the project's main repository: [https://github.com/Hanssen0/netlify-github-status](https://github.com/Hanssen0/netlify-github-status)

## Development Scripts

These are some common scripts you will use when developing your extension. If you want to know what else is possible, [check out the documentation](https://developers.netlify.com/sdk/netlify-sdk-utility-tools-reference/).

### Build

This builds the extension into a `.ntli` folder. This is the folder that Netlify uses to run the extension.

```bash
npm run build
```

## Publish

Are you ready to deploy and publish your extension? Check out our documentation on [publishing your extension](https://developers.netlify.com/sdk/publish/).

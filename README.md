# Contentstack Kickstart: Astro

Contentstack Kickstarts are the minimum amount of code needed to connect to Contentstack.
This kickstart covers the following items:

- SDK initialization
- Live preview and Visual building setup

> This example uses Astro's default static output and runs Contentstack Live Preview in client-side (CSR) mode. Pages are rendered at build time with published content; inside the Visual Builder the Live Preview SDK re-fetches the entry in the browser and re-renders the page on every edit — no server and no iframe refresh needed.

More details about this codebase can be found on the [Contentstack docs](https://www.contentstack.com/docs/developers).

[![Join us on Discord](https://img.shields.io/badge/Join%20Our%20Discord-7289da.svg?style=flat&logo=discord&logoColor=%23fff)](https://community.contentstack.com)

## How to get started

Before you can run this code, you will need a Contentstack "Stack" to connect to.
Follow the following steps to seed a Stack that this codebase understands.

> If you installed this Kickstart via the Contentstack Markertplace or the new account onboarding, you can skip this step.

### Install the CLI

```bash
npm install -g @contentstack/cli
```

#### Using the CLI for the first time?

It might ask you to set your default region.
You can get all regions and their codes [here](https://www.contentstack.com/docs/developers/cli/configure-regions-in-the-cli) or run `csdx config:get:region`.

> Beware, Free Contentstack developer accounts are bound to the EU region. We still use the CDN the API is lightning fast.

Set your region like so:

```bash
csdx config:set:region EU
```

### Log in via the CLI

```bash
csdx auth:login
```

### Get your organization UID

In your Contentstack Organization dashboard find `Org admin` and copy your Organization ID (Example: `blt481c598b0d8352d9`).

### Create a new stack

Make sure to replace `<YOUR_ORG_ID>` with your actual Organization ID and run the below.

```bash
csdx cm:stacks:seed --repo "contentstack/kickstart-stack-seed" --org "<YOUR_ORG_ID>" -n "Kickstart Stack"
```

## Create a new delivery token.

Go to `Settings > Tokens` and create a delivery token. Select the `preview` scope and turn on `Create preview token`

## Fill out your .env file.

Now that you have a delivery token, you can fill out the .env file in your codebase.

> You can find the API key, Delivery Token and Preview Token in Settings > Tokens > Your token.

```
PUBLIC_CONTENTSTACK_API_KEY=<YOUR_API_KEY>
PUBLIC_CONTENTSTACK_DELIVERY_TOKEN=<YOUR_DELIVERY_TOKEN>
PUBLIC_CONTENTSTACK_PREVIEW_TOKEN=<YOUR_PREVIEW_TOKEN>
PUBLIC_CONTENTSTACK_REGION=EU
PUBLIC_CONTENTSTACK_ENVIRONMENT=preview
PUBLIC_CONTENTSTACK_PREVIEW=true
```

### How live preview updates work

Live preview runs in client-side (CSR) mode: the Live Preview SDK is initialized with `ssr: false`, changes arrive in the browser via postMessage, and the page re-fetches the entry with the Delivery SDK and re-renders client-side — no iframe refresh. See `src/lib/renderPage.ts` for the client-side renderer.

### Timeline support

[Timeline](https://www.contentstack.com/docs/content-managers/timeline/preview-content-across-a-timeline) (previewing your site as it will look at a future date, with scheduled Releases applied) works out of the box:

- Timeline loads the site with `preview_timestamp` and `release_id` query params. The Delivery SDK picks these up automatically and sends them as headers to the Preview API, and `syncPreviewParams` in `src/lib/contentstack.ts` keeps them applied on every client-side re-fetch.
- Timeline's compare view (diff highlighting) relies on the `data-cslp` edit tags, which the client-side renderer preserves.

To use it, enable Timeline for your stack and schedule content with Releases. No code changes needed.

## Turn on Live Preview

Go to Settings > Live Preview. Click enable and select the `Preview` environment in the drop down. Hit save.

## Install the dependencies

```bash
npm install
```

### Run your app

```bash
npm run dev
```

### See your page visually

### In the browser

Go to `http://localhost:4321`.

#### In the CMS

Go to Entries and select the only entry in the list.
In the sidebar, click on the live preview icon.
Or, see your entry in the visual builder

## Regions and endpoint configuration

Set `PUBLIC_CONTENTSTACK_REGION` to the value matching your Contentstack account region:

| Region | Value |
|---|---|
| North America (default) | `NA` or `US` |
| Europe | `EU` |
| Australia | `AU` |
| Azure North America | `AZURE-NA` |
| Azure Europe | `AZURE-EU` |
| GCP North America | `GCP-NA` |
| GCP Europe | `GCP-EU` |

The app uses `getContentstackEndpoint` from `@contentstack/utils` to resolve the correct API hostnames for your region automatically. The following endpoint keys are resolved:

| Key | NA value |
|---|---|
| `contentDelivery` | `cdn.contentstack.io` |
| `preview` | `rest-preview.contentstack.com` |
| `application` | `app.contentstack.com` |
| `graphqlDelivery` | `graphql.contentstack.com` |
| `graphqlPreview` | `graphql-preview.contentstack.com` |
| `images` | `images.contentstack.io` |
| `assets` | `assets.contentstack.io` |
| `contentManagement` | `api.contentstack.io` |
| `auth` | `auth.contentstack.io` |

### Custom or dedicated environments

If you are on a dedicated or private cloud Contentstack instance, you can override the resolved endpoints via environment variables:

```
PUBLIC_CONTENTSTACK_CONTENT_DELIVERY=your-custom-cdn.example.com
PUBLIC_CONTENTSTACK_PREVIEW_HOST=your-custom-preview.example.com
PUBLIC_CONTENTSTACK_CONTENT_APPLICATION=your-custom-app.example.com
```

These override values take precedence over the region-resolved endpoints.

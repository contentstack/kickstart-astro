# Kickstart Astro

## Introduction

Kickstart Astro is a minimal starter that connects Astro applications to Contentstack. The repository uses Astro's default static output: pages are prerendered at build time, and no server or adapter is required. For more background, see [Astro's rendering guide](https://docs.astro.build/en/guides/on-demand-rendering/).

Use this starter to set up an Astro app that connects to Contentstack with these preconfigured features:

*   The [Contentstack Delivery SDK](/docs/developers/sdks) retrieves content at build time and in the browser during preview.
*   [Live Preview](/docs/content-managers/author-content/about-live-preview) runs in client-side (CSR) mode. Content changes arrive in the browser via postMessage, and the page re-renders instantly without an iframe refresh.
*   [Visual Builder](/docs/content-managers/visual-editor/about-visual-editor) supports on-page editing in preview mode.
*   [Timeline](/docs/content-managers/timeline/preview-content-across-a-timeline) lets you preview the site as it will look at a future date, with scheduled Releases applied.

## What You'll Learn

In this guide, you:

*   Provision a stack and sample content by **importing a Starter** when one is available for this project, or by seeding with the Contentstack CLI
*   Optionally deploy the app with [Launch](/docs/launch) and align the environment configuration for local development
*   Use the Contentstack Delivery SDK to fetch content from an Astro project
*   Configure Live Preview and Visual Builder for preview mode and inline editing
*   Configure the app with a .env file and PUBLIC\_CONTENTSTACK\_\* variables. Astro exposes PUBLIC\_\* variables to the client where applicable
*   Connect the local app with [delivery tokens](/docs/developers/create-tokens/about-delivery-tokens) and [preview tokens](/docs/developers/create-tokens/about-delivery-tokens#understanding-preview-tokens) from the stack or from Launch mappings

## Prerequisites

Before you begin, make sure you have the following:

*   **Node.js** is installed from the [Node.js download page](https://nodejs.org/en/download) at a version that satisfies [Astro's installation requirements](https://docs.astro.build/en/install-and-setup/) for your Astro major version
*   A basic understanding of **JavaScript** or **TypeScript**, and familiarity with **Astro** project basics, such as pages and components
*   A [Contentstack account](https://www.contentstack.com/login/)
*   Organization [Owner](/docs/developers/organization/organization-roles#organization-owner)/[Admin](/docs/developers/organization/organization-roles#organization-admin) access to import a Starter, which creates a new [stack](/docs/developers/set-up-stack/about-stack)
*   A [GitHub account](https://github.com/login) if you deploy with Launch or clone a fork

**Note:** Kickstart projects use a shared content model. You can reuse one stack across projects, or create separate stacks for isolated content and configuration.

With these basics in place, choose the setup path that matches your workflow.

## Choose How to Set Up Your Stack

Use one of the following paths to create a stack with the content model and sample entries that Kickstart Astro expects.

### Option 1: Import the Starter and Optionally Deploy with Launch

Use these guides to complete setup:

*   [**Importing a Starter**](/docs/developers/marketplace-platform-guides/installing-a-starter): Import a prebuilt stack and [content model](/docs/developers/marketplace-platform-guides/content-models/about-content-models)
*   Refer to the [Launch Quick Start Guide with Astro](/docs/launch/quick-start-astro) to connect GitHub, deploy the application, configure environment variables, and manage deployments using Contentstack Launch.

**Typical outcomes**

*   A stack with sample content
*   A hosted application
*   A GitHub repository, if you deploy through Launch

If you use Launch, note that variable names often use prefixes such as **CONTENTSTACK\_\***. For local development in this repository, you will later map those values to **PUBLIC\_CONTENTSTACK\_\*** keys in .env.

Once your stack or deployment is ready, continue with the local clone and configuration steps below.

### Option 2: Create and Seed Your Stack with CLI

The Kickstart Astro project expects content from the shared seed repository **contentstack/kickstart-stack-seed**. Seeding that repository with the CLI produces the same outcome as a [Starter import](/docs/developers/marketplace-platform-guides/installing-a-starter) for local and repeatable setups, such as onboarding or CI.

This approach works well for terminal-first workflows or when you do not use the [**Marketplace**](/docs/developers/marketplace-platform-guides/about-marketplace) onboarding path.

**Note:** If you already created a stack from this seed, or from another compatible Kickstart project, you can reuse that stack and skip creating another one.

1.  Install the Contentstack CLI globally:

```
npm install -g @contentstack/cli
```

2.  If you are configuring the CLI for the first time, set your region:

```
csdx config:set:region EU
```

**Note:** Free developer stacks typically use the **EU** region. Refer to the [About Regions](/docs/developers/contentstack-regions/about-regions) document to know more about Contentstack regions.

3.  Sign in, and provide your Contentstack account details when prompted:

```
csdx auth:login
```

4.  Perform the following steps to get your Organization UID:
    1.  Go to Contentstack CMS and Select **Administration** from the "App Switcher".
    2.  Copy the **Organization UID** to use with the seed command.
5.  Create a stack and seed it from the repository. Replace <ORG\_ID> with your organization UID:

```
csdx cm:stacks:seed --repo "contentstack/kickstart-stack-seed" --org "<ORG_ID>" -n "Kickstart Stack"
```

After the process completes, the CLI creates a stack, imports the Kickstart content models, and adds sample entries.

**Additional Resources:**

*   You can run an interactive bootstrap flow with csdx cm:bootstrap.
*   Watch the [Seed a stack in the CLI](https://youtu.be/2dQheUo7uH4) video for a walkthrough of the stack seeding process.

Once the seed completes, continue with the local clone and configuration steps below.

## Clone the Project and Install Dependencies

For local development, clone the repository you plan to run:

*   If you used Launch, clone the repository linked to your deployment from Launch or GitHub
*   If you did not use Launch, clone the official repository:

```
git clone https://github.com/contentstack/kickstart-astro.git
cd kickstart-astro
```

In the cloned project folder, run:

```
npm install
```

This command installs dependencies to run and build the app locally.

With the local project ready, gather the stack credentials you need for .env.

## Get Delivery and Preview Tokens

Gather these values before you update .env. Use the stack you created through the **Starter** or **CLI** path earlier. Create a new stack manually only if you are not using those paths. For manual setup, see [Create a new stack](/docs/developers/set-up-stack/create-a-new-stack).

1.  Log in to Contentstack and open your stack.
2.  Go to **Settings** > **Tokens**, and create a new [Delivery Token](/docs/developers/create-tokens/create-a-delivery-token).
3.  Ensure the Preview Token is enabled (it is enabled by default).
4.  To configure preview, go to **Settings** > **Environment** and set the application URL based on where the app runs:
    *   **Local development:** http://localhost:4321/, which is Astro's default dev server port
    *   **Hosted (Launch or other):** Use your deployment's **public HTTPS origin** and path if the app is not served from /. Mismatched origins break Live Preview and Visual Builder, even when delivery content loads.

**Additional Resource:** Refer to the [Create a Delivery Token](/docs/developers/create-tokens/create-a-delivery-token) document for detailed steps.

Once you have these values, add them to the local environment file.

## Configure .env for Kickstart Astro

After you have a stack, the required tokens, and a local clone, connect the app to Contentstack.

1.  Rename .env.example to .env in the project root, or create .env with the same variables.
2.  Add your Contentstack credentials:

    ```
    PUBLIC_CONTENTSTACK_API_KEY=<STACK_API_KEY>
    PUBLIC_CONTENTSTACK_DELIVERY_TOKEN=<DELIVERY_TOKEN>
    PUBLIC_CONTENTSTACK_PREVIEW_TOKEN=<PREVIEW_TOKEN>
    PUBLIC_CONTENTSTACK_ENVIRONMENT=preview
    PUBLIC_CONTENTSTACK_REGION=EU
    PUBLIC_CONTENTSTACK_PREVIEW=true
    ```

**Note:** When you set PUBLIC\_CONTENTSTACK\_PREVIEW=true, the app enables client-side Live Preview, Visual Builder edit tags, and Timeline support.

### Credential details

*   **API key:** Get this from your [stack](/docs/developers/set-up-stack/view-stack-details), such as **Settings** > **API Keys**
*   **Delivery token / Preview token:** Get these from the token you created with preview enabled, or from the equivalent Launch values after you map them to PUBLIC\_CONTENTSTACK\_\* keys
*   **Environment:** Use the [publishing environment](/docs/developers/set-up-environments/about-environments) that the app should read, such as preview or development
*   **Region:** Use the stack [region](/docs/developers/contentstack-regions/about-regions), such as EU, NA, or AZURE-NA, as your account supports it
*   **Preview:** Set this to true to enable Live Preview integration in the app

**Note:** Free Contentstack developer accounts are commonly bound to the **EU** region. The CDN routes API requests for responsiveness, but you still need to set PUBLIC\_CONTENTSTACK\_REGION to match your stack.

### How the configuration works

This project uses **Astro with Vite**. Variables prefixed with **PUBLIC\_** are available as **import.meta.env.PUBLIC\_\*** in server and client code, as described in [Astro environment variables](https://docs.astro.build/en/guides/environment-variables/). No separate script generates TypeScript environment files from .env. The app reads configuration at development time and build time from .env, and it can read the same names from the process environment in CI.

Because the site is built statically, all PUBLIC\_\* values — including the delivery and preview tokens — are embedded in the client bundle. Both tokens are read-only by design.

### Optional configuration overrides

You can override the default API hosts with these optional variables. The code supports them even if .env.example does not include them:

*   PUBLIC\_CONTENTSTACK\_CONTENT\_DELIVERY
*   PUBLIC\_CONTENTSTACK\_PREVIEW\_HOST
*   PUBLIC\_CONTENTSTACK\_CONTENT\_APPLICATION

If you omit these variables, the getContentstackEndpoint helper from [@contentstack/utils](https://www.npmjs.com/package/@contentstack/utils) resolves hosts from PUBLIC\_CONTENTSTACK\_REGION.

**Warning:** Do not commit .env to version control. It should remain listed in .gitignore.

With local configuration in place, enable Live Preview in the stack so the CMS and app use matching settings.

## Enable Live Preview in the Stack

1.  In your stack, go to **Settings** and navigate to **Environments**. Select an existing environment or create a new one, and add a **Base URL** for each locale.
2.  Navigate to **Visual Experience** from the **Settings** menu and select the **Enable Live Preview** checkbox.
3.  Select the **Default Preview Environment** that matches your app. For example, if PUBLIC\_CONTENTSTACK\_ENVIRONMENT=preview, select **Preview**.
4.  Click **Save**.

**Additional Resource:** For detailed setup instructions, refer to [Set Up Live Preview for Your Stack](/docs/developers/set-up-live-preview/set-up-live-preview-for-your-stack).

## Verify Your Setup

Run the app, and confirm that it loads content from your stack.

### Start the development server

1.  From the project root, run:

    ```
    npm run dev
    ```

2.  Open http://localhost:4321/ in your browser.

You should see the homepage with:

*   A title, description, and image from your stack
*   Example modular blocks, such as image and copy blocks

### Test Live Preview

**Prerequisites to Test Live Preview**

*   Live Preview is enabled in the stack
*   PUBLIC\_CONTENTSTACK\_PREVIEW=true is set in .env

**Steps**

1.  [Edit an entry](/docs/content-managers/author-content/edit-an-entry) in Contentstack, such as the homepage.
2.  Observe updates in the browser. The page updates in place, without a full refresh:
    1.  initLivePreview() in [src/lib/contentstack.ts](https://github.com/contentstack/kickstart-astro/blob/main/src/lib/contentstack.ts) initializes the Live Preview Utils SDK with ssr: false (client-side mode).
    2.  When you edit content, the SDK receives the change via postMessage and fires the onEntryChange() callback registered in [src/pages/index.astro](https://github.com/contentstack/kickstart-astro/blob/main/src/pages/index.astro).
    3.  The callback re-fetches the entry with the Delivery SDK in the browser and re-renders the page with the shared markup function in [src/lib/renderPage.ts](https://github.com/contentstack/kickstart-astro/blob/main/src/lib/renderPage.ts).

**Tip:** Open the entry in the CMS, and then use the Live Preview entry point or Visual Builder so the app runs within the CMS for click-to-edit workflows.

### Test Timeline

[Timeline](/docs/content-managers/timeline/preview-content-across-a-timeline) works out of the box when Live Preview is set up:

*   Timeline loads the site with preview\_timestamp and release\_id query parameters. The Delivery SDK picks these up automatically and sends them as headers to the Preview API, so entries are fetched as they will look at the selected date and time.
*   Timeline's compare view (diff highlighting) relies on the data-cslp edit tags, which the client-side renderer preserves.

To use it, enable Timeline for your stack and schedule content with [Releases](/docs/content-managers/publish-content/create-a-release). No code changes are needed.

## Understand the Codebase

The sections below show where the main integration points live after setup is working.

### Project structure

After you install dependencies, the repository follows this structure:

```
kickstart-astro/
├── src/
│   ├── layouts/
│   │   └── Layout.astro
│   ├── lib/
│   │   ├── contentstack.ts
│   │   ├── renderPage.ts
│   │   └── types.ts
│   ├── pages/
│   │   └── index.astro
│   └── styles/
│       └── global.css
├── public/
│   └── favicon.svg
├── .env.example
├── astro.config.mjs
├── package.json
├── package-lock.json
├── tsconfig.json
├── LICENSE
├── README.md
├── SECURITY.md
├── .github/          # CI and repository metadata
├── .vscode/          # Optional editor recommendations
└── .talismanrc       # Security scanning config
```

### Build and configuration

*   **Astro config:** [astro.config.mjs](https://github.com/contentstack/kickstart-astro/blob/main/astro.config.mjs)
    *   Uses Astro's default static output — no adapter and no server required
    *   Configures Tailwind CSS via the Vite plugin
*   **Local scripts:**
    *   **npm run dev** / **npm start**: Start the local dev server (astro dev)
    *   **npm run build**: Run type checks, then build the static site (astro check && astro build)
    *   **npm run preview**: Serve the local production build (astro preview)
*   **Build output:** npm run build
    *   Writes the static site to **dist/** (plain HTML, CSS, and JS)
    *   Deployable to any static host, including [Launch](/docs/launch)
*   **Package name:** [package.json](https://github.com/contentstack/kickstart-astro/blob/main/package.json)
    *   Defines the npm package name **kickstart-astro**
    *   Declares the npm scripts and dependencies the starter uses

**Note:** Because pages are prerendered, published content is baked in at build time. In production, trigger a rebuild when content is published — for example, with a Contentstack [webhook](/docs/developers/set-up-webhooks/about-webhooks) that calls your host's build hook. Preview is unaffected: inside Live Preview, Visual Builder, and Timeline, the browser always fetches draft content live.

### Key source files

*   **Contentstack integration:** [src/lib/contentstack.ts](https://github.com/contentstack/kickstart-astro/blob/main/src/lib/contentstack.ts)
    *   Initializes the Delivery SDK stack client with region and optional custom hosts
    *   Configures **live\_preview** when PUBLIC\_CONTENTSTACK\_PREVIEW is true
    *   Exports **initLivePreview()**, which initializes the Live Preview Utils SDK in client-side mode (ssr: false)
    *   Exports **onEntryChange()**, which runs a callback whenever the entry changes in the builder — and once on load, so the statically built page is replaced with draft content inside the preview
    *   Exports **getPage()** to load a **page** entry. Before each fetch, **syncPreviewParams()** re-applies the freshest live preview hash and forwards Timeline parameters (preview\_timestamp, release\_id) from the iframe URL
    *   Adds editable tags in preview mode for the Visual Builder
*   **Shared page markup:** [src/lib/renderPage.ts](https://github.com/contentstack/kickstart-astro/blob/main/src/lib/renderPage.ts)
    *   **pageHtml()** is the single source of truth for the page markup, including data-cslp edit tags
    *   Used at build time by index.astro (via set:html) and in the browser by **renderPage()** to re-render during live preview and Timeline
*   **Home page:** [src/pages/index.astro](https://github.com/contentstack/kickstart-astro/blob/main/src/pages/index.astro)
    *   Fetches the **page** entry at build time and renders it with **pageHtml()**
    *   Registers the **onEntryChange()** callback that re-fetches and re-renders client-side in preview mode
*   **Type definitions:** [src/lib/types.ts](https://github.com/contentstack/kickstart-astro/blob/main/src/lib/types.ts)
    *   Defines the **Page** shape used by the app
    *   Describes the nested block types used when the page renders modular content
*   **Layout shell:** [src/layouts/Layout.astro](https://github.com/contentstack/kickstart-astro/blob/main/src/layouts/Layout.astro)
    *   Provides the shared page wrapper for routes
*   **Global styles:** [src/styles/global.css](https://github.com/contentstack/kickstart-astro/blob/main/src/styles/global.css)
    *   Defines shared styles used across the app

## Troubleshooting Common Issues

Use these checks if the homepage is empty, the SDK cannot authenticate, or Live Preview does not update as expected.

## Critical Setup Checks

*   **Wrong Contentstack region**
    *   Free developer accounts are often bound to the **EU**. If PUBLIC\_CONTENTSTACK\_REGION does not match the stack, API calls can fail, and content can appear empty.
    *   Use **EU** in .env and run csdx config:set:region EU when you work with EU-bound stacks.
*   **Stack not seeded**

    The application expects the **page** content type and sample entries from the **Kickstart stack seed** or an equivalent Starter. If the model or entries are missing, the home page may appear empty or fail to resolve /.

*   **.env** **is missing or using the wrong prefix**

    The project reads **PUBLIC\_CONTENTSTACK\_\*** variables. If .env is missing, or if the keys do not use the correct Astro prefix, import.meta.env values are empty, and the SDK cannot authenticate.

*   **Wrong Live Preview or Preview Token base URL**

    Local Astro uses http://localhost:4321/ by default. Hosted apps must use the real deployment URL. If you use the wrong origin, Live Preview and Visual Builder break even when delivery works.

*   **Live Preview is not enabled in the stack**

    Enable Live Preview under **Settings**, and select the environment that matches PUBLIC\_CONTENTSTACK\_ENVIRONMENT.

*   **Stale content on the live site**

    The static build bakes in content at build time. If published changes do not appear in production, rebuild and redeploy the site — ideally automatically via a publish webhook.

## Additional Checks

*   **Committing** **.env**

    **Warning:** The file contains secrets. Keep it out of git and rely on .gitignore.

*   **Wrong or swapped delivery and preview tokens**

    Use the correct tokens from the stack, or map the correct values from Launch.

*   **Incorrect publishing environment name**

    PUBLIC\_CONTENTSTACK\_ENVIRONMENT must match an environment that exists in your stack.

*   **Skipping** **npm install**

    Install dependencies after you clone the repository so scripts and types resolve correctly.

*   **Querying unpublished or mismatched environment content**

    The app reads from the environment named in .env. Content that is unpublished or published to a different environment does not appear.

*   **Changing the** **page** **content type or** **URL** **contract without updating the code**

    getPage() queries the **page** content type and matches **the URL** to the path (e.g., /). If you rename fields or content types in the stack, update the query, the types, and the markup in renderPage.ts accordingly.

## Next Steps

*   Learn more about [Live Preview](/docs/content-managers/author-content/about-live-preview), [Visual Builder](/docs/content-managers/visual-editor/about-visual-editor), and [Timeline](/docs/content-managers/timeline/preview-content-across-a-timeline) for your workflow
*   Extend routing by adding Astro pages and reusing **getPage()**, or by adding more queries for URLs that exist in your stack
*   Set up a [publish webhook](/docs/developers/set-up-webhooks/about-webhooks) that triggers a production rebuild, so the static site stays in sync with published content
*   Review [Astro's rendering options](https://docs.astro.build/en/guides/on-demand-rendering/) if you later need server-rendered routes

For questions or issues, join the [Contentstack Community on Discord](https://community.contentstack.com/).

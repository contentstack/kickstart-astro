import contentstack, { QueryOperation, type LivePreviewQuery } from '@contentstack/delivery-sdk';
import ContentstackLivePreview, { type IStackSdk } from '@contentstack/live-preview-utils';
import type { Page } from './types';
import { getContentstackEndpoint, type ContentstackEndpoints } from "@contentstack/utils";

const endpoints = getContentstackEndpoint(import.meta.env.PUBLIC_CONTENTSTACK_REGION || 'NA', '', true) as ContentstackEndpoints

export const isPreviewEnabled = import.meta.env.PUBLIC_CONTENTSTACK_PREVIEW === 'true';

export const stack = contentstack.stack({
  apiKey: import.meta.env.PUBLIC_CONTENTSTACK_API_KEY as string,
  deliveryToken: import.meta.env.PUBLIC_CONTENTSTACK_DELIVERY_TOKEN as string,
  environment: import.meta.env.PUBLIC_CONTENTSTACK_ENVIRONMENT as string,

  // Certain API endpoints can be set via environment variables for custom or dedicated Contentstack environments.
  // You can omit these in your project. Use @contentstack/utils getContentstackEndpoint to get the right urls for your region.
  region: import.meta.env.PUBLIC_CONTENTSTACK_REGION as any,
  host: import.meta.env.PUBLIC_CONTENTSTACK_CONTENT_DELIVERY || endpoints.contentDelivery as string,

  live_preview: {
    enable: import.meta.env.PUBLIC_CONTENTSTACK_PREVIEW === 'true',
    preview_token: import.meta.env.PUBLIC_CONTENTSTACK_PREVIEW_TOKEN,
    host: import.meta.env.PUBLIC_CONTENTSTACK_PREVIEW_HOST || endpoints.preview as string
  }
});

export function initLivePreview() {
  // Live preview runs in client-side (CSR) mode: updates arrive via
  // postMessage and the page re-renders in the browser without an iframe
  // refresh. See onEntryChange below and src/lib/renderPage.ts.
  ContentstackLivePreview.init({
    ssr: false,
    enable: isPreviewEnabled,
    mode: "builder",
    stackSdk: stack.config as IStackSdk,
    stackDetails: {
      apiKey: import.meta.env.PUBLIC_CONTENTSTACK_API_KEY as string,
      environment: import.meta.env.PUBLIC_CONTENTSTACK_ENVIRONMENT as string,
    },
    clientUrlParams: {
      host: import.meta.env.PUBLIC_CONTENTSTACK_CONTENT_APPLICATION || endpoints.application as string
    },
    editButton: {
      enable: true,
      exclude: ["outsideLivePreviewPortal"]
    }
  });
}

// Runs the callback whenever the entry changes in the builder, so the page
// can re-fetch and re-render in the browser. Also runs once on load, so the
// statically built page is replaced with draft content inside the builder.
export function onEntryChange(callback: () => void) {
  ContentstackLivePreview.onEntryChange(callback);
}

// Keeps client-side fetches in sync with the preview session. Re-applies the
// freshest live preview hash (updated via postMessage by the Live Preview
// SDK) and forwards Timeline params (preview_timestamp, release_id) from the
// iframe URL, so entries are fetched as they will look at the selected time.
function syncPreviewParams() {
  if (!isPreviewEnabled || typeof window === 'undefined') {
    return;
  }

  const urlParams = Object.fromEntries(new URLSearchParams(window.location.search));
  const livePreview = stack.config.live_preview as Record<string, string> | undefined;
  const hash = livePreview?.live_preview || livePreview?.hash || urlParams.live_preview;

  if (hash || urlParams.preview_timestamp || urlParams.release_id) {
    stack.livePreviewQuery({
      ...urlParams,
      live_preview: hash,
      content_type_uid: livePreview?.content_type_uid || urlParams.content_type_uid,
      entry_uid: livePreview?.entry_uid || urlParams.entry_uid,
    } as unknown as LivePreviewQuery);
  }
}

export async function getPage(url: string) {
  syncPreviewParams();

  const result = await stack
    .contentType("page")
    .entry()
    .query()
    .where("url", QueryOperation.EQUALS, url)
    .find<Page>();

  if (result.entries) {
    const entry = result.entries[0]

    if (isPreviewEnabled) {
      contentstack.Utils.addEditableTags(entry as any, 'page', true);
    }

    return entry;
  }
}
import contentstack, { QueryOperation, type LivePreviewQuery } from '@contentstack/delivery-sdk';
import ContentstackLivePreview, { type IStackSdk } from '@contentstack/live-preview-utils';
import type { Page } from './types';
import { getContentstackEndpoint, type ContentstackEndpoints } from "@contentstack/utils";

const endpoints = getContentstackEndpoint(import.meta.env.PUBLIC_CONTENTSTACK_REGION || 'us', '', true) as ContentstackEndpoints

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
  ContentstackLivePreview.init({
    ssr: true,
    enable: import.meta.env.PUBLIC_CONTENTSTACK_PREVIEW === 'true',
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

type Props = { url: string, searchParams?: LivePreviewQuery }

export async function getPage({ url, searchParams }: Props) {
  if (searchParams && searchParams.live_preview) {
    stack.livePreviewQuery(searchParams)
  }

  const result = await stack
    .contentType("page")
    .entry()
    .query()
    .where("url", QueryOperation.EQUALS, url)
    .find<Page>();

  if (result.entries) {
    const entry = result.entries[0]

    if (import.meta.env.PUBLIC_CONTENTSTACK_PREVIEW === 'true') {
      contentstack.Utils.addEditableTags(entry as any, 'page', true);
    }

    return entry;
  }
}
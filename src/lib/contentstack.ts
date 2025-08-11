import contentstack, { QueryOperation, Region, type LivePreviewQuery } from '@contentstack/delivery-sdk';
import ContentstackLivePreview, { type IStackSdk } from '@contentstack/live-preview-utils';
import type { Page } from './types';
import { getContentstackEndpoints, getRegionForString } from "@timbenniks/contentstack-endpoints";

const region = getRegionForString(import.meta.env.PUBLIC_CONTENTSTACK_REGION as string);
const endpoints = getContentstackEndpoints(region, true)

export const stack = contentstack.stack({
  apiKey: import.meta.env.PUBLIC_CONTENTSTACK_API_KEY as string,
  deliveryToken: import.meta.env.PUBLIC_CONTENTSTACK_DELIVERY_TOKEN as string,
  environment: import.meta.env.PUBLIC_CONTENTSTACK_ENVIRONMENT as string,

  // Setting the region
  // if the region doesnt exist, fall back to a custom region given by the env vars
  // for internal testing purposes at Contentstack we look for a custom region in the env vars, you do not have to do this.
  region: region ? region : import.meta.env.PUBLIC_CONTENTSTACK_REGION as any,

  // Setting the host for content delivery based on the region or environment variables
  // This is done for internal testing purposes at Contentstack, you can omit this if you have set a region above.
  host: import.meta.env.PUBLIC_CONTENTSTACK_CONTENT_DELIVERY || endpoints && endpoints.contentDelivery,

  live_preview: {
    enable: import.meta.env.PUBLIC_CONTENTSTACK_PREVIEW === 'true',
    preview_token: import.meta.env.PUBLIC_CONTENTSTACK_PREVIEW_TOKEN,

    // Setting the host for live preview based on the region
    // for internal testing purposes at Contentstack we look for a custom host in the env vars, you do not have to do this.
    host: import.meta.env.PUBLIC_CONTENTSTACK_PREVIEW_HOST || endpoints && endpoints.preview
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
      // Setting the client URL parameters for live preview
      // for internal testing purposes at Contentstack we look for a custom host in the env vars, you do not have to do this.
      host: import.meta.env.PUBLIC_CONTENTSTACK_CONTENT_APPLICATION || endpoints && endpoints.application
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
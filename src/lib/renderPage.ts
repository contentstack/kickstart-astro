import { VB_EmptyBlockParentClass } from "@contentstack/live-preview-utils";
import type { Block, Page } from "./types";

// Single source of truth for the page markup. Used at build time by
// src/pages/index.astro (via set:html) and in the browser by renderPage to
// re-render during live preview and Timeline.

function cslp($: any, field: string): string {
  const path = $?.[field]?.["data-cslp"];
  return path ? ` data-cslp="${path}"` : "";
}

function blockHtml(item: { block: Block }, index: number, page: Page): string {
  const { block } = item;
  const isImageLeft = block.layout === "image_left";

  return `
    <div${cslp(page.$, `blocks__${index}`)}
      class="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 bg-white ${
        isImageLeft ? "md:flex-row" : "md:flex-row-reverse"
      }">
      <div class="w-full md:w-1/2 p-4">
        ${
          block.image
            ? `<img src="${escapeAttr(block.image.url)}" alt="${escapeAttr(block.image.title)}" width="200" height="112" class="w-full"${cslp(block.$, "image")} />`
            : ""
        }
      </div>
      <div class="w-full md:w-1/2 p-4">
        ${
          block.title
            ? `<h2 class="text-2xl font-bold"${cslp(block.$, "title")}>${escapeHtml(block.title)}</h2>`
            : ""
        }
        ${
          block.copy
            ? `<div class="prose"${cslp(block.$, "copy")}>${block.copy}</div>`
            : ""
        }
      </div>
    </div>`;
}

export function pageHtml(page?: Page): string {
  if (!page) {
    return "";
  }

  const blocks = page.blocks ?? [];

  return `
    ${
      page.title
        ? `<h1 class="text-4xl font-bold mb-4 text-center"${cslp(page.$, "title")}>${page.title}</h1>`
        : ""
    }
    ${
      page.description
        ? `<p class="mb-4 text-center"${cslp(page.$, "description")}>${page.description}</p>`
        : ""
    }
    ${
      page.image
        ? `<img class="mb-4" width="768" height="414" src="${page.image.url}" alt="${page.image.title}"${cslp(page.image.$, "url")} />`
        : ""
    }
    ${
      page.rich_text
        ? `<div${cslp(page.$, "rich_text")}>${page.rich_text}</div>`
        : ""
    }
    <div class="space-y-8 max-w-full mt-4 ${blocks.length === 0 ? VB_EmptyBlockParentClass : ""}"${cslp(page.$, "blocks")}>
      ${blocks.map((item, index) => blockHtml(item, index, page)).join("")}
    </div>`;
}

export function renderPage(page: Page) {
  const section = document.querySelector("main section");

  if (section) {
    section.innerHTML = pageHtml(page);
  }
}

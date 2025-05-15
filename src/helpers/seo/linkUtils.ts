import { baseurl } from '../consts/mainSiteConst';
import type { APIRequestContext } from '@playwright/test';

export function extractInternalLinks(html: string, baseUrl: string): string[] {
    const matches = [...html.matchAll(/<a[^>]+href=["'](.*?)["']/gi)];
    const hrefs = matches.map((match) => match[1]);

    const internalLinks = new Set<string>();

    for (const href of hrefs) {
        if (decodeURIComponent(href).includes('${') ||
            href.includes('[http') || // Markdown-style embed
            href.includes('](') ||    // another Markdown sign
            href.includes('[') ||
            href.includes(']')||
            href.includes('@')) {
            continue;
        }
        if (
            href.startsWith('#') ||
            href.startsWith('mailto:') ||
            href.startsWith('tel:') ||
            (!href.startsWith('/') && /^[\w.-]+\.[a-z]{2,}/i.test(href))
        ) {
            continue;
        }

        try {
            const resolvedUrl = new URL(href, baseUrl);
            const base = new URL(baseUrl);

            if (resolvedUrl.origin === base.origin) {
                internalLinks.add(resolvedUrl.pathname + resolvedUrl.search);
            }
        } catch {
            // Ignore invalid URLs
        }
    }

    return Array.from(internalLinks);
}


export async function checkInternalLink(href: string, request: APIRequestContext): Promise<{
    url: string;
    status: number;
}> {
    const fullUrl = new URL(href, baseurl).toString();
    const res = await request.head(fullUrl);
    return { url: fullUrl, status: res.status() };
}

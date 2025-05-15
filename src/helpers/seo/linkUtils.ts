import { baseurl } from '../consts/mainSiteConst';
import type { APIRequestContext } from '@playwright/test';

export function extractInternalLinks(html: string, baseUrl: string): string[] {
    const matches = [...html.matchAll(/<a[^>]+href=["'](.*?)["']/gi)];
    const hrefs = matches.map((match) => match[1]);

    const internalLinks = new Set<string>();

    for (const href of hrefs) {
        if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
            continue; // Skip anchors and special protocols
        }

        try {
            const resolvedUrl = new URL(href, baseUrl);
            const base = new URL(baseUrl);

            if (resolvedUrl.origin === base.origin) {
                internalLinks.add(resolvedUrl.pathname + resolvedUrl.search); // normalize
            }
        } catch {
            // Ignore invalid URLs
        }
    }

    return Array.from(internalLinks);
}

// check query selector ^
// посмотреть кейс с обсолютными путями ебаными

export async function checkInternalLink(href: string, request: APIRequestContext): Promise<{
    url: string;
    status: number;
}> {
    const fullUrl = new URL(href, baseurl).toString();
    const res = await request.head(fullUrl);
    return { url: fullUrl, status: res.status() };
}

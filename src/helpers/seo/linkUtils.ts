import { baseurl } from '../consts/mainSiteConst';
import type { APIRequestContext } from '@playwright/test';

import * as cheerio from 'cheerio';

export function extractInternalLinks(html: string, baseUrl: string): string[] {
    const $ = cheerio.load(html);
    const base = new URL(baseUrl);
    const internalLinks = new Set<string>();

    const ignorePrefixes = ['sdk/', 'docs/', 'api/'];

    $('a[href]').each((_, el) => {
        const href = $(el).attr('href');
        if (!href) return;

        let decoded: string;
        try {
            decoded = decodeURIComponent(href);
        } catch {
            return;
        }

        if (
            decoded.includes('${') ||
            decoded.includes('[http') ||
            decoded.includes('](') ||
            decoded.includes('[') ||
            decoded.includes(']') ||
            decoded.includes('@') ||
            decoded.startsWith('(') ||
            decoded.endsWith(')') ||
            href.startsWith('mailto:') ||
            href.startsWith('tel:') ||
            href.startsWith('javascript:') ||
            href.startsWith('data:') ||
            ignorePrefixes.some((prefix) => href.startsWith(prefix)) ||
            (!href.startsWith('/') && /^[\w.-]+\.[a-z]{2,}/i.test(href))
        ) {
            return;
        }

        try {
            const resolvedUrl = new URL(href, baseUrl);

            // Пропускаем другие поддомены (например, app.netlify.com)
            if (resolvedUrl.hostname !== base.hostname) return;

            internalLinks.add(resolvedUrl.pathname + resolvedUrl.search);
        } catch {
            // Ignore invalid URLs
        }
    });

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

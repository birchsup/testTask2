import { test, expect, APIRequestContext } from '@playwright/test';
import { baseurl } from '../../helpers/consts/mainSiteConst';
import {
    getHeadStatus,
    getSitemapUrls,
    runRequestsInBatches,
} from '../../helpers/seo/sitemapUtils';
import { checkInternalLink, extractInternalLinks } from '../../helpers/seo/linkUtils';
import {allowedNoindexPaths, hasNoindexMeta, isNoindexAllowed} from "../../helpers/seo/const/allowedNoindexPaths";

let sitemapUrls: string[] = [];

test.beforeAll(async ({ request }) => {
    const sitemapUrl = `${baseurl}/sitemap.xml`;
    sitemapUrls = await getSitemapUrls(request, sitemapUrl);
});
test('Sitemap.xml should exist and be valid', async ({ request }) => {
    const response = await request.get(`${baseurl}/sitemap.xml`);
    expect(response.status()).toBe(200);

    const body = await response.text();
    expect(body).toContain('<urlset');
});

test('Check all sitemap urls with HEAD', async ({ request }) => {
    const results = await runRequestsInBatches(sitemapUrls, 10, getHeadStatus(request));

    const failed = results
        .map((r, i) => ({ result: r, url: sitemapUrls[i] }))
        .filter(({ result }) => result.status === 'rejected');

    failed.forEach(({ url, result }) => {
        console.warn(` ${url} failed:`, result.status === 'rejected' ? result.reason : '');
    });

    expect(failed.length).toBe(0);
});

test('Check internal links for all sitemap pages', async ({ request }) => {
    for (const pageUrl of sitemapUrls) {
        const res = await request.get(pageUrl);
        expect.soft(res.status(), `Page ${pageUrl} is unreachable`).toBeLessThan(404);

        const html = await res.text();
        const internalLinks = extractInternalLinks(html, baseurl);

        const results = await runRequestsInBatches(
            internalLinks,
            10,
            async (href) => {
                try {
                    const { url: fullUrl, status } = await checkInternalLink(href, request);
                    return { href, fullUrl, status };
                } catch (err) {
                    return { href, fullUrl: href, status: 500, error: err };
                }
            }
        );

        const badLinks: string[] = [];

        for (const result of results) {
            if (result.status === 'fulfilled') {
                const { fullUrl, status } = result.value;
                if (status >= 404) {
                    badLinks.push(`${fullUrl} [${status}]`);
                    expect.soft(status, `⚠️ Broken internal link: ${fullUrl}`).toBeLessThan(404);
                }
            } else {
                badLinks.push(`UNKNOWN ERROR: ${result.reason}`);
            }
        }

        expect(
            badLinks.length,
            `${badLinks.length} broken internal links found on page ${pageUrl}:\n${badLinks.join('\n')}`
        ).toBe(0);
    }
});


test.only('Check <meta name="robots"> tag for sitemap urls', async ({ request }) => {
    const results = await runRequestsInBatches(
        sitemapUrls,
        10,
        async (url) => {
            const res = await request.get(url);
            if (!res.ok()) throw new Error(`HTTP ${res.status()} for ${url}`);
            const html = await res.text();
            return { url, html, status: res.status() };
        }
    );

    for (const result of results) {
        if (result.status === 'fulfilled') {
            const { url, html, status } = result.value;

            expect(status, `Page ${url} is unreachable`).toBeLessThan(404);

            const hasNoindex = hasNoindexMeta(html);
            const isAllowed = isNoindexAllowed(url, allowedNoindexPaths);

            if (!isAllowed) {
                expect(hasNoindex, `Unexpected <meta name="robots" content="noindex"> on ${url}`).toBe(false);
            }
        } else {
            throw new Error(`Request to ${result.reason.url || 'unknown'} failed: ${result.reason}`);
        }
    }
});

import { test, expect } from '@playwright/test';
import urlsJson from '../../../src/assets/seo/sitemap-urls.json';
import {allowedNoindexPaths, hasNoindexMeta, isNoindexAllowed} from "../../helpers/seo/const/allowedNoindexPaths";
import {baseurl} from "../../helpers/consts/mainSiteConst";
import {checkInternalLink, extractInternalLinks} from "../../helpers/seo/linkUtils";
const urls = urlsJson as string[];


(test as any).describe.configure({ mode: 'parallel' });
test('Sitemap.xml should exist and be valid', async ({ request }) => {
    const response = await request.get(`${baseurl}/sitemap.xml`);
    expect(response.status()).toBe(200);

    const body = await response.text();
    expect(body).toContain('<urlset');
});

urls.forEach((url: string) => {
    /*
  This block tests SEO-related conditions for each URL listed in sitemap.xml.

  I used a JSON file to store all sitemap URLs, which allows running each
  URL check as a separate test. This improves parallelization and speeds up
  test execution in CI environments.

  The tests include:
  - Verifying that each URL from the sitemap is accessible (status < 400).
  - Ensuring that pages do not contain <meta name="robots" content="noindex">
    unless explicitly allowed (based on the allowedNoindexPaths list).
*/
    //Check that URLs listed in the sitemap are accessible
    test(`SEO check: ${url}`, async ({ request }) => {
        const res = await request.head(url);
        expect(res.status(), `Broken link: ${url}`).toBeLessThan(400);
    });
    /*
      SEO checks for URLs from sitemap.xml.

      The list of URLs is loaded from a pre-generated JSON file. This approach
      allows treating each URL as a separate test case, which enables parallel
      execution and makes test results easier to debug.

      For each URL, we:
      1. Check that it returns a valid response (HEAD request with status < 400).
      2. Validate that it does not include a <meta name="robots" content="noindex"> tag,
         unless it's part of the allowed exceptions.
    */
    //Ensure that pages don't have robots noindex meta tags unless specifically intended
    test.only(`Check <meta name="robots"> tag for ${url}`, async ({ request }) => {
        const res = await request.get(url);
        expect(res.status()).toBeLessThan(404);

        const html = await res.text();

        const hasNoindex = hasNoindexMeta(html);
        const isAllowed = isNoindexAllowed(url, allowedNoindexPaths);

        if (!isAllowed) {
            expect(hasNoindex, `Unexpected noindex on ${url}`).toBe(false);
        }
    });
    test(`Internal links on: ${url}`, async ({ request }) => {
        const res = await request.get(url);
        expect(res.status(), `Page itself is unreachable: ${url}`).toBeLessThan(400);

        const html = await res.text();
        const internalLinks = extractInternalLinks(html, baseurl);

        const badLinks: string[] = [];

        for (const href of internalLinks) {
            const { url: fullUrl, status } = await checkInternalLink(href, request);
            if (status >= 404) {
                badLinks.push(`${fullUrl} [${status}]`);
                expect.soft(status, `⚠️ Broken internal link: ${fullUrl}`).toBeLessThan(404);
            }
        }

        expect(
            badLinks.length,
            `${badLinks.length} broken internal links found on page ${url}:\n${badLinks.join('\n')}`
        ).toBe(0);
    });
});

/*
  Verify that important pages are crawlable.

  It's currently unclear which pages are considered "important".
  For the purposes of this test, I assume that all URLs listed
  in sitemap.xml are important and must be crawlable.

  So it's already covered in the second group of tests
*/

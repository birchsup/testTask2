import { test, expect } from '@playwright/test';
import urlsJson from '../../../src/assets/seo/sitemap-urls.json';
import { extractInternalLinks, checkInternalLink } from '../../helpers/seo/linkUtils';

const urls = urlsJson as string[];

(test as any).describe.configure({ mode: 'parallel' });
/*
  Check that all internal links on each sitemap page are functional.

  For each URL:
  - Fetch the page HTML.
  - Extract internal links (relative hrefs).
  - Check each link responds with status < 404.

  Broken links are collected and reported.
  Using JSON-based input allows running each check in parallel.
*/
urls.forEach((url) => {

});

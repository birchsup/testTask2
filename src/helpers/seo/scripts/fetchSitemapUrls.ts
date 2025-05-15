import 'dotenv/config';
import { request } from '@playwright/test';
import { getSitemapUrls } from '../sitemapUtils';
import { baseurl } from '../../consts/mainSiteConst';
import * as fs from 'fs';
import * as path from 'path';

// Script to fetch sitemap.xml and save all URLs into a JSON file
(async () => {
    const context = await request.newContext();
    const sitemapUrl = `${baseurl}/sitemap.xml`;

    const urls = await getSitemapUrls(context, sitemapUrl);
    await context.dispose();

    const outputDir = 'src/assets/seo';
    const outputPath = path.join(outputDir, 'sitemap-urls.json');

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Remove old file if it exists
    if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
    }

    // Write new file
    fs.writeFileSync(outputPath, JSON.stringify(urls, null, 2));
    console.log(`Saved ${urls.length} URLs to ${outputPath}`);
})();

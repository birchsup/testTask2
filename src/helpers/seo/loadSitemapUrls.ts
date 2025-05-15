import { request } from '@playwright/test';
import { getSitemapUrls } from './sitemapUtils';
import { baseurl } from '../consts/mainSiteConst';

const SITEMAP_URL = `${baseurl}/sitemap.xml`;

export async function loadSitemapUrls(): Promise<string[]> {
    const context = await request.newContext();
    const urls = await getSitemapUrls(context, SITEMAP_URL);
    await context.dispose();
    return urls;
}

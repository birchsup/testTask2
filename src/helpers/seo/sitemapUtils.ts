export async function getSitemapUrls(request: any, sitemapUrl: string): Promise<string[]> {
    const response = await request.get(sitemapUrl);
    if (response.status() !== 200) {
        throw new Error(`Failed to fetch sitemap: ${sitemapUrl}`);
    }

    const xml = await response.text();
    const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
    return urls;
}

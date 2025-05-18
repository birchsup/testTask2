import {APIRequestContext} from "@playwright/test";

export async function getSitemapUrls(request: any, sitemapUrl: string): Promise<string[]> {
    const response = await request.get(sitemapUrl);
    if (response.status() !== 200) {
        throw new Error(`Failed to fetch sitemap: ${sitemapUrl}`);
    }

    const xml = await response.text();
    const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
    return urls;
}


export async function sendHeadRequests(context: APIRequestContext, urls: string[]) {
    return await Promise.allSettled(
        urls.map(url =>
            context.head(url).then(res => {
                if (!res.ok()) throw new Error(`HTTP ${res.status()} for ${url}`);
                return res.status();
            })
        )
    );
}


export async function runRequestsInBatches<T>(
    urls: string[],
    batchSize: number,
    handler: (url: string) => Promise<T>
): Promise<PromiseSettledResult<T>[]> {
    const results: PromiseSettledResult<T>[] = [];

    for (let i = 0; i < urls.length; i += batchSize) {
        const batch = urls.slice(i, i + batchSize);
        const settled = await Promise.allSettled(batch.map(handler));
        results.push(...settled);
    }

    return results;
}

export const getHtmlAndStatus = (context: APIRequestContext) => async (url: string) => {
    const res = await context.get(url);
    if (!res.ok()) throw new Error(`HTTP ${res.status()} for ${url}`);
    const html = await res.text();
    return { html, status: res.status(), url };
};

export const getHeadStatus = (context: APIRequestContext) => async (url: string) => {
    const res = await context.head(url);
    if (!res.ok()) throw new Error(`HTTP ${res.status()} for ${url}`);
    return { status: res.status(), url };
};

export const allowedNoindexPaths = ['/admin']

export function hasNoindexMeta(html: string): boolean {
    return /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html);
}

export function isNoindexAllowed(url: string, allowedPaths: string[]): boolean {
    return allowedPaths.some((path) => url.includes(path));
}

import { NextResponse } from 'next/server';

export const runtime = 'edge';

const cache = new Map<string, { url: string; expires: number }>();

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    const now = Date.now();

    // 1. memory cache (warm instances only)
    const cached = cache.get(slug);
    if (cached && cached.expires > now) {
        return NextResponse.redirect(cached.url, 301);
    }

    // 2. fetch from Supabase
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/links?slug=eq.${slug}&select=url,id`,
        {
            headers: {
                apikey: process.env.NEXT_PUBLIC_SUPABASE_PUB_KEY!,
            },
        }
    );

    const data = await res.json();

    const url = data?.[0]?.url;

    if (!url) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // 3. cache it (for warm instances only)
    cache.set(slug, {
        url,
        expires: now + 60 * 60 * 1000,
    });

    // 4. redirect
    return NextResponse.redirect(url, 301);
}
import { NextRequest, NextResponse, NextFetchEvent } from 'next/server';

// In-memory cache
const cache = new Map<string, { id: string | number, realUrl: string; expires: number }>();
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

export const config = {
  matcher: '/r/:slug*',
};

// event access by NextProxy type 
export const proxy = async (request: NextRequest, event: NextFetchEvent) => {
  const slug = request.nextUrl.pathname.split('/r/')[1];
  if (!slug) return NextResponse.next();


  const { id, realUrl } = await getUrl(slug);

  if (!realUrl) return NextResponse.rewrite(new URL('/not-found', request.url));

  // Analytics on background, dont block redirect
  event.waitUntil(logAnalytics(id, request));

  return NextResponse.redirect(realUrl, 301);
};

async function getUrl(slug: string) {
  // Cache check
  const cached = cache.get(slug);
  if (cached && cached.expires > Date.now()) {
    return { id: cached.id, realUrl: cached.realUrl };
  }

  // Cache miss → Supabase query
  const { id, realUrl } = await fetchFromSupabase(slug);

  if (realUrl) {
    cache.set(slug, { id, realUrl, expires: Date.now() + CACHE_TTL });
  }

  return { id, realUrl };
}

async function fetchFromSupabase(slug: string) {

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/links?slug=eq.${slug}&select=url,id`,
    {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_PUB_KEY!,
        // Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_PUB_KEY}`,
      },
      // next: { revalidate: 86400 }, // dont need on proxy
    }
  );
  const data = await res.json();

  return {
    id: data[0]?.id || null,
    realUrl: data[0]?.url || null
  };
}

async function logAnalytics(linkId: string | number, request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const userAgent = request.headers.get('user-agent');
  const country = request.headers.get('x-vercel-ip-country') || 'unknown';
  const city = request.headers.get('x-vercel-ip-city') || 'unknown';

  let userLocation = ''

  if (country === "unknown" && city === "unknown") {
    userLocation = "unknown"
  } else if (country === "unknown" && city !== "unknown") {
    userLocation = `${country}`
  } else if (country !== "unknown" && city === "unknown") {
    userLocation = `${city}`
  } else {
    userLocation = `${city}, ${country}`
  }

  await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/logs`, {
    method: 'POST',
    headers: {
      apikey: process.env.NEXT_PUBLIC_SUPABASE_PUB_KEY!,
      // Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_PUB_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      link_id: linkId,
      ip,
      user_agent: userAgent,
      location: userLocation
    }),
  });
}
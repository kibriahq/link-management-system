import { NextResponse } from 'next/server';

export const runtime = 'edge';

function buildLocation(country: string, city: string): string {
  const hasCountry = country !== 'unknown';
  const hasCity = city !== 'unknown';
  if (hasCountry && hasCity) return `${city}, ${country}`;
  if (hasCountry) return country;
  if (hasCity) return city;
  return 'unknown';
}

function logAnalytics(linkId: string | number, request: Request): void {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  const userAgent = request.headers.get('user-agent');
  const country = request.headers.get('x-vercel-ip-country') ?? 'unknown';
  const city = request.headers.get('x-vercel-ip-city') ?? 'unknown';

  fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/logs`, {
    method: 'POST',
    headers: {
      apikey: process.env.NEXT_PUBLIC_SUPABASE_PUB_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      link_id: linkId,
      ip,
      user_agent: userAgent,
      location: buildLocation(country, city),
    }),
  }).catch(console.error);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/links?slug=eq.${slug}&select=url,id`,
    {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_PUB_KEY!,
      },
      // Next.js fetch cache - this is the correct caching layer for edge
      next: {
        revalidate: 3600,
        tags: [`link-${slug}`], // allows on-demand revalidation via revalidateTag()
      },
    }
  );

  if (!res.ok) {
    return NextResponse.json({ error: 'Upstream error' }, { status: 502 });
  }

  const data = await res.json();
  const { url, id } = data?.[0] ?? {};

  if (!url || !id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  logAnalytics(id, request);

  return NextResponse.redirect(url, 301);
}
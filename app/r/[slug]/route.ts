import { createClient } from "@/lib/supabase-server";
import { after, NextResponse } from "next/server";

export const runtime = "edge";

function buildLocation(country: string, city: string): string {
  const hasCountry = country !== "unknown";
  const hasCity = city !== "unknown";
  if (hasCountry && hasCity) return `${city}, ${country}`;
  if (hasCountry) return country;
  if (hasCity) return city;
  return "unknown";
}

async function logAnalytics(
  linkId: string | number,
  request: Request,
): Promise<void> {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const userAgent = request.headers.get("user-agent");
  const country = request.headers.get("x-vercel-ip-country") ?? "unknown";
  const city = request.headers.get("x-vercel-ip-city") ?? "unknown";

  try {
    const supabase = await createClient();

    await supabase.from("logs").insert({
      link_id: linkId,
      ip,
      user_agent: userAgent,
      location: buildLocation(
        decodeURIComponent(country),
        decodeURIComponent(city),
      ),
    });
  } catch (error) {
    console.error("Error logging analytics:", error);
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
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
        revalidate: 3600, // refresh cache every hour
        tags: [`link-${slug}`], // allows on-demand revalidation via revalidateTag()
      },
    },
  );

  if (!res.ok) {
    return NextResponse.json({ error: "Upstream error" }, { status: 502 });
  }

  const data = await res.json();
  const { url, id } = data?.[0] ?? {};

  if (!url || !id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  after(() => logAnalytics(id, request));

  return NextResponse.redirect(url, 307);
}
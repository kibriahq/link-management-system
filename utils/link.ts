import { revalidateTag } from "next/cache";

export async function clearCache(slug: string) {
  revalidateTag(`link-${slug}`, {
    expire: 0, // immediately expire the cache
  });
}
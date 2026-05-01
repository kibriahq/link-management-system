import type { NextApiRequest, NextApiResponse } from "next";
import { revalidateTag } from "next/cache";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { slug } = req.body;

    if (!slug) {
        return res.status(400).json({ error: "Missing slug" });
    }

    try {
        revalidateTag(`link-${slug}`, "default");

        return res.status(200).json({ revalidated: true });
    } catch (err) {
        return res.status(500).json({ error: "Failed to revalidate" });
    }
}
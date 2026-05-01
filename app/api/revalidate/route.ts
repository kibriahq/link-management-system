import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { slug } = await req.json();
        // console.log(req.body);
        
        console.log("called", slug);

        if (!slug) {
            return NextResponse.json({ error: "Missing slug" }, { status: 400 });
        }

        // revalidateTag can be awaited in case it's async
        await revalidateTag(`link-${slug}`, "default");

        return NextResponse.json({ revalidated: true }, { status: 200 });
    } catch (err) {
        console.error("Failed to revalidate:", err);
        return NextResponse.json({ error: "Failed to revalidate" }, { status: 500 });
    }
}
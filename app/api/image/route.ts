import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return new Response("Missing image URL", { status: 400 });
  }

  const imageRes = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      Referer: "https://csmfactory.x.yupoo.com/",
    },
  });

  if (!imageRes.ok) {
    return new Response("Image failed to load", { status: imageRes.status });
  }

  const contentType = imageRes.headers.get("content-type") || "image/jpeg";
  const buffer = await imageRes.arrayBuffer();

  return new Response(buffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");
  const strategy = searchParams.get("strategy") || "mobile";

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  const apiKey = process.env.PAGESPEED_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  try {
    const apiUrl = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
    apiUrl.searchParams.append("url", url);
    apiUrl.searchParams.append("key", apiKey);
    apiUrl.searchParams.append("strategy", strategy);
    apiUrl.searchParams.append("category", "PERFORMANCE");
    apiUrl.searchParams.append("category", "ACCESSIBILITY");
    apiUrl.searchParams.append("category", "BEST_PRACTICES");
    apiUrl.searchParams.append("category", "SEO");

    const response = await fetch(apiUrl.toString());
    
    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    
    // 返回原始数据供调试
    return NextResponse.json(data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

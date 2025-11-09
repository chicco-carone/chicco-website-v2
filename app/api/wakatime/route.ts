import { NextResponse } from "next/server";

type Range =
  | "last_7_days"
  | "last_30_days"
  | "last_6_months"
  | "last_year";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const range = (searchParams.get("range") as Range) || "last_7_days";

  const username = process.env.WAKATIME_USERNAME;
  const apiKey = process.env.WAKATIME_API_KEY;

  if (!username || !apiKey) {
    return NextResponse.json(
      { error: "Missing Wakatime configuration" },
      { status: 500 }
    );
  }

  try {
    // Fetch from Wakatime official API
    const url = `https://wakatime.com/api/v1/users/${username}/stats/${range}?api_key=${apiKey}`;
    const response = await fetch(url, {
      next: { revalidate: 60 * 30 }, // Server-side cache for 30 minutes
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Wakatime API error: ${response.status}`);
    }

    const result = await response.json();

    // Return only the data we need for the frontend
    const apiData = result?.data;
    if (!apiData) {
      throw new Error("Invalid API response");
    }

    // Transform and limit to top 5 languages
    const languages = (apiData.languages || [])
      .map((l: any) => ({
        name: String(l.name || "Unknown"),
        percent: Number(l.percent || 0),
        text: String(l.text || l.name || "Unknown"),
        total: String(l.text || l.digital || `${l.percent}%`),
      }))
      .sort((a: any, b: any) => b.percent - a.percent)
      .slice(0, 5);

    const total_time = apiData.human_readable_total_including_other_language ||
                      apiData.human_readable_total ||
                      "Total coding time";

    const apiResponse = NextResponse.json({
      languages,
      total_time,
      range,
    });

    // Enable browser caching for better UX (cache for 30 minutes)
    apiResponse.headers.set("Cache-Control", "public, s-maxage=1800, stale-while-revalidate=300");

    return apiResponse;
  } catch (err) {
    console.error("Wakatime API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch Wakatime data" },
      { status: 500 }
    );
  }
}

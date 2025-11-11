import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { z } from "zod";

type Range =
  | "last_7_days"
  | "last_30_days"
  | "last_year";

export const dynamic = "force-dynamic";

const WakapiLanguageSchema = z.object({
  name: z.string(),
  percent: z.number(),
  text: z.string(),
  total_seconds: z.number(),
  digital: z.string(),
  hours: z.number(),
  minutes: z.number(),
  seconds: z.number(),
});

const WakapiDataSchema = z.object({
  languages: z.array(WakapiLanguageSchema),
  human_readable_total: z.string(),
  human_readable_total_including_other_language: z.string().optional(),
});

const WakapiResponseSchema = z.object({
  data: WakapiDataSchema,
});

// TypeScript types inferred from Zod schemas
type WakapiLanguage = z.infer<typeof WakapiLanguageSchema>;

// Cached function to fetch Wakapi data
const fetchWakapiData = unstable_cache(
  async (username: string, range: Range) => {
    const wakapiUrl = `https://wakapi.chiccolab.me/api/v1/users/${username}/stats/${range}`;
    const response = await fetch(wakapiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Website/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error(`Wakapi API error: ${response.status}`);
    }

    const result = await response.json();

    // Validate the response with Zod
    const validatedResponse = WakapiResponseSchema.parse(result);
    return validatedResponse.data;
  },
  ['wakapi-data'],
  {
    revalidate: 1800, // Revalidate every 30 minutes
    tags: ['wakapi']
  }
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const range = (searchParams.get("range") as Range) || "last_7_days";
  const username = "Chicco";

  try {
    // Use cached Wakapi data
    const apiData = await fetchWakapiData(username, range);

    // Transform and limit to top 5 languages
    const languages = apiData.languages
      .map((l: WakapiLanguage) => ({
        name: l.name,
        percent: l.percent,
        text: l.name,
        total: l.text,
      }))
      .sort((a, b) => b.percent - a.percent)
      .slice(0, 5);

    const total_time = apiData.human_readable_total ||
                      apiData.human_readable_total_including_other_language ||
                      "Total coding time";

    const apiResponse = NextResponse.json({
      languages,
      total_time,
      range,
    });

    // Cache for 30 minutes
    apiResponse.headers.set("Cache-Control", "public, s-maxage=1800, stale-while-revalidate=300");

    return apiResponse;
  } catch (err) {
    console.error("Wakapi API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch Wakapi data" },
      { status: 500 }
    );
  }
}

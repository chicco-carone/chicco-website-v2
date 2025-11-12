import { unstable_cache } from "next/cache";
import { WakaTimeStatsClient } from "./wakatime-stats-client";
import { fetchWakapiData } from "@/app/api/wakatime-public/route";

interface WakaTimeLanguage {
  name: string;
  percent: number;
  text: string;
  total: string;
}

interface WakaTimeData {
  languages: WakaTimeLanguage[];
  total_time: string;
}

type Range = "last_7_days" | "last_30_days" | "last_year";

const fetchWakaTimeData = unstable_cache(
  async (range: Range): Promise<WakaTimeData | null> => {
    try {
      const apiData = await fetchWakapiData("Chicco", range);

      const languages = apiData.languages
        .map((l) => ({
          name: l.name,
          percent: l.percent,
          text: l.name,
          total: l.text,
        }))
        .sort(
          (a: WakaTimeLanguage, b: WakaTimeLanguage) => b.percent - a.percent
        )
        .slice(0, 5);

      const total_time =
        apiData.human_readable_total ||
        apiData.human_readable_total_including_other_language ||
        "Total coding time";

      return {
        languages,
        total_time,
      };
    } catch (err) {
      console.error("Error fetching WakaTime data:", err);
      return null;
    }
  },
  ["wakatime-stats-server"],
  {
    revalidate: 1800,
  }
);

export async function WakaTimeStats() {
  const initialData = await fetchWakaTimeData("last_7_days");

  return <WakaTimeStatsClient initialData={initialData} />;
}

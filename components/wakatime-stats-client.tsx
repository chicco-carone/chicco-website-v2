"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Code, TrendingUp, Clock, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

const RANGE_OPTIONS = [
  { value: "last_7_days", label: "Last 7 days" },
  { value: "last_30_days", label: "Last 30 days" },
  { value: "last_year", label: "Last year" },
] as const;

interface WakaTimeStatsClientProps {
  initialData: WakaTimeData | null;
}

export function WakaTimeStatsClient({ initialData }: WakaTimeStatsClientProps) {
  const [data, setData] = useState<WakaTimeData | null>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState<Range>("last_7_days");

  useEffect(() => {
    const fetchWakaTimeData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/wakatime-public?range=${range}`, {
          method: "GET",
          headers: { Accept: "application/json" },
          cache: "default",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.languages && Array.isArray(result.languages)) {
          setData({
            languages: result.languages,
            total_time: result.total_time || "Total coding time",
          });
        }
      } catch (err) {
        console.error("Error fetching WakaTime data:", err);
        setError("Failed to load WakaTime data");
      } finally {
        setLoading(false);
      }
    };

    fetchWakaTimeData();
  }, [range]);

  if (loading && !data) {
    return (
      <Card className="p-6 bg-black/20 border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-blue-500/20">
            <Code className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Coding Activity</h3>
            <p className="text-sm text-gray-400">WakaTime Stats</p>
          </div>
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-gray-700 animate-pulse" />
                <div className="h-4 w-20 bg-gray-800 rounded animate-pulse" />
              </div>
              <div className="h-4 w-12 bg-gray-800 rounded animate-pulse" />
            </motion.div>
          ))}
        </div>
      </Card>
    );
  }

  if (error && !data) {
    return (
      <Card className="p-6 bg-black/20 border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-red-500/20">
            <Code className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Coding Activity</h3>
            <p className="text-sm text-gray-400">{error}</p>
          </div>
        </div>
      </Card>
    );
  }

  const getLanguageColor = (name: string) => {
    const colors: Record<string, string> = {
      Typescript: "bg-blue-500",
      Python: "bg-yellow-500",
      Shell: "bg-green-500",
      Javascript: "bg-yellow-400",
      Html: "bg-orange-500",
      CSS: "bg-blue-400",
      Java: "bg-red-500",
      C: "bg-gray-500",
      "C++": "bg-blue-600",
      Markdown: "bg-purple-500",
      "Jupiter notebook": "bg-orange-500",
    };
    return colors[name] || "bg-gray-500";
  };

  const currentRangeLabel = RANGE_OPTIONS.find(option => option.value === range)?.label || "Last 7 days";

  return (
    <Card className="p-6 bg-black/20 border-white/10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/20">
            <Code className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Coding Activity</h3>
            <p className="text-sm text-gray-400">WakaTime Stats • {currentRangeLabel}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <Select value={range} onValueChange={(value: Range) => setRange(value)}>
            <SelectTrigger className="w-[140px] bg-black/20 border-white/10 text-white">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-white/10">
              {RANGE_OPTIONS.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="text-white hover:bg-white/10 focus:bg-white/10"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {data?.languages.map((lang, index) => (
          <motion.div
            key={lang.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${getLanguageColor(lang.name)}`}
                />
                <span className="text-white font-medium">{lang.name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock className="h-3 w-3" />
                <span>{lang.total}</span>
                <span className="text-white font-semibold">
                  {lang.percent}%
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${lang.percent}%` }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.8, ease: "easeOut" }}
                className={`h-2 rounded-full ${getLanguageColor(lang.name)}`}
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <TrendingUp className="h-4 w-4" />
            <span>Total coding time</span>
          </div>
          <span className="text-white font-medium">{data?.total_time}</span>
        </div>
      </div>
    </Card>
  );
}

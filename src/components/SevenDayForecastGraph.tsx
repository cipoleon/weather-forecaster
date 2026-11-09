import { Box } from "@mui/material";
import {
  axisClasses,
  legendClasses,
  LineChart,
  type LineChartProps,
} from "@mui/x-charts";
import type { ForecastDay } from "../types/forecast.types";
import { getForecastDayLabel } from "../weather";

const xAxis: LineChartProps["xAxis"] = [{ dataKey: "day", scaleType: "point" }];
const series: LineChartProps["series"] = [
  {
    dataKey: "max",
    label: "7 nap előre jelzése",
    curve: "natural",
    color: "#ffffff",
  },
];

type SevenDayForecastGraphProps = {
  forecast: readonly ForecastDay[];
};

export default function SevenDayForecastGraph({
  forecast,
}: SevenDayForecastGraphProps) {
  const dataset = forecast.map((day) => ({
    max: Math.round(day.max),
    day: getForecastDayLabel(day.time),
  }));

  return (
    <Box sx={{ mt: 8, mb: 12 }}>
      <LineChart
        margin={{ left: 40, right: 60, top: 60 }}
        sx={{
          border: "2px solid white",
          borderRadius: "25px",
          [`& .${legendClasses.root}`]: {
            color: "#ffffff",
          },
          [`& line.${axisClasses.line}, & line.${axisClasses.tick}`]: {
            stroke: "rgba(255,255,255,0.5)",
          },
          [`& text.${axisClasses.tickLabel}`]: {
            fill: "rgba(255,255,255,0.85)",
          },
        }}
        dataset={dataset}
        xAxis={xAxis}
        series={series}
        height={300}
      />
    </Box>
  );
}

import { Box, useMediaQuery } from "@mui/material";
import type { Theme } from "@mui/material/styles";
import {
  axisClasses,
  legendClasses,
  LineChart,
  type LineChartProps,
} from "@mui/x-charts";
import type { ForecastDay } from "../types/forecast.types";
import { getForecastDayLabel } from "../weather";

function formatTemperature(value: number | null) {
  return value === null ? null : `${value} °C`;
}

const series: LineChartProps["series"] = [
  {
    id: "daily-max",
    dataKey: "max",
    label: "7 nap előre jelzése",
    curve: "monotoneX",
    color: "#ffffff",
    showMark: true,
    shape: "circle",
    valueFormatter: formatTemperature,
  },
];

const yAxis: LineChartProps["yAxis"] = [
  {
    tickMinStep: 1,
    domainLimit: (minValue, maxValue) => {
      const min = Number(minValue);
      const max = Number(maxValue);
      const padding = Math.max(1, Math.ceil((max - min) * 0.1));
      return { min: min - padding, max: max + padding };
    },
  },
];

type SevenDayForecastGraphProps = {
  forecast: readonly ForecastDay[];
};

export default function SevenDayForecastGraph({
  forecast,
}: SevenDayForecastGraphProps) {
  const compact = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

  if (forecast.length === 0) return null;

  const dataset = forecast.map((day) => ({
    date: day.time,
    max: Math.round(day.max),
  }));

  return (
    <Box sx={{ mt: 8, mb: 12 }}>
      <LineChart
        title="A következő hét nap csúcshőmérséklete"
        desc="Napi maximum Celsius-fokban."
        margin={
          compact
            ? { left: 4, right: 15, top: 14, bottom: 8 }
            : { left: 40, right: 60, top: 60 }
        }
        sx={{
          border: "2px solid white",
          borderRadius: "25px",
          [`& .${legendClasses.root}`]: {
            color: "#ffffff",
          },
          [`& line.${axisClasses.line}, & line.${axisClasses.tick}`]: {
            stroke: "rgba(255, 255, 255, 0.5)",
          },
          [`& text.${axisClasses.tickLabel}`]: {
            fill: "rgba(255, 255, 255, 0.85)",
          },
        }}
        dataset={dataset}
        xAxis={[
          {
            dataKey: "date",
            scaleType: "point",
            valueFormatter: (date: string, { location }) => {
              const format = compact && location === "tick" ? "short" : "long";
              return getForecastDayLabel(date, format) ?? date;
            },
          },
        ]}
        yAxis={yAxis}
        series={series}
        height={300}
      />
    </Box>
  );
}

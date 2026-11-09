import { Box } from "@mui/material";
import { days, type WeatherData } from "../types/forecast.types";
import { LineChart } from "@mui/x-charts";

const style = {
  mt: 8,
  mb: 12,
};

type SevenDayForecastProps = {
  forecast: WeatherData;
};

export default function SevenDayForecastGraph({
  forecast,
}: SevenDayForecastProps) {
  const forecastConverted = forecast.forecast.map((cast) => {
    return {
      max: Math.round(cast.max),
      day: days[new Date(cast.time).getDay()],
    };
  });
  return (
    <>
      <Box sx={style}>
        <LineChart
          margin={{
            left: 40,
            right: 60,
            top: 60,
          }}
          sx={{
            border: "2px solid white",
            borderRadius: "25px",
            "& .MuiChartsLegend-root": {
              color: "#ffffff",
            },
            "& line.MuiChartsAxis-line": {
              stroke: "rgba(255,255,255,0.5)",
            },
            "& line.MuiChartsAxis-tick": {
              stroke: "rgba(255,255,255,0.5)",
            },
            "& text.MuiChartsAxis-tickLabel": {
              fill: "rgba(255,255,255,0.85)",
            },
          }}
          dataset={forecastConverted}
          xAxis={[{ dataKey: "day", scaleType: "point" }]}
          series={[
            {
              dataKey: "max",
              label: "7 nap előre jelzése",
              curve: "natural",
              color: "#ffffff",
            },
          ]}
          height={300}
        />
      </Box>
    </>
  );
}

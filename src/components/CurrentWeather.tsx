import { Box, Typography } from "@mui/material";
import type { CurrentConditions } from "../types/forecast.types";
import { conditions } from "../weather";

type CurrentWeatherProps = {
  cityName?: string;
  current: CurrentConditions;
  onChooseCity: () => void;
};

export default function CurrentWeather({
  cityName,
  current,
  onChooseCity,
}: CurrentWeatherProps) {
  return (
    <Box sx={{ ml: { xs: 0, md: 4 } }}>
      <Typography
        id="current-city"
        variant="caption"
        component="h2"
        onClick={onChooseCity}
      >
        {cityName ?? ""}
      </Typography>
      <Typography
        id="current-temperature"
        sx={{ mt: 1 }}
        variant="h3"
        component="p"
      >
        {Math.round(current.temperature)}
      </Typography>
      <Typography id="current-weather" sx={{ mt: 1 }}>
        {conditions[current.weatherCode || 0]?.label ?? ""}
      </Typography>
    </Box>
  );
}

import { Box, Typography } from "@mui/material";
import type { CityItem } from "../types/city.types";
import { conditions, type WeatherData } from "../types/forecast.types";

const style = {
  ml: { xs: 0, md: 4 },
  "& #current-temperature, & #current-weather": {
    mt: 1,
  },
};

type CurrentWeatherProps = {
  city: CityItem | undefined;
  forecast: WeatherData;
  setOpen: (open: boolean) => void;
};

export default function CurrentWeather({
  city,
  forecast,
  setOpen,
}: CurrentWeatherProps) {
  return (
    <>
      <Box sx={style}>
        <Typography
          id="current-city"
          variant="caption"
          component="h2"
          onClick={() => setOpen(true)}
        >
          {city?.name ? city.name : ""}
        </Typography>
        <Typography id="current-temperature" variant="h3" component="p">
          {Math.round(forecast.current.temperature)}
        </Typography>
        <Typography id="current-weather">
          {conditions[forecast.current.weatherCode || 0]?.label || ""}
        </Typography>
      </Box>
    </>
  );
}

import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";
import type { ForecastDay } from "../types/forecast.types";
import { conditions, getForecastDayLabel } from "../weather";
import { WeatherIcon } from "./WeatherIcon";

const forecastCellSx = { textAlign: "center" };

type SevenDayForecastProps = {
  forecast: readonly ForecastDay[];
};

export default function SevenDayForecast({ forecast }: SevenDayForecastProps) {
  return (
    <Box>
      <Typography
        sx={{ width: { xs: "40%", md: "34%" }, textAlign: "center" }}
        variant="caption"
        component="h2"
      >
        7 napos előrejelzés
      </Typography>
      {forecast.length > 0 && (
        <List id="forecast-list">
          {forecast.map((day) => (
            <ListItem disablePadding key={day.time}>
              <ListItemText
                sx={forecastCellSx}
                primary={getForecastDayLabel(day.time)}
              />
              <ListItemText<"div">
                sx={forecastCellSx}
                slotProps={{ primary: { component: "div" } }}
              >
                <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                  <WeatherIcon
                    kind={conditions[day.weatherCode]?.icon ?? "unknown"}
                  />
                  <Typography
                    sx={{ lineHeight: "40px" }}
                    variant="caption"
                    component="h2"
                  >
                    {`${day.rainProbability}%`}
                  </Typography>
                </Box>
              </ListItemText>
              <ListItemText
                sx={forecastCellSx}
                primary={`${Math.round(day.min)} °C / ${Math.round(day.max)}°C`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}

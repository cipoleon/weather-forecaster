import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";
import { conditions, days, type WeatherData } from "../types/forecast.types";
import { WeatherIcon } from "./WeatherIcon";

const style = {};

type SevenDayForecastProps = {
  forecast: WeatherData;
};

export default function SevenDayForecast({ forecast }: SevenDayForecastProps) {
  return (
    <>
      <Box sx={style}>
        <Typography
          sx={{ width: { xs: "40%", md: "34%" }, textAlign: "center" }}
          variant="caption"
          component="h2"
        >
          7 napos előrejelzés
        </Typography>
        {!!forecast.forecast.length && (
          <List id="forecast-list">
            {forecast.forecast.map((forecast, index) => {
              return (
                <ListItem disablePadding key={index}>
                  <ListItemText
                    sx={{ textAlign: "center" }}
                    primary={days[new Date(forecast.time).getDay()]}
                  />
                  <ListItemText
                    id="forecast-rain-item"
                    sx={{ textAlign: "center" }}
                    primary={
                      <>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 1,
                          }}
                        >
                          <WeatherIcon
                            kind={
                              conditions[forecast.weatherCode]?.icon ||
                              "unknown"
                            }
                          />
                          <Typography
                            sx={{ lineHeight: "40px" }}
                            id="current-city"
                            variant="caption"
                            component="h2"
                          >
                            {forecast.rainProbability + "%"}
                          </Typography>
                        </Box>
                      </>
                    }
                  />
                  <ListItemText
                    sx={{ textAlign: "center" }}
                    primary={
                      Math.round(forecast.min) +
                      " °C / " +
                      Math.round(forecast.max) +
                      "°C"
                    }
                  />
                </ListItem>
              );
            })}
          </List>
        )}
      </Box>
    </>
  );
}

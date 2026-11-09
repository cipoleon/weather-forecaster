import { useEffect, useState } from "react";
import "./App.css";
import CityModal from "./components/CityModal";
import CurrentWeather from "./components/CurrentWeather";
import type { CityItem } from "./types/city.types";
import SevenDayForecast from "./components/SevenDayForecast";
import SevenDayForecastGraph from "./components/SevenDayForecastGraph";
import ApplicantName from "./components/ApplicantName";
import { Box, Typography } from "@mui/material";
import { getWeather } from "./api/forecastApi";
import type { WeatherData } from "./types/forecast.types";

function App() {
  const [error, setError] = useState("");
  const [open, setOpen] = useState(!localStorage.getItem("city"));
  const [forecast, setForecast] = useState<WeatherData>({
    current: { temperature: 0, weatherCode: -1 },
    forecast: [],
  });
  const [city, setCity] = useState<CityItem | undefined>(() => {
    const localCity = localStorage.getItem("city");
    return localCity ? JSON.parse(localCity) : undefined;
  });

  useEffect(() => {
    async function getData() {
      if (!city) return;
      await getWeather(city.latitude, city.longitude)
        .then((weather) => {
          setError("");
          setForecast(weather);
        })
        .catch(() => {
          setError("Nem sikerült betölteni az időjárási adatokat.");
        });
    }

    getData();
  }, [city]);
  return (
    <>
      <Box
        sx={{
          width: { xs: "80%", md: "100%" },
          transform: { xs: "translateX(10%)", md: "translateX(0)" },
          position: "relative",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
        }}
      >
        <Box sx={{ minWidth: "200px" }}>
          <CurrentWeather forecast={forecast} city={city} setOpen={setOpen} />
          {!error && <ApplicantName />}
        </Box>

        {!error && (
          <Box sx={{ flex: "auto", minWidth: 0 }}>
            <SevenDayForecast forecast={forecast} />
            <SevenDayForecastGraph forecast={forecast} />
          </Box>
        )}
      </Box>
      {!!error && (
        <Typography variant="h4" component="h2">
          {error}
        </Typography>
      )}
      <CityModal open={open} city={city} setOpen={setOpen} setCity={setCity} />
    </>
  );
}

export default App;

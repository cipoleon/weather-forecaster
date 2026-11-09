import { Box, Typography } from "@mui/material";
import { keepPreviousData, skipToken, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getWeather } from "./api/forecastApi";
import ApplicantName from "./components/ApplicantName";
import CityModal from "./components/CityModal";
import CurrentWeather from "./components/CurrentWeather";
import SevenDayForecast from "./components/SevenDayForecast";
import SevenDayForecastGraph from "./components/SevenDayForecastGraph";
import type { CityItem } from "./types/city.types";
import type { WeatherData } from "./types/forecast.types";

const SAVED_CITY_KEY = "city";
const EMPTY_WEATHER: WeatherData = {
  current: { temperature: 0, weatherCode: -1 },
  forecast: [],
};

function readSavedCity(): CityItem | undefined {
  try {
    const savedCity = localStorage.getItem(SAVED_CITY_KEY);
    if (!savedCity) return;

    const city = JSON.parse(savedCity) as CityItem | null;
    if (
      typeof city?.name === "string" &&
      Number.isFinite(city.latitude) &&
      Number.isFinite(city.longitude)
    ) {
      return city;
    }
  } catch (error) {
    console.log(error);
  }
}

function App() {
  const [city, setCity] = useState(readSavedCity);
  const [isCityPickerOpen, setIsCityPickerOpen] = useState(() => !city);
  const {
    data: weather = EMPTY_WEATHER,
    isError: hasWeatherError,
    refetch: refreshForecast,
  } = useQuery({
    queryKey: ["forecast", city?.latitude, city?.longitude],
    queryFn: city
      ? ({ signal }) => getWeather(city.latitude, city.longitude, signal)
      : skipToken,
    placeholderData: keepPreviousData,
  });

  function handleCitySelection(nextCity: CityItem) {
    try {
      localStorage.setItem(SAVED_CITY_KEY, JSON.stringify(nextCity));
    } catch (error) {
      console.log(error);
    }
    setCity(nextCity);
    setIsCityPickerOpen(false);

    if (
      city?.latitude === nextCity.latitude &&
      city.longitude === nextCity.longitude
    ) {
      void refreshForecast();
    }
  }

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
          <CurrentWeather
            current={weather.current}
            cityName={city?.name}
            onChooseCity={() => setIsCityPickerOpen(true)}
          />
          {!hasWeatherError && <ApplicantName />}
        </Box>

        {!hasWeatherError && (
          <Box sx={{ flex: "auto", minWidth: 0 }}>
            <SevenDayForecast forecast={weather.forecast} />
            <SevenDayForecastGraph forecast={weather.forecast} />
          </Box>
        )}
      </Box>
      {hasWeatherError && (
        <Typography variant="h4" component="h2">
          Nem sikerült betölteni az időjárási adatokat.
        </Typography>
      )}
      <CityModal
        open={isCityPickerOpen}
        canDismiss={!!city}
        onClose={() => setIsCityPickerOpen(false)}
        onSelectCity={handleCitySelection}
      />
    </>
  );
}

export default App;

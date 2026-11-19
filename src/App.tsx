import { Box, Button, Typography } from "@mui/material";
import { skipToken, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getWeather } from "./api/forecastApi";
import ApplicantName from "./components/ApplicantName";
import CityModal from "./components/CityModal";
import CurrentWeather from "./components/CurrentWeather";
import SevenDayForecast from "./components/SevenDayForecast";
import SevenDayForecastGraph from "./components/SevenDayForecastGraph";
import type { CityItem } from "./types/city.types";

const SAVED_CITY_KEY = "city";

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
    data: weather,
    isError: hasWeatherError,
    isPending,
    isFetching,
    refetch: refreshForecast,
  } = useQuery({
    queryKey: ["forecast", city?.latitude, city?.longitude],
    queryFn: city
      ? ({ signal }) => getWeather(city.latitude, city.longitude, signal)
      : skipToken,
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
        component="main"
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
            current={weather?.current}
            cityName={city?.name}
            isCityPickerOpen={isCityPickerOpen}
            onChooseCity={() => setIsCityPickerOpen(true)}
          />
          <ApplicantName />
        </Box>

        <Box sx={{ flex: "auto", minWidth: 0 }}>
          {!city && (
            <Typography role="status">
              Válassz várost az időjárás megtekintéséhez.
            </Typography>
          )}
          {city && (
            <>
              {hasWeatherError && (
                <Typography role="alert" sx={{ mb: 2 }}>
                  Nem sikerült betölteni az időjárási adatokat. Próbáld újra.
                </Typography>
              )}
              <Typography role="status" aria-live="polite">
                {isFetching &&
                  (isPending
                    ? "Időjárási adatok betöltése…"
                    : "Időjárási adatok frissítése…")}
              </Typography>
              <Button
                variant="outlined"
                color="inherit"
                size="small"
                disabled={isFetching}
                onClick={() => void refreshForecast()}
                aria-label="Időjárási adatok újratöltése"
                sx={{ mb: 2 }}
              >
                Újratöltés
              </Button>
            </>
          )}
          <Box aria-busy={!!city && isFetching}>
            {weather && (
              <>
                <SevenDayForecast forecast={weather.forecast} />
                <SevenDayForecastGraph forecast={weather.forecast} />
              </>
            )}
          </Box>
        </Box>
      </Box>
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

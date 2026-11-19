import { Box, ButtonBase, Typography } from "@mui/material";
import type { CurrentConditions } from "../types/forecast.types";
import { conditions } from "../weather";

type CurrentWeatherProps = {
  cityName?: string;
  current?: CurrentConditions;
  isCityPickerOpen: boolean;
  onChooseCity: () => void;
};

export default function CurrentWeather({
  cityName,
  current,
  isCityPickerOpen,
  onChooseCity,
}: CurrentWeatherProps) {
  return (
    <Box sx={{ ml: { xs: 0, md: 4 } }}>
      <Typography variant="caption" component="h1">
        <ButtonBase
          id="current-city"
          type="button"
          disableRipple
          onClick={onChooseCity}
          aria-label={cityName ? `Város módosítása, ${cityName}` : "Város kiválasztása"}
          aria-haspopup="dialog"
          aria-expanded={isCityPickerOpen}
          aria-controls="city-picker-dialog"
          sx={{
            font: "inherit",
            textAlign: "inherit",
            borderRadius: 0.5,
            "&.Mui-focusVisible": {
              outline: "2px solid currentColor",
              outlineOffset: 4,
            },
          }}
        >
          {cityName ?? "Város kiválasztása"}
        </ButtonBase>
      </Typography>
      {current && (
        <>
          <Typography
            id="current-temperature"
            sx={{ mt: 1 }}
            variant="h3"
            component="p"
          >
            {`${Math.round(current.temperature)} °C`}
          </Typography>
          <Typography id="current-weather" sx={{ mt: 1 }}>
            {conditions[current.weatherCode]?.label ?? ""}
          </Typography>
        </>
      )}
    </Box>
  );
}

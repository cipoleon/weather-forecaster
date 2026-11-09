import axios from "axios";
import type { WeatherData } from "../types/forecast.types";

interface WeatherApiResponse {
  current: {
    temperature_2m: number;
    weather_code: number;
  };
  daily: {
    precipitation_probability_max: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    time: string[];
    weather_code: number[];
  };
}

export async function getWeather(
  latitude: number,
  longitude: number,
  signal?: AbortSignal,
): Promise<WeatherData> {
  const {
    data: { current, daily },
  } = await axios.get<WeatherApiResponse>(
    "https://api.open-meteo.com/v1/forecast",
    {
      signal,
      params: {
        latitude,
        longitude,
        current: "temperature_2m,weather_code",
        daily: [
          "temperature_2m_max",
          "temperature_2m_min",
          "weather_code",
          "precipitation_probability_max",
        ].join(","),
        timezone: "auto",
        forecast_days: 7,
      },
    },
  );

  return {
    current: {
      temperature: current.temperature_2m,
      weatherCode: current.weather_code,
    },
    forecast: daily.time.map((time, index) => ({
      time,
      max: daily.temperature_2m_max[index],
      min: daily.temperature_2m_min[index],
      rainProbability: daily.precipitation_probability_max[index],
      weatherCode: daily.weather_code[index],
    })),
  };
}

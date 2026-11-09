import axios from "axios";
import type { WeatherApiResponse, WeatherData } from "../types/forecast.types";

export const getWeather = (
  latitude: number,
  longitude: number,
): Promise<WeatherData> => {
  return axios
    .get<WeatherApiResponse>("https://api.open-meteo.com/v1/forecast", {
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
    })
    .then((response) => {
      const { current, daily } = response.data;

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
    });
};

export interface WeatherData {
  current: CurrentConditions;
  forecast: ForecastDay[];
}

export interface ForecastDay {
  max: number;
  min: number;
  time: string;
  rainProbability: number;
  weatherCode: number;
}

export interface CurrentConditions {
  temperature: number;
  weatherCode: number;
}

export type WeatherIconKind =
  | "sun"
  | "partlyCloudy"
  | "cloud"
  | "fog"
  | "rain"
  | "snow"
  | "thunder"
  | "unknown";

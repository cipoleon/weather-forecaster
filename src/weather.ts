import type { WeatherIconKind } from "./types/forecast.types";

interface WeatherCondition {
  label: string;
  icon: WeatherIconKind;
}

export const conditions: Partial<Record<number, WeatherCondition>> = {
  0: { label: "Tiszta idő", icon: "sun" },
  1: { label: "Többnyire derült", icon: "sun" },
  2: { label: "Részben felhős", icon: "partlyCloudy" },
  3: { label: "Borult", icon: "cloud" },
  45: { label: "Köd", icon: "fog" },
  48: { label: "Zúzmarás köd", icon: "fog" },
  51: { label: "Gyenge szitálás", icon: "rain" },
  53: { label: "Szitálás", icon: "rain" },
  55: { label: "Erős szitálás", icon: "rain" },
  56: { label: "Gyenge ónos szitálás", icon: "rain" },
  57: { label: "Erős ónos szitálás", icon: "rain" },
  61: { label: "Gyenge eső", icon: "rain" },
  63: { label: "Eső", icon: "rain" },
  65: { label: "Erős eső", icon: "rain" },
  66: { label: "Gyenge ónos eső", icon: "rain" },
  67: { label: "Erős ónos eső", icon: "rain" },
  71: { label: "Gyenge havazás", icon: "snow" },
  73: { label: "Havazás", icon: "snow" },
  75: { label: "Erős havazás", icon: "snow" },
  77: { label: "Hódara", icon: "snow" },
  80: { label: "Gyenge zápor", icon: "rain" },
  81: { label: "Zápor", icon: "rain" },
  82: { label: "Heves zápor", icon: "rain" },
  85: { label: "Gyenge hózápor", icon: "snow" },
  86: { label: "Erős hózápor", icon: "snow" },
  95: { label: "Zivatar", icon: "thunder" },
  96: { label: "Zivatar kisebb jégesővel", icon: "thunder" },
  97: { label: "Erős zivatar", icon: "thunder" },
  99: { label: "Zivatar heves jégesővel", icon: "thunder" },
};

const days = [
  "Vasárnap",
  "Hetfő",
  "Kedd",
  "Szerda",
  "Csütörtök",
  "Péntek",
  "Szombat",
];

export function getForecastDayLabel(time: string): string | undefined {
  return days[new Date(time).getDay()];
}

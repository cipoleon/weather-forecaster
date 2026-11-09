import type { ReactNode } from "react";
import type { WeatherIconKind } from "../types/forecast.types";

const sun = (
  <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4m0-14.2-1.4 1.4M6.3 17.7l-1.4 1.4M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
);
const cloud = (
  <path d="M6.5 16.5a4 4 0 1 1 .6-8 5.4 5.4 0 0 1 10.3 1 3.5 3.5 0 1 1 .6 7Z" />
);
const icons: Record<WeatherIconKind, ReactNode> = {
  sun,
  partlyCloudy: (
    <>
      <path d="M7 2v2M2 7h2m-.8-3.8 1.4 1.4m6.2-1.4L9.4 4.6M5 9.1a3 3 0 0 1 5-2.4" />
      {cloud}
    </>
  ),
  cloud,
  fog: (
    <>
      {cloud}
      <path d="M3 20h18" />
    </>
  ),
  rain: (
    <>
      {cloud}
      <path d="m8 19-1 2m5-2-1 2m5-2-1 2" />
    </>
  ),
  snow: (
    <>
      {cloud}
      <path d="M8 20h.01M12 21h.01M16 20h.01" strokeWidth="2.4" />
    </>
  ),
  thunder: (
    <>
      {cloud}
      <path d="m13 15-2 4h3l-2 3" />
    </>
  ),
  unknown: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.3 9a2.8 2.8 0 1 1 4.4 2.3c-1 .7-1.7 1.2-1.7 2.3m0 2.9h.01" />
    </>
  ),
};

export function WeatherIcon({ kind }: { kind: WeatherIconKind }) {
  return (
    <svg
      width={40}
      aria-hidden="true"
      className="weather-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icons[kind]}
    </svg>
  );
}

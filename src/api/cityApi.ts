import axios from "axios";
import type { CityItem } from "../types/city.types";

interface CitySearchResponse {
  results?: {
    id: number;
    name: string;
    admin1?: string;
    country?: string;
    latitude: number;
    longitude: number;
  }[];
}

export async function getCities(
  name: string,
  signal?: AbortSignal,
): Promise<CityItem[]> {
  const { data } = await axios.get<CitySearchResponse>(
    "https://geocoding-api.open-meteo.com/v1/search",
    {
      signal,
      params: {
        name,
        count: 10,
        language: "hu",
      },
    },
  );

  return (data.results ?? []).map((city) => ({
    id: city.id,
    name: city.name,
    county: city.admin1,
    country: city.country,
    latitude: city.latitude,
    longitude: city.longitude,
  }));
}

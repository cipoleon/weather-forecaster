import axios from "axios";
import type { CityItem, CityRawItem } from "../types/city.types";
// TODO tanstack, és pagination vagy valami, gráf hover width megnő

interface CitySearchResponse {
  results?: CityRawItem[];
}
export const getCities = (name: string): Promise<CityItem[]> => {
  return axios
    .get<CitySearchResponse>("https://geocoding-api.open-meteo.com/v1/search", {
      params: {
        name,
        count: 10,
        language: "hu",
      },
    })
    .then((response) => {
      const citiesRaw: CityRawItem[] = response.data.results || [];

      return citiesRaw.map((city) => ({
        name: city.name,
        county: city.admin1,
        country: city.country,
        latitude: city.latitude,
        longitude: city.longitude,
      }));
    });
};

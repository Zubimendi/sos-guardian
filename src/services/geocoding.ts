import opencage from "opencage-api-client";
import {APP_CONFIG} from "../constants/config";
import {Location} from "../types";

export interface GeocodedAddress {
  formatted: string;
}

export const reverseGeocodeLocation = async (
  location: Location,
): Promise<GeocodedAddress | null> => {
  if (!APP_CONFIG.OPENCAGE_API_KEY || APP_CONFIG.OPENCAGE_API_KEY === "YOUR_OPENCAGE_API_KEY") {
    return null;
  }

  const result = await opencage.geocode({
    key: APP_CONFIG.OPENCAGE_API_KEY,
    q: `${location.latitude},${location.longitude}`,
    language: "en",
  });

  if (!result.results || result.results.length === 0) {
    return null;
  }

  return {formatted: result.results[0].formatted};
};


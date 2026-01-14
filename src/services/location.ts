import * as Location from "expo-location";
import {Alert as RNAlert, Platform} from "react-native";
import {APP_CONFIG} from "../constants/config";
import {Location as AppLocation} from "../types";

export const requestLocationPermission = async (): Promise<boolean> => {
  const {status} = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    RNAlert.alert(
      "Location Permission Required",
      "SOS Guardian needs your location to send accurate emergency alerts.",
    );
    return false;
  }

  // Background permission on supported platforms
  if (Platform.OS !== "web") {
    await Location.requestBackgroundPermissionsAsync();
  }

  return true;
};

export const getCurrentLocation = async (): Promise<AppLocation | null> => {
  const hasPermission = await requestLocationPermission();
  if (!hasPermission) return null;

  const loc = await Location.getCurrentPositionAsync({
    accuracy: Location.LocationAccuracy.Highest,
  });

  return {
    latitude: loc.coords.latitude,
    longitude: loc.coords.longitude,
    accuracy: loc.coords.accuracy || undefined,
    timestamp: loc.timestamp,
  };
};

export const startLocationUpdates = async (
  callback: (location: AppLocation) => void,
) => {
  const hasPermission = await requestLocationPermission();
  if (!hasPermission) return;

  await Location.watchPositionAsync(
    {
      accuracy: Location.LocationAccuracy.Balanced,
      timeInterval: APP_CONFIG.LOCATION_UPDATE_INTERVAL,
      distanceInterval: 10,
    },
    (loc) => {
      callback({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        accuracy: loc.coords.accuracy || undefined,
        timestamp: loc.timestamp,
      });
    },
  );
};


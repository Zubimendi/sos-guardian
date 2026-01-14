import React from "react";
import {StyleSheet, View, Text} from "react-native";
import RNMapView, {Marker, Region} from "react-native-maps";
import {Location} from "../../types";
import {COLORS} from "../../constants/colors";

interface Props {
  location: Location | null;
}

const MapView: React.FC<Props> = ({location}) => {
  if (!location) {
    return (
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>
          Location unavailable. Enable location services.
        </Text>
      </View>
    );
  }

  const region: Region = {
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <RNMapView style={styles.map} initialRegion={region}>
      <Marker coordinate={location} title="You" />
    </RNMapView>
  );
};

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: 220,
    borderRadius: 16,
    overflow: "hidden",
  },
  placeholder: {
    width: "100%",
    height: 220,
    borderRadius: 16,
    backgroundColor: COLORS.card,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  placeholderText: {
    color: COLORS.textSecondary,
    textAlign: "center",
  },
});

export default MapView;


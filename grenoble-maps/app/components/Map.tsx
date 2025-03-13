import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Region } from "react-native-maps";
import SearchBar from "./SearchBar";

export default function Map() {
  const [region, setRegion] = useState<Region>({
    latitude: 45.1885,
    longitude: 5.7245,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  const handleSearch = async (query: string) => {
    try {
      const response = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      if (data.features.length > 0) {
        const { coordinates } = data.features[0].geometry;
        setRegion({
          latitude: coordinates[1],
          longitude: coordinates[0],
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    } catch (error) {
      console.error("Erreur de recherche :", error);
    }
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region} />
      <SearchBar onSearch={handleSearch} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});

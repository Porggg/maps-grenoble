import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import SearchBar from "./SearchBar";

export default function Map() {
  const [region, setRegion] = useState<Region>({
    latitude: 45.1885,
    longitude: 5.7245,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  const [markerPosition, setMarkerPosition] = useState<{ latitude: number; longitude: number } | null>(null);

  const [stops, setStops] = useState([]);

  const [filter, setFilter] = useState('tram'); // 'all', 'tram', 'bus', etc.

  useEffect(() => {
    fetch('https://data.mobilites-m.fr/api/points/json?types=stops')
      .then(response => response.json())
      .then(data => setStops(data.features))
      .catch(error => console.error('Erreur lors du chargement des arrêts :', error));
  }, []);
  

  const filteredStops = stops.filter(stop => {
    if (filter === 'all') return true;
    return stop.properties.type === filter;
  });
  


  const handleSearch = async (query: string) => {
    try {
      const response = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}`
      );
      const data = await response.json();

      if (data.features.length > 0) {
        const { coordinates } = data.features[0].geometry;
        const newRegion = {
          latitude: coordinates[1],
          longitude: coordinates[0],
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        setRegion(newRegion);
        setMarkerPosition({ latitude: coordinates[1], longitude: coordinates[0] });

      }
    } catch (error) {
      console.error("Erreur de recherche :", error);
    }
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region}>
        {markerPosition && (
          <Marker coordinate={markerPosition} title="Lieu recherché" />
        )}

        {stops.map(stop => (
          <Marker
            key={stop.properties.code}
            coordinate={{
                latitude: stop.geometry.coordinates[1],
                longitude: stop.geometry.coordinates[0],
            }}
            title={stop.properties.name}
          />
        ))}

        {/* <Picker
          selectedValue={filter}
          onValueChange={(value) => setFilter(value)}
        >
          <Picker.Item label="Tous" value="all" />
          <Picker.Item label="Tram" value="tram" />
          <Picker.Item label="Bus" value="bus" />
        </Picker> */}

      </MapView>
      <SearchBar onSearch={handleSearch} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});

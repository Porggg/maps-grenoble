import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import SearchBar from "./SearchBar";
import Svg, { Path, Rect, Defs, ClipPath, G } from "react-native-svg"; // Importation pour les icônes SVG

// Définition des couleurs fixes pour chaque ligne de tram
const LINE_COLORS: { [key: string]: string } = {
  "SEM:A": "blue",
  "SEM:B": "green",
  "SEM:C": "red",
  "SEM:D": "orange",
  "SEM:E": "purple",
};

interface TramStop {
  latitude: number;
  longitude: number;
  name: string;
  lines: string[]; // Un arrêt peut avoir plusieurs lignes
}

export default function Map() {
  const [region, setRegion] = useState<Region>({
    latitude: 45.1885,
    longitude: 5.7245,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  const [markerPosition, setMarkerPosition] = useState<{ latitude: number; longitude: number } | null>(null);
  const [tramStops, setTramStops] = useState<TramStop[]>([]);

  useEffect(() => {
    const fetchAllTramStops = async () => {
      try {
        const lines = ["SEM:A", "SEM:B", "SEM:C", "SEM:D", "SEM:E"];
        let stopsMap: { [key: string]: TramStop } = {};

        for (const line of lines) {
          const response = await fetch(
            `https://data.mobilites-m.fr/api/routers/default/index/routes/${line}/clusters`
          );
          const data = await response.json();

          if (Array.isArray(data)) {
            data.forEach((stop: any) => {
              const key = `${stop.lat},${stop.lon}`; // Identifie l'arrêt par sa position
              
              if (!stopsMap[key]) {
                stopsMap[key] = {
                  latitude: stop.lat,
                  longitude: stop.lon,
                  name: stop.name,
                  lines: [],
                };
              }
              stopsMap[key].lines.push(line);
            });
          }
        }

        setTramStops(Object.values(stopsMap));
      } catch (error) {
        console.error("Erreur lors de la récupération des arrêts de tram :", error);
      }
    };

    fetchAllTramStops();
  }, []);

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

  const getMultiLineIcon = (lines: string[]) => {
    const width = 30;
    const height = 40;
    const stripeWidth = width / lines.length;
  
    return (
      <Svg width={width} height={height} viewBox="0 0 35 42">
        <Defs>
          {/* ClipPath ajusté pour éviter tout rognage */}
          <ClipPath id="markerClip">
            <Path d="M15 1C7 1 1 8 1 16C1 24 15 41 15 41C15 41 29 24 29 16C29 8 23 1 15 1Z" />
          </ClipPath>
        </Defs>
  
        {/* Remplissage des couleurs avec un léger débordement */}
        <G clipPath="url(#markerClip)">
          {lines.map((line, index) => (
            <Rect
              key={line}
              x={index * stripeWidth}
              y={-1} // Débordement léger en haut
              width={stripeWidth}
              height={height + 2} // Débordement léger en bas
              fill={LINE_COLORS[line] || "gray"}
            />
          ))}
        </G>
  
        {/* Contour noir exactement aligné */}
        <Path
          d="M15 1C7 1 1 8 1 16C1 24 15 41 15 41C15 41 29 24 29 16C29 8 23 1 15 1Z"
          fill="none"
          stroke="black"
          strokeWidth="2"
        />
      </Svg>
    );
  };
  
  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region}>
        {/* Marqueur du lieu recherché */}
        {markerPosition && <Marker coordinate={markerPosition} title="Lieu recherché" />}

        {/* Marqueurs des arrêts de tram avec couleurs rayées pour les arrêts multi-lignes */}
        {tramStops.map((stop, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: stop.latitude, longitude: stop.longitude }}
            title={stop.name}
          >
            {getMultiLineIcon(stop.lines)}
          </Marker>
        ))}
      </MapView>
      <SearchBar onSearch={handleSearch} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});

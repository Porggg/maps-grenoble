import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import Collapsible from 'react-native-collapsible';

export default function TransportsScreen() {
  interface TransportData {
    arrets: {
      stopId: string;
      stopName: string;
      city: string;
      lat: number;
      lon: number;
    }[];
  }

  const [data, setData] = useState<{ [key: string]: TransportData[] | null }>({ A: null, B: null, C: null });
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({ A: false, B: false, C: false });
  const [error, setError] = useState<{ [key: string]: unknown }>({ A: null, B: null, C: null });
  const [activeSections, setActiveSections] = useState<{ [key: string]: boolean }>({ A: false, B: false, C: false });

  const fetchData = async (line: string) => {
    setLoading((prev) => ({ ...prev, [line]: true }));
    try {
      const response = await fetch(`https://data.mobilites-m.fr/api/ficheHoraires/json?route=SEM%3A${line}`);
      const json = await response.json();
      setData((prev) => ({ ...prev, [line]: json }));
    } catch (error) {
      setError((prev) => ({ ...prev, [line]: error }));
    } finally {
      setLoading((prev) => ({ ...prev, [line]: false }));
    }
  };

  const toggleSection = (line: string) => {
    setActiveSections((prev) => {
      const newState = { ...prev, [line]: !prev[line] };
      if (!prev[line]) {
        fetchData(line);
      }
      return newState;
    });
  };

  const renderItem = ({ item }: { item: { stopId: string; stopName: string; city: string; lat: number; lon: number } }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.stopName}</Text>
      <Text style={styles.details}>Ville: {item.city}</Text>
      <Text style={styles.details}>Latitude: {item.lat}</Text>
      <Text style={styles.details}>Longitude: {item.lon}</Text>
    </View>
  );

  const renderSection = (line: string) => (
    <View key={line}>
      <TouchableOpacity onPress={() => toggleSection(line)} style={styles.header}>
        <Text style={styles.headerText}>Ligne {line}</Text>
      </TouchableOpacity>
      <Collapsible collapsed={!activeSections[line]}>
        {loading[line] ? (
          <ActivityIndicator size="large" color="#ffd33d" />
        ) : error[line] ? (
          <Text style={styles.text}>Erreur: {(error[line] as Error).message}</Text>
        ) : (
          data[line] && data[line][0] && (
            <FlatList
              data={data[line][0].arrets}
              renderItem={renderItem}
              keyExtractor={(item) => item.stopId}
            />
          )
        )}
      </Collapsible>
    </View>
  );

  return (
    <View style={styles.container}>
      {['A', 'B', 'C'].map((line) => renderSection(line))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    padding: 20,
  },
  header: {
    backgroundColor: '#333',
    padding: 15,
    marginVertical: 8,
    borderRadius: 5,
  },
  headerText: {
    color: '#ffd33d',
    fontSize: 18,
  },
  item: {
    backgroundColor: '#444',
    padding: 15,
    marginVertical: 8,
    borderRadius: 5,
  },
  title: {
    color: '#ffd33d',
    fontSize: 18,
    marginBottom: 5,
  },
  details: {
    color: '#fff',
    fontSize: 14,
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
});
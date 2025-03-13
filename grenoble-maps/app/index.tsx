import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import Map from "./components/Map"; // Import du composant Map

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <Map />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});

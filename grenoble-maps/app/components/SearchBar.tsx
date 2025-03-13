import React, { useState } from "react";
import { TextInput, StyleSheet, View } from "react-native";

export default function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    onSearch(query); // Envoie la recherche au composant parent
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Rechercher un lieu..."
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSearch} // Recherche au moment de valider
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  input: {
    fontSize: 16,
  },
});

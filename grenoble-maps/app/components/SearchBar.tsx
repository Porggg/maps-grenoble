import React, { useState } from "react";
import {
  TextInput,
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Pour l'icône de la croix

export default function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const fetchSuggestions = async (text: string) => {
    setQuery(text);
    if (text.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(text)}`
      );
      const data = await response.json();
      setSuggestions(data.features);
    } catch (error) {
      console.error("Erreur de récupération des suggestions :", error);
    }
  };

  const handleSelectSuggestion = (item: any) => {
    setQuery(item.properties.label); // Remplit l'input avec le choix
    setSuggestions([]); // Cache les suggestions
    onSearch(item.properties.label); // Envoie l'adresse choisie au parent
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Rechercher un lieu..."
          value={query}
          onChangeText={fetchSuggestions}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => { setQuery(""); setSuggestions([]); }}>
            <Ionicons name="close-circle" size={20} color="gray" />
          </TouchableOpacity>
        )}
      </View>

      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.properties.id}
          style={styles.suggestionsList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.suggestionItem}
              onPress={() => handleSelectSuggestion(item)}
            >
              <Text>{item.properties.label}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 20,
    left: 50,
    right: 50,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  input: {
    fontSize: 16,
    flex: 1,
  },
  suggestionsList: {
    marginTop: 5,
    maxHeight: 150,
    backgroundColor: "white",
    borderRadius: 5,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
});

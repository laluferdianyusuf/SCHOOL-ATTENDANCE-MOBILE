import { View, TextInput } from "react-native";
import React, { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
}

export default function SearchBar({
  placeholder = "Search",
  onSearch,
}: SearchBarProps) {
  const { colors, dark } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <View
      className={`flex-1 flex-row items-center rounded-2xl py-2 px-4 mt-4 mb-2 ${
        dark ? "bg-custom-green-dark" : "bg-custom-green-light"
      }`}
    >
      <MaterialCommunityIcons
        name="magnify"
        size={20}
        color={colors.text}
        style={{ opacity: 0.6 }}
      />
      <TextInput
        style={{
          color: colors.text,
          fontFamily: "Kanit",
          flex: 1,
          marginLeft: 10,
        }}
        placeholder={placeholder}
        placeholderTextColor={
          dark ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.6)"
        }
        value={searchQuery}
        onChangeText={handleSearch}
        returnKeyType="search"
      />
    </View>
  );
}

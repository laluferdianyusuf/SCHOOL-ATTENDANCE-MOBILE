import React from "react";
import { View, Text } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { useTheme } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

interface InputListProps {
  setSelected: (key: string) => void;
  data: { key: string; value: string }[];
  isSearched: boolean;
  icon: string;
  placeholder: string;
  label: string;
  noDataText: string;
  value?: "value" | "key";
  selectedValue: string | number | null;
  width?: number;
}

export default function InputList({
  setSelected,
  data,
  isSearched,
  icon,
  placeholder,
  label,
  noDataText,
  value,
  selectedValue,
  width = 300,
}: InputListProps) {
  const { colors } = useTheme();
  const selectedOption = data.find((option) => option.key === selectedValue);

  return (
    <View className="mb-5">
      <Text
        style={{ fontFamily: "Kanit", color: colors.text }}
        className="font-bold mb-3"
      >
        {label}
      </Text>
      <View className="px-3 border border-custom-green-2 rounded-2xl flex-row items-center gap-3">
        <Ionicons name={icon as any} size={20} color={colors.text} />
        <View className="h-[30%] bg-custom-green-2" style={{ width: 1 }} />
        <SelectList
          setSelected={(val: string) => setSelected(val)}
          data={data}
          search={isSearched}
          save={value}
          boxStyles={{
            borderColor: "transparent",
            paddingHorizontal: 0,
            width: width,
          }}
          inputStyles={{ color: colors.text, fontFamily: "Kanit" }}
          placeholder={placeholder}
          searchPlaceholder="Search"
          searchicon={
            <Ionicons
              name="search-outline"
              size={20}
              color={colors.text}
              className="pr-2"
            />
          }
          arrowicon={
            <Ionicons name="chevron-down" size={20} color={colors.text} />
          }
          closeicon={
            <Ionicons name="close-outline" size={20} color={colors.text} />
          }
          dropdownStyles={{
            borderColor: "transparent",
            paddingBottom: 20,
            marginTop: -10,
          }}
          dropdownTextStyles={{
            color: colors.text,
            marginLeft: -20,
            fontFamily: "Kanit",
          }}
          notFoundText={noDataText}
        />
      </View>
    </View>
  );
}

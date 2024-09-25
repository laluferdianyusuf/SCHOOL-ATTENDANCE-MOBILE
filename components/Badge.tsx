import { useTheme } from "@react-navigation/native";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface BadgeProps {
  count: number;
}

const Badge: React.FC<BadgeProps> = ({ count }) => {
  if (count === 0) return null;
  const { colors } = useTheme();

  return (
    <View className="bg-red-600 w-5 h-5 items-center justify-center top-[-5px] right-[-3px] absolute rounded-full ">
      <Text
        className="text-xs"
        style={{ fontFamily: "Kanit", color: colors.text }}
      >
        {count}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: -5,
    right: -10,
    backgroundColor: "#FF0000",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 12,
  },
});

export default Badge;

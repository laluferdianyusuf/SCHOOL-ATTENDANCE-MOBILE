import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface RenderEmptyProps {
  descriptions: string;
  icon?: string
}

const RenderEmpty: React.FC<RenderEmptyProps> = ({ descriptions, icon }) => (
  <View className="flex-1 justify-center items-center">
    <Ionicons name={icon as any} size={100} color={"#0D9485"} />
    <Text style={{ fontFamily: "Kanit", color: "#0D9485" }}>
      {descriptions}
    </Text>
  </View>
);

export default RenderEmpty;

import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { Category } from "@/types/types";

interface CategoryItemProps {
  item: Category;
  onPress: (id: string) => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ item, onPress }) => {
  const { colors } = useTheme();

  return (
    <Pressable
      className={`w-full mx-2 flex-1 items-center rounded-2xl ${item.primary}`}
      onPress={() => onPress(item.id)}
    >
      <View className={`p-4 flex-col gap-3 w-full`}>
        <View
          className={` ${item.color} p-2 rounded-2xl items-center justify-center`}
          style={{
            width: 50,
            height: 50,
          }}
        >
          <Ionicons name={item.icon as any} size={30} color={colors.text} />
        </View>
        <View>
          <Text style={{ fontFamily: "Kanit" }} className="font-bold">
            {item.name}
          </Text>
          <Text style={{ fontFamily: "Kanit" }} className="text-sm">
            {item.desc}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default CategoryItem;

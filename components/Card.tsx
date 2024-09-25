import { View, Text, Image, Pressable, Dimensions } from "react-native";
import React, { useState } from "react";
import { useTheme } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Button from "./Button";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeInUp,
  FadeOutUp,
} from "react-native-reanimated";
import { formatDate } from "@/utils/FormatTimeAtt";

interface CardProps {
  id: number;
  image: string;
  title: string;
  description: string;
  created: string;
  onPress: () => void;
  imageHeight: string;
  isUpdated?: boolean;
  width?: number;
  onDelete?: () => void;
  category?: string;
  index?: number;
  totalItems?: number;
  isAdmin?: boolean;
}

export default function Card({
  id,
  image,
  title,
  description,
  created,
  onPress,
  imageHeight,
  isUpdated = false,
  width = 0.9,
  onDelete,
  category,
  index,
  totalItems,
  isAdmin = false,
}: CardProps) {
  const [dropdown, setDropdown] = useState<boolean>(false);
  const rotation = useSharedValue(0);
  const { colors } = useTheme();

  const iconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const toggleDropdown = () => {
    setDropdown(!dropdown);
    rotation.value = withTiming(dropdown ? 0 : 180, { duration: 300 });
  };

  const screenWidth = Dimensions.get("window").width;

  return (
    <Pressable
      onPress={onPress}
      className={`rounded-xl overflow-hidden relative border-custom-green-2 border ${
        index === totalItems! - 1 ? "mb-12" : ""
      }`}
      style={{ width: screenWidth * width + 0.7 }}
    >
      <View className="absolute z-50 top-3 bg-custom-green-opacity-1 rounded-lg px-2 py-1 left-3 justify-center items-center w-28">
        <Text className="text-custom-green-2" style={{ fontFamily: "Kanit" }}>
          {category}
        </Text>
      </View>
      {isAdmin && isUpdated && (
        <>
          <View className="absolute z-50 top-3 right-3 justify-center items-center ">
            <Button
              handle={toggleDropdown}
              style="w-10 p-1 rounded-xl bg-custom-green-opacity-1 items-center"
            >
              <Animated.View style={iconStyle}>
                <Ionicons
                  name={`${dropdown ? "close" : "ellipsis-horizontal-sharp"}`}
                  color={"rgb(13 148 133)"}
                  size={25}
                />
              </Animated.View>
            </Button>
          </View>
          {dropdown && (
            <Animated.View
              className="absolute z-40 right-3 top-14 w-10 p-1 py-3 pb-4 rounded-xl gap-4 items-center "
              entering={FadeInUp.duration(300).delay(100).springify()}
              exiting={FadeOutUp.duration(300).delay(100).springify()}
              style={{ backgroundColor: "rgba(13, 148, 133, 0.2)" }}
            >
              <Button handle={() => console.log("edit")} style="">
                <Ionicons name="crop" color={"rgb(13 148 133)"} size={20} />
              </Button>
              <View className="h-[1px] w-1/2 bg-custom-green-2" />
              <Button
                handle={() => {
                  if (onDelete) {
                    onDelete();
                  } else {
                    console.log("Delete function not provided");
                  }
                }}
              >
                <Ionicons
                  name="trash-outline"
                  color={"rgb(13 148 133)"}
                  size={20}
                />
              </Button>
            </Animated.View>
          )}
        </>
      )}
      <Image
        source={{ uri: image }}
        className={`w-full ${imageHeight} rounded-t-xl`}
      />
      <View className="p-3 rounded-b-2xl ">
        <View className="flex-row items-center justify-between">
          <Text
            className="font-bold text-xl"
            style={{ fontFamily: "Kanit", color: colors.text }}
          >
            {title}
          </Text>
          <Text
            className="font-bold text-xs text-custom-green-2"
            style={{ fontFamily: "Kanit" }}
          >
            {formatDate(created)}
          </Text>
        </View>
        <Text
          numberOfLines={2}
          className="w-80 text-justify"
          style={{ fontFamily: "Kanit", color: colors.text }}
        >
          {description}
        </Text>
      </View>
    </Pressable>
  );
}

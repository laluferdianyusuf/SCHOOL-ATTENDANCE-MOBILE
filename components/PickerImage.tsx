import { View, Text, Image, Pressable } from "react-native";
import React, { useState } from "react";
import { useTheme } from "@react-navigation/native";
import Button from "./Button";
import { Ionicons } from "@expo/vector-icons";

interface ImageProps {
  pickImage: () => void;
  buttonStyle: string;
  title: string;
  imageName: string | undefined;
  resetImage: () => void;
}
export default function PickerImage({
  pickImage,
  buttonStyle,
  title,
  imageName,
  resetImage,
}: ImageProps) {
  const { colors } = useTheme();
  return (
    <View className="mb-5">
      <Text
        style={{ fontFamily: "Kanit", color: colors.text }}
        className="font-extrabold text-lg capitalize"
      >
        {title}
      </Text>
      <Button handle={pickImage} style={buttonStyle}>
        <View className="flex-row gap-3 items-center">
          <Ionicons name="image-outline" size={20} color={colors.text} />
          <View className="h-1/2 bg-custom-green-2" style={{ width: 1 }} />
        </View>
        <View className="flex-row justify-between flex-1">
          <Text
            numberOfLines={1}
            className={`flex-1`}
            style={{ color: colors.text, fontFamily: "Kanit" }}
          >
            {imageName ? imageName : "choose a new image"}
          </Text>
          {imageName ? (
            <Pressable onPress={resetImage} className="ml-3">
              <Text
                className=""
                style={{ fontFamily: "Kanit", color: colors.text }}
              >
                Reset
              </Text>
            </Pressable>
          ) : null}
        </View>
      </Button>
    </View>
  );
}

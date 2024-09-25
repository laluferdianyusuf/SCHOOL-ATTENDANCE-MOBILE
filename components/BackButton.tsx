import { Pressable } from "react-native";
import React from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function BackButton() {
  return (
    <Pressable onPress={() => router.back()} className="">
      <Ionicons name="arrow-back" color="rgb(13 148 133)" size={25} />
    </Pressable>
  );
}

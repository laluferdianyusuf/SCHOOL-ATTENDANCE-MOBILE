import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import Button from "./Button";
import { Ionicons } from "@expo/vector-icons";

interface AlertProps {
  background?: string;
  text: string;
  duration?: number;
  icon: string;
  textStyle?: string;
}

export default function AnimatedAlertNotification({
  background,
  text,
  duration = 3000,
  icon,
  textStyle,
}: AlertProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <Animated.View
      className={`z-50 flex-row justify-between p-4 rounded-2xl absolute top-12 left-9 right-9 items-center ${background} `}
      entering={FadeInUp.duration(300).delay(100).springify()}
      exiting={FadeOutUp.duration(300).delay(100).springify()}
    >
      <View className="flex-row gap-3 items-center">
        <Ionicons name={icon as any} size={20} color={textStyle} />

        <Text
          className={`font-bold `}
          style={{ fontFamily: "Kanit", color: textStyle }}
        >
          {text}
        </Text>
      </View>
      <Button handle={() => setVisible(false)}>
        <Ionicons name="close" size={20} color={textStyle} />
      </Button>
    </Animated.View>
  );
}

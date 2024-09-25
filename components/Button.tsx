import { Text, Pressable } from "react-native";
import React, { ReactNode } from "react";
import { useTheme } from "@react-navigation/native";

interface ButtonProps {
  children: ReactNode;
  handle: () => void;
  style?: string;
  disabled?: boolean;
  bgColor?: string;
}
export default function Button({
  children,
  handle,
  style,
  disabled,
  bgColor,
}: ButtonProps) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={handle} className={`${style}`} disabled={disabled}>
      {children}
    </Pressable>
  );
}

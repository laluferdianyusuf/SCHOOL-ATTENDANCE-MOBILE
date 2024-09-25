import React, { Ref, useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

interface CustomInputProps {
  title?: string;
  placeholder: string;
  icon?: string | any;
  keyboard?:
    | "default"
    | "email-address"
    | "numeric"
    | "phone-pad"
    | "decimal-pad";
  isPassword?: boolean;
  style?: string;
  onChange?: (text: string) => void;
  value: string;
  disabled?: boolean;
  isUpdated?: boolean;
  maxLength?: number;
}

export default function CustomInput(
  {
    title,
    placeholder,
    icon,
    keyboard = "default",
    isPassword = false,
    style = "w-full",
    onChange,
    value,
    disabled = false,
    isUpdated = false,
    maxLength,
  }: CustomInputProps,
  ref: Ref<TextInput>
) {
  const { colors, dark } = useTheme();
  const [secureText, setSecureText] = useState(isPassword);

  const toggleSecureText = () => {
    setSecureText(!secureText);
  };

  const handleEdit = () => {
    if (isUpdated) {
      router.push({
        pathname: "/(screens)/edit/[field]",
        params: {
          field: title!.toLowerCase(),
          value: value,
          icon: icon,
        },
      });
    }
  };
  return (
    <View className={`mb-5 ${style}`}>
      {title && (
        <Text
          style={{ fontFamily: "Kanit", color: colors.text }}
          className="font-extrabold text-lg capitalize opacity-75"
        >
          {title}
        </Text>
      )}
      <View
        className={`p-3 mt-2 border border-custom-green-2 rounded-2xl flex-row items-center gap-3`}
      >
        <Ionicons name={icon} color={colors.text} size={20} />
        <View className="h-1/2 w-[1px] bg-custom-green-2" />
        <TextInput
          ref={ref}
          onChangeText={onChange}
          keyboardType={keyboard}
          placeholder={placeholder}
          placeholderTextColor={colors.text}
          secureTextEntry={secureText}
          style={{ fontFamily: "Kanit", color: colors.text }}
          className={`flex-1`}
          value={value}
          editable={!disabled}
          maxLength={maxLength}
        />
        {isPassword ? (
          <Pressable onPress={toggleSecureText}>
            <Ionicons
              name={secureText ? "eye-outline" : "eye-off-outline"}
              color={colors.text}
              size={20}
            />
          </Pressable>
        ) : null}

        {isUpdated ? (
          <Pressable onPress={handleEdit} className="px-2 py-1">
            <Ionicons name={"pencil-outline"} color={"#14B8A6"} size={20} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

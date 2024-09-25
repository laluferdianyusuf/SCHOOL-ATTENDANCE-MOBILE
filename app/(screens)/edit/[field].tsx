import { View, Text, Pressable, TextInput } from "react-native";
import React, { useRef, useState } from "react";
import { useTheme } from "@react-navigation/native";
import BackButton from "@/components/BackButton";
import { router, useLocalSearchParams } from "expo-router";
import { updateProfileField } from "@/redux/slicer/adminSlice";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import CustomInput from "@/components/CustomInput";
import Button from "@/components/Button";

export default function EditField() {
  const dispatch: AppDispatch = useDispatch();
  const { colors } = useTheme();
  const { field, value, icon } = useLocalSearchParams();
  const [day, setDay] = useState<string>(
    field === "birthday" && typeof value === "string" ? value.split("-")[2] : ""
  );
  const [month, setMonth] = useState<string>(
    field === "birthday" && typeof value === "string" ? value.split("-")[1] : ""
  );
  const [year, setYear] = useState<string>(
    field === "birthday" && typeof value === "string" ? value.split("-")[0] : ""
  );
  const [newValue, setNewValue] = useState<string>(
    field !== "birthday" && typeof value === "string" ? value : ""
  );

  const saveChanges = () => {
    if (field === "birthday") {
      const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
        2,
        "0"
      )}`;
      dispatch(
        updateProfileField({
          field: field as any,
          value: formattedDate,
        })
      );
    } else {
      dispatch(
        updateProfileField({
          field: field as any,
          value: newValue,
        })
      );
    }
    router.back();
  };

  const dayRef = useRef<TextInput>(null);
  const monthRef = useRef<TextInput>(null);
  const yearRef = useRef<TextInput>(null);

  return (
    <View className="pt-16 px-6 flex-1">
      <View className="flex-row gap-3 items-center">
        <BackButton />
        <Text
          className="capitalize"
          style={{ fontFamily: "Kanit", color: colors.text }}
        >
          Edit {field}
        </Text>
      </View>
      <Text
        className="text-justify my-5"
        style={{ fontFamily: "Kanit", color: colors.text }}
      >
        This screen is a place where users can edit specific {field} information
        in your profile. After making changes, you can save the new information,
        and it will be updated in their profile.
      </Text>
      {field === "birthday" ? (
        <View className="flex-row gap-3">
          <CustomInput
            placeholder="Day"
            value={day}
            onChange={(text) => {
              setDay(text);
              if (text.length === 2) {
                monthRef.current?.focus();
              }
            }}
            keyboard="numeric"
            maxLength={2}
            style="flex-1"
          />
          <CustomInput
            placeholder="Month"
            value={month}
            onChange={(text) => {
              setMonth(text);
              if (text.length === 2) {
                yearRef.current?.focus();
              }
            }}
            keyboard="numeric"
            maxLength={2}
            style="flex-1"
          />
          <CustomInput
            placeholder="Year"
            value={year}
            onChange={(text) => setYear(text)}
            keyboard="numeric"
            maxLength={4}
            style="flex-1"
          />
        </View>
      ) : (
        <CustomInput
          placeholder={`Enter new ${field}`}
          icon={icon}
          value={newValue as string}
          onChange={(text) => setNewValue(text)}
        />
      )}
      <Button
        handle={saveChanges}
        style="bg-custom-green-1 p-3 items-center justify-center rounded-xl"
      >
        <Text style={{ fontFamily: "Kanit", color: colors.text }}>Save</Text>
      </Button>
    </View>
  );
}

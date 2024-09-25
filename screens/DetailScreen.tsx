import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Student, Teacher } from "@/types/types";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface TeacherProps {
  id: number;
  name: string;
  classroom: string;
  description: string;
}

interface StudentProps {
  id: number;
  name: string;
  classroom: string;
  description: string;
}
interface DetailScreenProps {
  teacherId: number;
  studentId: number;
  teacher: Teacher;
  student: Student;
  icon: string;
}
export const DetailScreen: React.FC<DetailScreenProps> = ({
  teacherId,
  teacher,
  studentId,
  student,
  icon,
}) => {
  const { colors, dark } = useTheme();

  return (
    <>
      <Pressable
        onPress={() => router.back()}
        className="absolute z-50 p-1 rounded-md"
        style={{ top: 50, left: 20, backgroundColor: colors.background }}
      >
        <Ionicons name="arrow-back" color="rgb(13 148 133)" size={25} />
      </Pressable>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#c5e0dd", dark: "#041f1b" }}
        headerImage={
          <Ionicons
            size={270}
            name={icon as any}
            style={{
              color: "#0D9485",
              bottom: -50,
              left: -40,
              position: "absolute",
              opacity: 0.5,
            }}
          />
        }
      >
        <View className="">
          <View>
            <View className="flex-row justify-between items-center">
              <Text
                className=" font-bold text-lg pb-2"
                style={{ fontFamily: "Kanit", color: colors.text }}
              >
                {teacher && teacher.name ? teacher.name : student.name}
              </Text>

              <View className="flex-row gap-2">
                <Text
                  className=" font-bold text-xs text-custom-green-2 pb-2"
                  style={{ fontFamily: "Kanit" }}
                >
                  ID : {teacher && teacher.id ? teacher.id : student.id}
                </Text>
                <Text
                  className=" font-bold text-xs text-custom-green-2 pb-2"
                  style={{ fontFamily: "Kanit" }}
                >
                  {teacher && teacher.address
                    ? teacher.address
                    : student.classroom}
                </Text>
              </View>
            </View>
            <View className="flex-row gap-3 justify-center items-center mb-4">
              <View className="h-[1px] bg-custom-green-2 flex-1 opacity-35" />
              <Text
                className="opacity-35 text-custom-green-2 lowercase"
                style={{ fontFamily: "Kanit" }}
              >
                {teacher && teacher.name ? teacher.name : student.name}
              </Text>
              <View className="h-[1px] bg-custom-green-2 flex-1 opacity-35" />
            </View>
          </View>
          <Text
            className="text-justify"
            style={{ fontFamily: "Kanit", color: colors.text }}
          >
            {teacher && teacher.gender
              ? teacher.gender
              : student.parentName || "not set"}
          </Text>
        </View>
      </ParallaxScrollView>
    </>
  );
};

import { ThemedView } from "@/components/ThemedView";
import { CourseScreen } from "@/screens";
import { useLocalSearchParams } from "expo-router";

export default function TabTwoScreen() {
  return (
    <ThemedView className={`flex-1`}>
      <CourseScreen />
    </ThemedView>
  );
}

import { ThemedView } from "@/components/ThemedView";
import { MenuScreen } from "@/screens";

export default function Profile() {
  return (
    <ThemedView className={`flex-1`}>
      <MenuScreen />
    </ThemedView>
  );
}

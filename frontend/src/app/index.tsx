import { useRouter } from "expo-router";
import { View, Text, Pressable } from "react-native";

import { COLORS } from "../constants/colors";

export default function Index() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: "center", alignItems: "center", padding: 24 }}>
      <View style={{ width: "100%", maxWidth: 360, backgroundColor: COLORS.white, borderRadius: 24, padding: 24, borderWidth: 1, borderColor: COLORS.border }}>
        <Text style={{ fontSize: 24, fontWeight: "800", color: COLORS.text }}>Select Role</Text>
        <Text style={{ marginTop: 8, color: COLORS.textSecondary, lineHeight: 20 }}>Choose the dashboard you want to open.</Text>

        <Pressable
          onPress={() => router.replace("/(tabs)/dashboard")}
          style={{ marginTop: 20, paddingVertical: 14, borderRadius: 16, backgroundColor: COLORS.primary, alignItems: "center" }}
        >
          <Text style={{ color: COLORS.white, fontWeight: "700" }}>Continue as Admin</Text>
        </Pressable>

        <Pressable
          onPress={() => router.replace("/(user-tabs)/current-threat" as any)}
          style={{ marginTop: 12, paddingVertical: 14, borderRadius: 16, backgroundColor: "#F8FAFC", alignItems: "center", borderWidth: 1, borderColor: COLORS.border }}
        >
          <Text style={{ color: COLORS.text, fontWeight: "700" }}>Continue as User</Text>
        </Pressable>
      </View>
    </View>
  );
}
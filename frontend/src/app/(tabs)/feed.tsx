import { View, Text, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "../../constants/colors";

const feedItems = [
  {
    title: "High-risk transfer from flagged device",
    risk: "92",
    status: "Pending",
    time: "2 min ago",
  },
  {
    title: "Velocity anomaly in card usage",
    risk: "74",
    status: "Investigating",
    time: "11 min ago",
  },
  {
    title: "Suspicious merchant pattern detected",
    risk: "88",
    status: "Escalated",
    time: "24 min ago",
  },
];

export default function Feed() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }} contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 56, gap: 16 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 28, fontWeight: "800", color: COLORS.text }}>Threat Feed</Text>
            <Text style={{ marginTop: 4, color: COLORS.textSecondary }}>Live alerts and case stream</Text>
          </View>

          <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary, alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="notifications" size={20} color={COLORS.white} />
          </View>
        </View>

        {feedItems.map((item, index) => (
          <Pressable key={index} style={{ backgroundColor: COLORS.white, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: COLORS.border }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ fontSize: 16, fontWeight: "700", color: COLORS.text, flex: 1, marginRight: 10 }}>{item.title}</Text>
              <View style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: "#FEE2E2" }}>
                <Text style={{ color: COLORS.danger, fontWeight: "700" }}>{item.risk}</Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
              <Text style={{ color: COLORS.textSecondary }}>{item.time}</Text>
              <View style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: "#F3F4F6" }}>
                <Text style={{ color: COLORS.text, fontWeight: "600" }}>{item.status}</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

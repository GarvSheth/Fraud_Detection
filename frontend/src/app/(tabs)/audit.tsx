import { View, Text, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "../../constants/colors";

const auditItems = [
  {
    action: "Admin login",
    user: "Nadia Carter",
    time: "09:24 AM",
    status: "Verified",
  },
  {
    action: "User account blocked",
    user: "Marcus Lee",
    time: "08:41 AM",
    status: "Recorded",
  },
  {
    action: "Fraud case resolved",
    user: "Sofia Kim",
    time: "07:12 AM",
    status: "Immutable",
  },
];

export default function Audit() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }} contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 56, gap: 16 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 28, fontWeight: "800", color: COLORS.text }}>Audit Trails</Text>
            <Text style={{ marginTop: 4, color: COLORS.textSecondary }}>Immutable blockchain-backed actions</Text>
          </View>

          <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.white, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: COLORS.border }}>
            <Ionicons name="filter" size={20} color={COLORS.textSecondary} />
          </View>
        </View>

        {auditItems.map((item, index) => (
          <View key={index} style={{ backgroundColor: COLORS.white, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: COLORS.border }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ fontSize: 16, fontWeight: "700", color: COLORS.text }}>{item.action}</Text>
              <View style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: "#DCFCE7" }}>
                <Text style={{ color: COLORS.success, fontWeight: "700" }}>{item.status}</Text>
              </View>
            </View>

            <Text style={{ marginTop: 10, color: COLORS.textSecondary }}>By {item.user}</Text>
            <Text style={{ marginTop: 4, color: COLORS.textSecondary }}>{item.time}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

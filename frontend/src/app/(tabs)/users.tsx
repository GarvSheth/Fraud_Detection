import { View, Text, ScrollView, TextInput, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "../../constants/colors";

const users = [
  {
    name: "Ava Patel",
    account: "Checking ••••4821",
    risk: "Medium",
    status: "Active",
  },
  {
    name: "Marcus Lee",
    account: "Savings ••••9120",
    risk: "High",
    status: "Review",
  },
  {
    name: "Sofia Kim",
    account: "Business ••••5532",
    risk: "Low",
    status: "Safe",
  },
];

export default function Users() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }} contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 56, gap: 16 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 28, fontWeight: "800", color: COLORS.text }}>User Management</Text>
            <Text style={{ marginTop: 4, color: COLORS.textSecondary }}>Search accounts and monitor risk profiles</Text>
          </View>

          <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.white, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: COLORS.border }}>
            <Ionicons name="search" size={20} color={COLORS.textSecondary} />
          </View>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: COLORS.white, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, borderColor: COLORS.border }}>
          <Ionicons name="search-outline" size={18} color={COLORS.textSecondary} />
          <TextInput placeholder="Search by name or account" placeholderTextColor={COLORS.textSecondary} style={{ flex: 1, marginLeft: 8, color: COLORS.text }} />
        </View>

        <View style={{ gap: 12 }}>
          {users.map((user, index) => (
            <View key={index} style={{ backgroundColor: COLORS.white, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: COLORS.border }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View>
                  <Text style={{ fontSize: 17, fontWeight: "700", color: COLORS.text }}>{user.name}</Text>
                  <Text style={{ marginTop: 4, color: COLORS.textSecondary }}>{user.account}</Text>
                </View>

                <View style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: user.risk === "High" ? "#FEE2E2" : user.risk === "Medium" ? "#FEF3C7" : "#DCFCE7" }}>
                  <Text style={{ color: user.risk === "High" ? COLORS.danger : user.risk === "Medium" ? COLORS.warning : COLORS.success, fontWeight: "700" }}>{user.risk}</Text>
                </View>
              </View>

              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
                <Text style={{ color: COLORS.textSecondary }}>Status: {user.status}</Text>
                <Pressable style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: COLORS.primary }}>
                  <Text style={{ color: COLORS.white, fontWeight: "600" }}>Review</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
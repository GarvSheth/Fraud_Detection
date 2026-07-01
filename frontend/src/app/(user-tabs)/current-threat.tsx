import { useState } from "react";
import { View, Text, ScrollView, Pressable, Modal } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "../../constants/colors";

const threats = [
  {
    title: "Unusual transfer detected",
    status: "Active",
    risk: "High",
    detail: "A transfer of $3,200 from a new device was flagged for review.",
  },
  {
    title: "High-value merchant payment flagged",
    status: "Monitoring",
    risk: "Medium",
    detail: "A payment of $1,480 at a new merchant is being reviewed for possible fraud.",
  },
  {
    title: "Duplicate card transaction attempt",
    status: "Pending",
    risk: "High",
    detail: "Two similar transactions were detected within minutes and require confirmation.",
  },
];

export default function CurrentThreat() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const { name, userId } = useLocalSearchParams<{ name?: string; userId?: string }>();
  const userName = name || "Sarah Johnson";
  const firstName = userName.split(" ")[0] || userName;
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={{ paddingHorizontal: 20, paddingTop: 56, gap: 16 }}>
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.9)",
              borderRadius: 24,
              padding: 18,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, color: COLORS.primary, fontWeight: "700", textTransform: "uppercase" }}>User Dashboard</Text>
                <Text style={{ fontSize: 24, fontWeight: "800", color: COLORS.text, marginTop: 4 }}>Hello, {firstName}</Text>
                <Text style={{ marginTop: 4, color: COLORS.textSecondary }}>Here are your active transaction threat alerts</Text>
              </View>

              <Pressable
                onPress={() => setMenuOpen(true)}
                style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary, alignItems: "center", justifyContent: "center" }}
              >
                <Ionicons name="menu" size={20} color={COLORS.white} />
              </Pressable>
            </View>
          </View>

          <View style={{ paddingHorizontal: 4 }}>
            <Text style={{ fontSize: 18, fontWeight: "700", color: COLORS.text }}>Current Threat</Text>
          </View>

          {threats.map((threat, index) => (
            <Pressable
              key={index}
              onPress={() => router.push({ pathname: "/user-threat/[id]" as any, params: { id: String(index + 1) } })}
              style={{ backgroundColor: COLORS.white, borderRadius: 22, padding: 18, borderWidth: 1, borderColor: COLORS.border }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ fontSize: 17, fontWeight: "700", color: COLORS.text, flex: 1, marginRight: 10 }}>{threat.title}</Text>
                <View style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: threat.risk === "High" ? "#FEE2E2" : "#FEF3C7" }}>
                  <Text style={{ color: threat.risk === "High" ? COLORS.danger : COLORS.warning, fontWeight: "700" }}>{threat.risk}</Text>
                </View>
              </View>
              <Text style={{ marginTop: 8, color: COLORS.textSecondary }}>{threat.detail}</Text>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                <Text style={{ color: COLORS.textSecondary }}>Status: {threat.status}</Text>
                <View style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: COLORS.primary }}>
                  <Text style={{ color: COLORS.white, fontWeight: "600" }}>Open</Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={menuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuOpen(false)}
      >
        <Pressable style={{ flex: 1, backgroundColor: "rgba(15, 23, 42, 0.35)" }} onPress={() => setMenuOpen(false)}>
          <View style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 280, backgroundColor: COLORS.white, paddingTop: 56, paddingHorizontal: 20, paddingBottom: 24, borderLeftWidth: 1, borderLeftColor: COLORS.border }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: "#DBEAFE", alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontSize: 18, fontWeight: "700", color: COLORS.primary }}>{userInitial}</Text>
              </View>
              <View>
                <Text style={{ fontSize: 16, fontWeight: "700", color: COLORS.text }}>{userName}</Text>
                <Text style={{ color: COLORS.textSecondary }}>{userId ? `User ID #${userId}` : "Personal Account"}</Text>
              </View>
            </View>

            <View style={{ marginTop: 24, gap: 10 }}>
              {[
                { label: "Profile", icon: "person-outline" },
                { label: "Settings", icon: "settings-outline" },
                { label: "Logout", icon: "log-out-outline" },
              ].map((item) => (
                <Pressable key={item.label} onPress={() => setMenuOpen(false)} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 10, borderRadius: 14, backgroundColor: item.label === "Logout" ? "#FEF2F2" : "#F8FAFC" }}>
                  <Ionicons name={item.icon as any} size={18} color={item.label === "Logout" ? COLORS.danger : COLORS.textSecondary} />
                  <Text style={{ marginLeft: 10, color: item.label === "Logout" ? COLORS.danger : COLORS.text, fontWeight: "600" }}>{item.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

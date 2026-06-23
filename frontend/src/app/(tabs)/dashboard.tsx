import { useState } from "react";
import { View, Text, ScrollView, Pressable, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import StatCard from "../../components/StatCard";
import AlertCard from "../../components/AlertCard";
import { COLORS } from "../../constants/colors";

const trendData = [42, 64, 58, 74, 88, 96, 92];
const trendLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const alerts = [
  {
    title: "Unusual transfer from new device",
    severity: "High",
    detail: "Blocked in 12 seconds",
  },
  {
    title: "Multiple failed login attempts",
    severity: "Medium",
    detail: "Requires review",
  },
  {
    title: "Suspicious merchant pattern",
    severity: "High",
    detail: "Escalated to fraud ops",
  },
];

export default function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: COLORS.background,
        }}
      >
        <View
          style={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 220,
            height: 220,
            borderRadius: 110,
            backgroundColor: "#DBEAFE",
            opacity: 0.8,
          }}
        />
        <View
          style={{
            position: "absolute",
            bottom: 120,
            left: -60,
            width: 260,
            height: 260,
            borderRadius: 130,
            backgroundColor: "#E0E7FF",
            opacity: 0.75,
          }}
        />
        <View
          style={{
            position: "absolute",
            top: 180,
            right: 40,
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: "#FDE68A",
            opacity: 0.4,
          }}
        />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View style={{ paddingHorizontal: 20, paddingTop: 56, gap: 16 }}>
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.82)",
              borderRadius: 28,
              padding: 18,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.7)",
              shadowColor: "#000",
              shadowOpacity: 0.08,
              shadowRadius: 16,
              elevation: 3,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, color: COLORS.primary, fontWeight: "700", textTransform: "uppercase" }}>
                  Administrators
                </Text>
                <Text style={{ fontSize: 24, fontWeight: "800", color: COLORS.text, marginTop: 4 }}>
                  Welcome, Nadia
                </Text>
                <Text style={{ marginTop: 4, color: COLORS.textSecondary }}>
                  Live admin overview and active protection
                </Text>
              </View>

              <Pressable
                onPress={() => setMenuOpen(true)}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: COLORS.primary,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="menu" size={20} color={COLORS.white} />
              </Pressable>
            </View>
          </View>

        <View
          style={{
            backgroundColor: COLORS.white,
            borderRadius: 24,
            padding: 20,
            borderWidth: 1,
            borderColor: COLORS.border,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text style={{ color: COLORS.textSecondary, fontSize: 12, textTransform: "uppercase" }}>
                Security Health
              </Text>
              <Text style={{ fontSize: 34, fontWeight: "800", marginTop: 6, color: COLORS.success }}>
                92%
              </Text>
            </View>

            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 999,
                backgroundColor: "#DCFCE7",
              }}
            >
              <Text style={{ color: COLORS.success, fontWeight: "700" }}>Live</Text>
            </View>
          </View>

          <View
            style={{
              height: 10,
              borderRadius: 999,
              backgroundColor: COLORS.border,
              marginTop: 16,
            }}
          >
            <View
              style={{
                width: "92%",
                height: "100%",
                borderRadius: 999,
                backgroundColor: COLORS.success,
              }}
            />
          </View>

          <Text style={{ marginTop: 10, color: COLORS.textSecondary }}>
            Threat response speed improved by 18% this week.
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <StatCard title="Users" value="1,245" color="#2563EB" />
          <StatCard title="Threats" value="124" color="#EF4444" />
          <StatCard title="Audit Logs" value="3,562" color="#8B5CF6" />
          <StatCard title="Open Cases" value="17" color="#F59E0B" />
        </View>

        <View
          style={{
            backgroundColor: COLORS.white,
            borderRadius: 24,
            padding: 20,
            borderWidth: 1,
            borderColor: COLORS.border,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "700", color: COLORS.text }}>
              Threat Trend
            </Text>
            <Text style={{ color: COLORS.textSecondary }}>Last 7 days</Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              height: 140,
              marginTop: 16,
              gap: 8,
            }}
          >
            {trendData.map((height, index) => (
              <View key={index} style={{ flex: 1, alignItems: "center" }}>
                <View
                  style={{
                    width: "100%",
                    height: height,
                    borderRadius: 10,
                    backgroundColor: index === trendData.length - 1 ? COLORS.primary : "#BFDBFE",
                    minHeight: 28,
                  }}
                />
                <Text style={{ marginTop: 8, color: COLORS.textSecondary, fontSize: 11 }}>
                  {trendLabels[index]}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View
          style={{
            backgroundColor: COLORS.white,
            borderRadius: 24,
            padding: 20,
            borderWidth: 1,
            borderColor: COLORS.border,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "700", color: COLORS.text }}>
              Critical Alerts
            </Text>
            <Pressable>
              <Text style={{ color: COLORS.primary, fontWeight: "600" }}>View all</Text>
            </Pressable>
          </View>

          <View style={{ marginTop: 12, gap: 10 }}>
            {alerts.map((alert, index) => (
              <AlertCard key={index} title={alert.title} severity={alert.severity} />
            ))}
          </View>
        </View>
        </View>
      </ScrollView>

      <Modal
        visible={menuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuOpen(false)}
      >
        <Pressable style={{ flex: 1, backgroundColor: "rgba(15, 23, 42, 0.35)" }} onPress={() => setMenuOpen(false)}>
          <View
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: 280,
              backgroundColor: COLORS.white,
              paddingTop: 56,
              paddingHorizontal: 20,
              paddingBottom: 24,
              borderLeftWidth: 1,
              borderLeftColor: COLORS.border,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: "#DBEAFE", alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontSize: 18, fontWeight: "700", color: COLORS.primary }}>N</Text>
              </View>
              <View>
                <Text style={{ fontSize: 16, fontWeight: "700", color: COLORS.text }}>Nadia Carter</Text>
                <Text style={{ color: COLORS.textSecondary }}>Security Admin</Text>
              </View>
            </View>

            <View style={{ marginTop: 24, gap: 10 }}>
              {[
                { label: "Profile", icon: "person-outline" },
                { label: "Settings", icon: "settings-outline" },
                { label: "Security", icon: "shield-outline" },
                { label: "Logout", icon: "log-out-outline" },
              ].map((item) => (
                <Pressable
                  key={item.label}
                  onPress={() => setMenuOpen(false)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 12,
                    paddingHorizontal: 10,
                    borderRadius: 14,
                    backgroundColor: item.label === "Logout" ? "#FEF2F2" : "#F8FAFC",
                  }}
                >
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
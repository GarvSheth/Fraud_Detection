import { View, Text, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "../../constants/colors";

const threatDetails: Record<string, any> = {
  "1": {
    title: "Unusual transfer detected",
    risk: "High",
    status: "Active",
    time: "2 min ago",
    account: "**** 4821",
    location: "New York, US",
    amount: "$3,200",
    merchant: "Skyline Tech",
    summary: "A transfer from a new device was flagged as suspicious due to unusual location and velocity patterns.",
    timeline: [
      { title: "Alert Raised", time: "09:12 AM", note: "System flagged the transfer as unusual." },
      { title: "Risk Review", time: "09:14 AM", note: "Behavioral analysis increased the case risk." },
      { title: "Pending Confirmation", time: "09:18 AM", note: "Awaiting user confirmation or review." },
    ],
  },
  "2": {
    title: "Login from unknown location",
    risk: "Medium",
    status: "Monitoring",
    time: "11 min ago",
    account: "**** 9120",
    location: "Chicago, US",
    amount: "—",
    merchant: "Secure Login",
    summary: "Your account was accessed from a different city and is currently being monitored for fraud.",
    timeline: [
      { title: "Login Attempt", time: "08:44 AM", note: "New sign-in was detected from another region." },
      { title: "Risk Check", time: "08:47 AM", note: "The system flagged the location mismatch." },
      { title: "Monitoring", time: "08:52 AM", note: "The case remains under monitoring." },
    ],
  },
};

export default function UserThreatDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const threat = threatDetails[id ?? "1"];

  if (!threat) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: COLORS.text, fontSize: 16 }}>Threat not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }} contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 56, gap: 16 }}>
        <Pressable onPress={() => router.back()} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
          <Text style={{ color: COLORS.primary, fontWeight: "700" }}>Back to threats</Text>
        </Pressable>

        <View style={{ backgroundColor: COLORS.white, borderRadius: 24, padding: 20, borderWidth: 1, borderColor: COLORS.border }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={{ fontSize: 12, color: COLORS.primary, fontWeight: "700", textTransform: "uppercase" }}>Threat Details</Text>
              <Text style={{ fontSize: 22, fontWeight: "800", color: COLORS.text, marginTop: 6 }}>{threat.title}</Text>
            </View>
            <View style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: threat.risk === "High" ? "#FEE2E2" : "#FEF3C7" }}>
              <Text style={{ color: threat.risk === "High" ? COLORS.danger : COLORS.warning, fontWeight: "700" }}>Risk {threat.risk}</Text>
            </View>
          </View>

          <View style={{ marginTop: 16, gap: 10 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}><Text style={{ color: COLORS.textSecondary }}>Status</Text><Text style={{ color: COLORS.text, fontWeight: "700" }}>{threat.status}</Text></View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}><Text style={{ color: COLORS.textSecondary }}>Account</Text><Text style={{ color: COLORS.text, fontWeight: "700" }}>{threat.account}</Text></View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}><Text style={{ color: COLORS.textSecondary }}>Location</Text><Text style={{ color: COLORS.text, fontWeight: "700" }}>{threat.location}</Text></View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}><Text style={{ color: COLORS.textSecondary }}>Amount</Text><Text style={{ color: COLORS.text, fontWeight: "700" }}>{threat.amount}</Text></View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}><Text style={{ color: COLORS.textSecondary }}>Merchant</Text><Text style={{ color: COLORS.text, fontWeight: "700" }}>{threat.merchant}</Text></View>
          </View>
        </View>

        <View style={{ backgroundColor: COLORS.white, borderRadius: 24, padding: 20, borderWidth: 1, borderColor: COLORS.border }}>
          <Text style={{ fontSize: 18, fontWeight: "700", color: COLORS.text }}>Summary</Text>
          <Text style={{ marginTop: 8, color: COLORS.textSecondary, lineHeight: 22 }}>{threat.summary}</Text>
        </View>

        <View style={{ backgroundColor: COLORS.white, borderRadius: 24, padding: 20, borderWidth: 1, borderColor: COLORS.border }}>
          <Text style={{ fontSize: 18, fontWeight: "700", color: COLORS.text }}>Timeline</Text>
          <View style={{ marginTop: 14, gap: 12 }}>
            {threat.timeline.map((event: any, index: number) => (
              <View key={index} style={{ flexDirection: "row", gap: 12 }}>
                <View style={{ alignItems: "center" }}>
                  <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.primary, marginTop: 4 }} />
                  {index < threat.timeline.length - 1 ? <View style={{ width: 1, flex: 1, backgroundColor: COLORS.border, marginTop: 4 }} /> : null}
                </View>
                <View style={{ flex: 1, paddingBottom: index < threat.timeline.length - 1 ? 10 : 0 }}>
                  <Text style={{ fontWeight: "700", color: COLORS.text }}>{event.title}</Text>
                  <Text style={{ marginTop: 3, color: COLORS.textSecondary }}>{event.time}</Text>
                  <Text style={{ marginTop: 4, color: COLORS.textSecondary }}>{event.note}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 12 }}>
          <Pressable style={{ flex: 1, backgroundColor: COLORS.primary, paddingVertical: 12, borderRadius: 14, alignItems: "center" }}>
            <Text style={{ color: COLORS.white, fontWeight: "700" }}>Resolve</Text>
          </Pressable>
          <Pressable style={{ flex: 1, backgroundColor: "#FDE68A", paddingVertical: 12, borderRadius: 14, alignItems: "center" }}>
            <Text style={{ color: COLORS.text, fontWeight: "700" }}>Raise Query</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

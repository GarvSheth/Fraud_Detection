import { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "../../constants/colors";

type ThreatDetails = {
  threatId: number;
  transactionId: string;
  raisedForUserId: number;
  description: string;
  severity: string;
  status: string;
  createdAt: string;
  resolvedAt?: string | null;
  user: string;
  transaction: {
    accountId: number;
    accountNumber: string;
    amount: number;
    timestamp: string;
    deviceInfo?: string | null;
    location?: string | null;
    merchant?: string | null;
    status: string;
  };
};

function formatRelativeTime(value: string) {
  const time = new Date(value).getTime();

  if (Number.isNaN(time)) {
    return "Unknown time";
  }

  const diffMinutes = Math.max(0, Math.floor((Date.now() - time) / 60000));

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
}

function formatDateTime(value?: string | null) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleString();
}

function formatAmount(value?: number) {
  if (typeof value !== "number") {
    return "Not available";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function getSeverityColor(severity: string) {
  switch (severity.toLowerCase()) {
    case "critical":
    case "high":
      return COLORS.danger;
    case "medium":
      return COLORS.warning;
    default:
      return COLORS.success;
  }
}

function getTimeline(threat: ThreatDetails) {
  const events = [
    {
      title: "Threat Raised",
      time: formatDateTime(threat.createdAt),
      note: threat.description,
    },
    {
      title: "Transaction Captured",
      time: formatDateTime(threat.transaction.timestamp),
      note: `${formatAmount(threat.transaction.amount)} at ${threat.transaction.merchant ?? "unknown merchant"}.`,
    },
    {
      title: "Current Status",
      time: formatRelativeTime(threat.createdAt),
      note: `Case is currently ${threat.status}.`,
    },
  ];

  if (threat.resolvedAt) {
    events.push({
      title: "Resolved",
      time: formatDateTime(threat.resolvedAt),
      note: "The threat was marked resolved.",
    });
  }

  return events;
}

export default function ThreatDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [threat, setThreat] = useState<ThreatDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchThreatDetails();
  }, [id]);

  async function fetchThreatDetails() {
    if (!id) {
      setErrorMessage("Threat not found.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await fetch(`http://localhost:7000/threat/${id}`);

      if (!response.ok) {
        throw new Error("Unable to fetch threat details");
      }

      const data = await response.json();
      setThreat(data);
    } catch (error) {
      console.log(error);
      setThreat(null);
      setErrorMessage("Unable to load threat details.");
    } finally {
      setIsLoading(false);
    }
  }

  const timeline = threat ? getTimeline(threat) : [];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }} contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 56, gap: 16 }}>
        <Pressable onPress={() => router.back()} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
          <Text style={{ color: COLORS.primary, fontWeight: "700" }}>Back to feed</Text>
        </Pressable>

        {isLoading ? (
          <View style={{ backgroundColor: COLORS.white, borderRadius: 24, padding: 20, borderWidth: 1, borderColor: COLORS.border }}>
            <Text style={{ color: COLORS.textSecondary, fontWeight: "600" }}>Loading threat details...</Text>
          </View>
        ) : errorMessage || !threat ? (
          <View style={{ backgroundColor: COLORS.white, borderRadius: 24, padding: 20, borderWidth: 1, borderColor: COLORS.border }}>
            <Text style={{ color: COLORS.danger, fontWeight: "700" }}>{errorMessage || "Threat not found."}</Text>
          </View>
        ) : (
          <>
            <View style={{ backgroundColor: COLORS.white, borderRadius: 24, padding: 20, borderWidth: 1, borderColor: COLORS.border }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text style={{ fontSize: 12, color: COLORS.primary, fontWeight: "700", textTransform: "uppercase" }}>Threat Details</Text>
                  <Text style={{ fontSize: 22, fontWeight: "800", color: COLORS.text, marginTop: 6 }}>{threat.description}</Text>
                </View>
                <View style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: "#FEE2E2" }}>
                  <Text style={{ color: getSeverityColor(threat.severity), fontWeight: "700", textTransform: "capitalize" }}>
                    Risk {threat.severity}
                  </Text>
                </View>
              </View>

              <View style={{ marginTop: 16, gap: 10 }}>
                <DetailRow label="Status" value={threat.status} capitalize />
                <DetailRow label="User" value={threat.user} />
                <DetailRow label="Transaction ID" value={threat.transactionId} />
                <DetailRow label="Location" value={threat.transaction.location ?? "Not available"} />
                <DetailRow label="Amount" value={formatAmount(threat.transaction.amount)} />
                <DetailRow label="Merchant" value={threat.transaction.merchant ?? "Not available"} />
                <DetailRow label="Device" value={threat.transaction.deviceInfo ?? "Not available"} />
                <DetailRow label="Transaction Status" value={threat.transaction.status} capitalize />
              </View>
            </View>

            <View style={{ backgroundColor: COLORS.white, borderRadius: 24, padding: 20, borderWidth: 1, borderColor: COLORS.border }}>
              <Text style={{ fontSize: 18, fontWeight: "700", color: COLORS.text }}>Summary</Text>
              <Text style={{ marginTop: 8, color: COLORS.textSecondary, lineHeight: 22 }}>{threat.description}</Text>
            </View>

            <View style={{ backgroundColor: COLORS.white, borderRadius: 24, padding: 20, borderWidth: 1, borderColor: COLORS.border }}>
              <Text style={{ fontSize: 18, fontWeight: "700", color: COLORS.text }}>Investigation Timeline</Text>
              <View style={{ marginTop: 14, gap: 12 }}>
                {timeline.map((event, index) => (
                  <View key={`${event.title}-${index}`} style={{ flexDirection: "row", gap: 12 }}>
                    <View style={{ alignItems: "center" }}>
                      <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.primary, marginTop: 4 }} />
                      {index < timeline.length - 1 ? <View style={{ width: 1, flex: 1, backgroundColor: COLORS.border, marginTop: 4 }} /> : null}
                    </View>
                    <View style={{ flex: 1, paddingBottom: index < timeline.length - 1 ? 10 : 0 }}>
                      <Text style={{ fontWeight: "700", color: COLORS.text }}>{event.title}</Text>
                      <Text style={{ marginTop: 3, color: COLORS.textSecondary }}>{event.time}</Text>
                      <Text style={{ marginTop: 4, color: COLORS.textSecondary }}>{event.note}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

function DetailRow({ label, value, capitalize = false }: { label: string; value: string; capitalize?: boolean }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
      <Text style={{ color: COLORS.textSecondary }}>{label}</Text>
      <Text
        style={{
          color: COLORS.text,
          fontWeight: "700",
          textAlign: "right",
          textTransform: capitalize ? "capitalize" : "none",
          flex: 1,
        }}
      >
        {value}
      </Text>
    </View>
  );
}

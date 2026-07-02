import { View, Text, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "../../constants/colors";
import { useEffect, useState } from "react";

type ThreatFeedItem = {
  threatId: number;
  description: string;
  severity: string;
  status: string;
  createdAt: string;
  resolvedAt?: string | null;
  user: string;
};

function formatThreatTime(createdAt: string) {
  const createdTime = new Date(createdAt).getTime();

  if (Number.isNaN(createdTime)) {
    return "Unknown time";
  }

  const diffMinutes = Math.max(0, Math.floor((Date.now() - createdTime) / 60000));

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
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

export default function Feed() {
  const router = useRouter();
  const [feed, setFeed] = useState<ThreatFeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchFeed();
  }, []);

  async function fetchFeed() {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await fetch("http://localhost:7000/threat/feed");

      if (!response.ok) {
        throw new Error("Unable to fetch threat feed");
      }

      const data = await response.json();
      setFeed(data);
    } catch (error) {
      console.log(error);
      setErrorMessage("Unable to load threat feed.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }} contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 56, gap: 16 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 28, fontWeight: "800", color: COLORS.text }}>Threat Feed</Text>
          </View>
        </View>

        {isLoading ? (
          <View style={{ backgroundColor: COLORS.white, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: COLORS.border }}>
            <Text style={{ color: COLORS.textSecondary, fontWeight: "600" }}>Loading threat feed...</Text>
          </View>
        ) : errorMessage ? (
          <View style={{ backgroundColor: COLORS.white, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: COLORS.border }}>
            <Text style={{ color: COLORS.danger, fontWeight: "700" }}>{errorMessage}</Text>
          </View>
        ) : feed.length === 0 ? (
          <View style={{ backgroundColor: COLORS.white, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: COLORS.border }}>
            <Text style={{ color: COLORS.textSecondary, fontWeight: "600" }}>No threats found.</Text>
          </View>
        ) : (
          feed.map((item) => (
            <Pressable
              key={item.threatId}
              onPress={() =>
                router.push({ pathname: "/threat/[id]" as any, params: { id: String(item.threatId) } })
              }
              style={{ backgroundColor: COLORS.white, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: COLORS.border }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ fontSize: 16, fontWeight: "700", color: COLORS.text, flex: 1, marginRight: 10 }}>{item.description}</Text>
                <View style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: "#FEE2E2" }}>
                  <Text style={{ color: getSeverityColor(item.severity), fontWeight: "700", textTransform: "capitalize" }}>{item.severity}</Text>
                </View>
              </View>

              <Text style={{ color: COLORS.textSecondary, marginTop: 8 }}>{item.user}</Text>

              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                <Text style={{ color: COLORS.textSecondary }}>{formatThreatTime(item.createdAt)}</Text>
                <View style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: "#F3F4F6" }}>
                  <Text style={{ color: COLORS.text, fontWeight: "600", textTransform: "capitalize" }}>{item.status}</Text>
                </View>
              </View>
            </Pressable>
          ))
        )}
      </View>
    </ScrollView>
  );
}

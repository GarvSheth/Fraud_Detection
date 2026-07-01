import { View, Text, ScrollView } from "react-native";

import { COLORS } from "../../constants/colors";

const historyItems = [
  {
    title: "Resolved: Suspicious login attempt",
    outcome: "Closed successfully",
    time: "Yesterday, 8:10 PM",
  },
  {
    title: "Resolved: Unusual card activity",
    outcome: "Account secured",
    time: "2 days ago",
  },
];

export default function History() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }} contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 56, gap: 16 }}>
        <View>
          <Text style={{ fontSize: 28, fontWeight: "800", color: COLORS.text }}>Threat History</Text>
          <Text style={{ marginTop: 4, color: COLORS.textSecondary }}>Your previously resolved alerts</Text>
        </View>

        {historyItems.map((item, index) => (
          <View key={index} style={{ backgroundColor: COLORS.white, borderRadius: 22, padding: 18, borderWidth: 1, borderColor: COLORS.border }}>
            <Text style={{ fontSize: 17, fontWeight: "700", color: COLORS.text }}>{item.title}</Text>
            <Text style={{ marginTop: 6, color: COLORS.textSecondary }}>{item.outcome}</Text>
            <Text style={{ marginTop: 10, color: COLORS.primary, fontWeight: "600" }}>{item.time}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

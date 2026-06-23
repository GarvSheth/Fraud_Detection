import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Header() {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 25,
      }}
    >
      <View>
        <Text
          style={{
            fontSize: 14,
            color: "#64748B",
          }}
        >
          Welcome back
        </Text>

        <Text
          style={{
            fontSize: 26,
            fontWeight: "700",
          }}
        >
          Security Center
        </Text>
      </View>

      <TouchableOpacity>
        <Ionicons
          name="notifications-outline"
          size={28}
          color="black"
        />
      </TouchableOpacity>
    </View>
  );
}
import { View, Text } from "react-native";

export default function SecurityScore() {
  const score = 87;

  return (
    <View
      style={{
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 24,
        marginBottom: 20,
      }}
    >
      <Text
        style={{
          color: "#64748B",
        }}
      >
        Security Health Score
      </Text>

      <Text
        style={{
          fontSize: 42,
          fontWeight: "700",
          color: "#10B981",
          marginTop: 10,
        }}
      >
        {score}
      </Text>

      <View
        style={{
          marginTop: 15,
          height: 10,
          backgroundColor: "#E2E8F0",
          borderRadius: 10,
        }}
      >
        <View
          style={{
            width: `${score}%`,
            height: 10,
            borderRadius: 10,
            backgroundColor: "#10B981",
          }}
        />
      </View>
    </View>
  );
}
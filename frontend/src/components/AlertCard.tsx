import { View, Text } from "react-native";

type Props = {
  title: string;
  severity: string;
};

export default function AlertCard({
  title,
  severity,
}: Props) {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 18,
        marginBottom: 12,

        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 10,

        elevation: 2,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: "600",
        }}
      >
        {title}
      </Text>

      <Text
        style={{
          marginTop: 6,
          fontWeight: "500",
          color:
            severity === "High"
              ? "#EF4444"
              : "#F59E0B",
        }}
      >
        {severity}
      </Text>
    </View>
  );
}
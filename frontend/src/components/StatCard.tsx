import { View, Text } from "react-native";

type Props = {
  title: string;
  value: string;
  color: string;
};

export default function StatCard({
  title,
  value,
  color,
}: Props) {
  return (
    <View
      style={{
        width: "48%",
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 18,
        marginBottom: 15,

        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 10,

        elevation: 2,
      }}
    >
      <View
        style={{
          width: 12,
          height: 12,
          borderRadius: 6,
          backgroundColor: color,
        }}
      />

      <Text
        style={{
          fontSize: 24,
          fontWeight: "700",
          marginTop: 12,
        }}
      >
        {value}
      </Text>

      <Text
        style={{
          marginTop: 4,
          color: "#64748B",
        }}
      >
        {title}
      </Text>
    </View>
  );
}
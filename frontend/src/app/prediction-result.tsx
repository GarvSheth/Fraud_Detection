import { View, Text, StyleSheet, Pressable } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { COLORS } from "../constants/colors";

export default function PredictionResult() {
  const params = useLocalSearchParams();

  const probability =
    Number(params.fraudProbability ?? 0) * 100;

  const prediction =
    Number(params.prediction);

  const status =
    String(params.status);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Prediction Result
      </Text>

      <View style={styles.card}>

        <Text style={styles.label}>
          Transaction ID
        </Text>

        <Text style={styles.value}>
          {params.transactionId}
        </Text>

        <View style={styles.divider} />

        <Text style={styles.label}>
          Prediction
        </Text>

        <Text
          style={[
            styles.prediction,
            {
              color:
                prediction === 1
                  ? COLORS.danger
                  : COLORS.success,
            },
          ]}
        >
          {prediction === 1
            ? "🚨 Fraud"
            : "✅ Genuine"}
        </Text>

        <View style={styles.divider} />

        <Text style={styles.label}>
          Fraud Probability
        </Text>

        <Text style={styles.value}>
          {probability.toFixed(2)}%
        </Text>

        <View style={styles.divider} />

        <Text style={styles.label}>
          Transaction Status
        </Text>

        <Text
          style={[
            styles.status,
            {
              color:
                status === "blocked"
                  ? COLORS.danger
                  : COLORS.success,
            },
          ]}
        >
          {status.toUpperCase()}
        </Text>

      </View>

      <Pressable
        style={styles.button}
        onPress={() => router.back()}
      >
        <Text style={styles.buttonText}>
          Back
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 25,
    color: COLORS.text,
  },

  card: {
    width: "100%",
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 22,
    elevation: 5,
  },

  label: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 5,
  },

  value: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "600",
  },

  prediction: {
    fontSize: 28,
    fontWeight: "700",
  },

  status: {
    fontSize: 24,
    fontWeight: "700",
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 18,
  },

  button: {
    marginTop: 30,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 50,
    paddingVertical: 14,
    borderRadius: 12,
  },

  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 18,
  },
});
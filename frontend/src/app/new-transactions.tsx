import { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  Switch,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { COLORS } from "../constants/colors";
import { router } from "expo-router";

export default function NewTransaction() {
  const [form, setForm] = useState({
    accountId: "",

    creditScore: "",
    previousFraudCount: "",

    merchantCategory: "Fuel",
    merchantRisk: "Low",

    deviceType: "Android",
    trustedDevice: false,

    city: "Mumbai",
    country: "India",
    locationRisk: "Low",

    amount: "",

    transactionType: "UPI",

    previousBalance: "",
    currentBalance: "",

    isNewDevice: false,
    isNewLocation: false,
  });

  const [loading, setLoading] = useState(false);

  const update = (key: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  async function predict() {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:7000/api/prediction",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            accountId: Number(form.accountId),

            creditScore: Number(form.creditScore),
            previousFraudCount: Number(form.previousFraudCount),

            merchantCategory: form.merchantCategory,
            merchantRisk: form.merchantRisk,

            deviceType: form.deviceType,
            trustedDevice: form.trustedDevice,

            city: form.city,
            country: form.country,
            locationRisk: form.locationRisk,

            amount: Number(form.amount),

            transactionType: form.transactionType,

            previousBalance: Number(form.previousBalance),
            currentBalance: Number(form.currentBalance),

            isNewDevice: form.isNewDevice,
            isNewLocation: form.isNewLocation,
          }),
        }
      );

      const data = await response.json();

      router.push({
        pathname: "/prediction-result",
        params: {
            transactionId: data.transactionId,
            prediction: data.prediction.toString(),
            fraudProbability: data.fraudProbability.toString(),
            status: data.status,
        },
        });
    } catch (e) {
      Alert.alert("Error", "Unable to connect.");
    }

    setLoading(false);
  }

  function Input(
    label: string,
    key: keyof typeof form,
    keyboard: "default" | "numeric" = "default"
  ) {
    return (
      <View style={{ marginBottom: 15 }}>
        <Text
          style={{
            marginBottom: 6,
            fontWeight: "600",
            color: COLORS.text,
          }}
        >
          {label}
        </Text>

        <TextInput
          value={String(form[key])}
          keyboardType={keyboard}
          onChangeText={(t) => update(key, t)}
          style={{
            borderWidth: 1,
            borderColor: COLORS.border,
            borderRadius: 10,
            padding: 12,
            backgroundColor: COLORS.white,
          }}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
      }}
      contentContainerStyle={{
        padding: 20,
        paddingBottom: 60,
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: "700",
          marginBottom: 20,
          color: COLORS.text,
        }}
      >
        Test Transaction
      </Text>

      {Input("User ID", "accountId", "numeric")}

      {Input("Credit Score", "creditScore", "numeric")}

      {Input("Previous Fraud Count", "previousFraudCount", "numeric")}

      <Text style={{ marginBottom: 5 }}>Merchant Category</Text>

      <Picker
        selectedValue={form.merchantCategory}
        onValueChange={(v) => update("merchantCategory", v)}
      >
        <Picker.Item label="Fuel" value="Fuel" />
        <Picker.Item label="E-commerce" value="E-commerce" />
        <Picker.Item label="Restaurant" value="Restaurant" />
        <Picker.Item label="Travel" value="Travel" />
        <Picker.Item label="Grocery" value="Grocery" />
        <Picker.Item label="Healthcare" value="Healthcare" />
        <Picker.Item label="Entertainment" value="Entertainment" />
        <Picker.Item label="Luxury" value="Luxury" />
      </Picker>

      <Text style={{ marginBottom: 5 }}>Merchant Risk</Text>

      <Picker
        selectedValue={form.merchantRisk}
        onValueChange={(v) => update("merchantRisk", v)}
      >
        <Picker.Item label="Low" value="Low" />
        <Picker.Item label="Medium" value="Medium" />
        <Picker.Item label="High" value="High" />
      </Picker>

      <Text style={{ marginBottom: 5 }}>Device Type</Text>

      <Picker
        selectedValue={form.deviceType}
        onValueChange={(v) => update("deviceType", v)}
      >
        <Picker.Item label="Android" value="Android" />
        <Picker.Item label="iPhone" value="iPhone" />
        <Picker.Item label="Laptop" value="Laptop" />
        <Picker.Item label="Tablet" value="Tablet" />
      </Picker>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginVertical: 12,
        }}
      >
        <Text>Trusted Device</Text>

        <Switch
          value={form.trustedDevice}
          onValueChange={(v) => update("trustedDevice", v)}
        />
      </View>

      {Input("City", "city")}

      {Input("Country", "country")}

      <Text style={{ marginBottom: 5 }}>Location Risk</Text>

      <Picker
        selectedValue={form.locationRisk}
        onValueChange={(v) => update("locationRisk", v)}
      >
        <Picker.Item label="Low" value="Low" />
        <Picker.Item label="Medium" value="Medium" />
        <Picker.Item label="High" value="High" />
      </Picker>

      {Input("Amount", "amount", "numeric")}

      <Text style={{ marginBottom: 5 }}>Transaction Type</Text>

      <Picker
        selectedValue={form.transactionType}
        onValueChange={(v) => update("transactionType", v)}
      >
        <Picker.Item label="UPI" value="UPI" />
        <Picker.Item label="Credit Card" value="Credit Card" />
        <Picker.Item label="Debit Card" value="Debit Card" />
        <Picker.Item label="Wallet" value="Wallet" />
        <Picker.Item label="Net Banking" value="Net Banking" />
      </Picker>

      {Input("Previous Balance", "previousBalance", "numeric")}

      {Input("Current Balance", "currentBalance", "numeric")}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginVertical: 10,
        }}
      >
        <Text>New Device</Text>

        <Switch
          value={form.isNewDevice}
          onValueChange={(v) => update("isNewDevice", v)}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 25,
        }}
      >
        <Text>New Location</Text>

        <Switch
          value={form.isNewLocation}
          onValueChange={(v) => update("isNewLocation", v)}
        />
      </View>

      <Pressable
        onPress={predict}
        style={{
          backgroundColor: COLORS.primary,
          padding: 16,
          borderRadius: 12,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 16,
            fontWeight: "700",
          }}
        >
          {loading ? "Predicting..." : "Predict Fraud"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}
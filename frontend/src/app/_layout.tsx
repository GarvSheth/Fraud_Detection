import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="user/[id]" />
      <Stack.Screen name="threat/[id]" />
      <Stack.Screen name="threat/timeline" />
      <Stack.Screen name="audit-logs" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}
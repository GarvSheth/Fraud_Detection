import { Redirect } from "expo-router";

export default function DashboardUser() {
  return <Redirect href="/(user-tabs)/current-threat" />;
}

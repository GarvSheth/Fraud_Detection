import { View, Text, ScrollView, TextInput, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "../../constants/colors";

import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

export default function Users() {

  const [users, setUsers] = useState([]);
  const [searchId, setSearchId] = useState("");
  const router = useRouter();

    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        try {
            const response = await fetch(
                "http://localhost:7000/api/users"
            );

            const data = await response.json();

            setUsers(data);
        } catch (error) {
            console.log(error);
        }
    }

    const filteredUsers = users.filter((user: any) => {
      if (user.role !== "user") return false;

      if (searchId.trim() === "") return true;

      return user.userId.toString() === searchId.trim();
    });

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }} contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 56, gap: 16 }}>

        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 28, fontWeight: "800", color: COLORS.text }}>User Management</Text>
            <Text style={{ marginTop: 4, color: COLORS.textSecondary }}>Search accounts and monitor risk profiles</Text>
          </View>

          <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.white, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: COLORS.border }}>
            <Ionicons name="search" size={20} color={COLORS.textSecondary} />
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: COLORS.white,
            borderRadius: 16,
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderWidth: 1,
            borderColor: COLORS.border,
            marginTop: 12,
          }}
        >
          <Ionicons
            name="search-outline"
            size={20}
            color={COLORS.textSecondary}
          />

          <TextInput
            placeholder="Search by User ID..."
            placeholderTextColor={COLORS.textSecondary}
            keyboardType="numeric"
            value={searchId}
            onChangeText={setSearchId}
            style={{
              flex: 1,
              marginLeft: 10,
              color: COLORS.text,
              fontSize: 16,
            }}
          />
        </View>

        <View style={{ gap: 12 }}>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user: any) => (
              <View
                key={user.userId}
                style={{
                  backgroundColor: COLORS.white,
                  borderRadius: 20,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "700",
                      color: COLORS.primary,
                      width: 40,
                    }}
                  >
                    #{user.userId}
                  </Text>

                  <Text
                    style={{
                      flex: 1,
                      fontSize: 17,
                      fontWeight: "700",
                      color: COLORS.text,
                      marginLeft: 16,
                    }}
                  >
                    {user.name}
                  </Text>

                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname: "/(user-tabs)/current-threat" as any,
                        params: {
                          userId: String(user.userId),
                          name: user.name,
                        },
                      })
                    }
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 8,
                      borderRadius: 999,
                      backgroundColor: COLORS.primary,
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.white,
                        fontWeight: "600",
                      }}
                    >
                      Review
                    </Text>
                  </Pressable>
                </View>
              </View>
            ))
          ) : (
            <View
              style={{
                backgroundColor: COLORS.white,
                padding: 20,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: COLORS.border,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: COLORS.textSecondary,
                  fontWeight: "600",
                }}
              >
                No User ID exists.
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

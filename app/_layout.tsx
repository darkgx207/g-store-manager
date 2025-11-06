import { initDatabase } from "@/database/database";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function mainContainer() {
  const theme = useColorScheme();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingBottom: 0,
        paddingTop: 0,
        backgroundColor: "#0007",
      }}
      edges={{ bottom: "off", top: "additive" }}
    >
      <StatusBar
        backgroundColor="black"
        style={theme === "dark" ? "dark" : "light"}
        translucent={false}
      />
      <SQLiteProvider databaseName="database.db" onInit={initDatabase}>
        <Stack screenOptions={{ animation: "slide_from_bottom" }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </SQLiteProvider>
    </SafeAreaView>
  );
}

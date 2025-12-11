import { Stack } from "expo-router";
import "../global.css";
import { UserProvider } from "../src/utils/UserContext";

export default function RootLayout() {
  return (
    <UserProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#f8fafc' },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="home" />
        <Stack.Screen name="workshop/[id]" />
        <Stack.Screen name="registration/[id]" />
        <Stack.Screen name="organizer/dashboard" />
        <Stack.Screen name="organizer/create" />
        <Stack.Screen name="organizer/workshop/[id]" />
      </Stack>
    </UserProvider>
  );
}

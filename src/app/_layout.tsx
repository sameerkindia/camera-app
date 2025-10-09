import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerTintColor: "blue" }}>
      <Stack.Screen name="index" options={{ title: "home" }} />
      <Stack.Screen name="camera" options={{ headerShown: false }} />
    </Stack>
  );
}

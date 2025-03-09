import { Stack } from "expo-router";
import React from "react";
import { Button, View, Text } from "react-native";

export default function StackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="explore" />
    </Stack>
  );
}

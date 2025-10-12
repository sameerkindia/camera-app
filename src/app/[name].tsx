import { View, Text } from "react-native";
import React from "react";
import { Link, Stack, useLocalSearchParams } from "expo-router";

const camera = () => {
  const { name } = useLocalSearchParams<{ name: string }>();
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Stack.Screen options={{title: name}} />
      <Text style={{ fontSize: 24, fontWeight: "600" }}>
        Image detail : {name}
      </Text>
      <Link href="/">home</Link>
    </View>
  );
};

export default camera;

import { View, Text, Pressable, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { Link } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
// import * as FileSystem from "expo-file-system";

const homeScreen = () => {

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "600" }}>home screen</Text>

      <Link href="/image-1">image 1</Link>
      <Link href="/image-2">image 2</Link>
      <Link href="/image-3">image 3</Link>

      <Link href="/camera" asChild>
        <Pressable style={style.floatingButton}>
          <MaterialIcons name="photo-camera" size={30} color="white" />
        </Pressable>
      </Link>
    </View>
  );
};

export default homeScreen;

const style = StyleSheet.create({
  floatingButton: {
    backgroundColor: "royalblue",
    padding: 15,
    borderRadius: 50,
    position: "absolute",
    bottom: 10,
    right: 10,
  },
});

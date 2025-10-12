import { View, Text, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { Link, router, Stack, useLocalSearchParams } from "expo-router";
import * as FileSystem from "expo-file-system";
import { MaterialIcons } from "@expo/vector-icons";

const camera = () => {
  const { name } = useLocalSearchParams<{ name: string }>();

  // const [uri, setUri] = useState<string | null>(null);
  // const fileName = name ; // 👈 the name of your saved image
  const fullUri = FileSystem.Paths.document.uri + name;

  // console.log(FileSystem.Paths.document, "This is document")

  // useEffect(() => {
  //   const fullUri = FileSystem.Paths.document.uri + name;
  //   // FileSystem.Paths.get('document').uri

  //   console.log(fullUri , "this is full uri")

  //   // ✅ Optional check if file exists
  //   const file = new FileSystem.File(fullUri);
  //   console.log(file , 'this is file')
  //   if (file.exists) {
  //     setUri(file.uri);
  //   } else {
  //     console.log('❌ Image not found');
  //     setUri(null);
  //   }
  //   console.log(uri , 'this is uri')

  // }, []);

  const onDelete = async () => {
    // await FileSystem.deleteAsync(uri)
    const file = new FileSystem.File(fullUri);
    // console.log(file, 'this is file')
    await file.delete();
    router.back()
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Stack.Screen
        options={{
          title: "Media",
          headerRight: () => (
            <View style={{ flexDirection: "row", gap: 5 }}>
              <MaterialIcons
                onPress={onDelete}
                name="delete"
                size={26}
                color="crimson"
              />
              <MaterialIcons
                onPress={() => {}}
                name="save"
                size={26}
                color="dimgray"
              />
            </View>
          ),
        }}
      />
      <Image
        source={{ uri: fullUri }}
        style={{ height: "100%", width: "100%" }}
      />
      {/* <Text style={{ fontSize: 24, fontWeight: "600" }}>
        Image detail : {name}
      </Text> */}
      {/* <Link href="/">home</Link> */}
    </View>
  );
};

export default camera;

import { View, Text, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { Link, router, Stack, useLocalSearchParams } from "expo-router";
import * as FileSystem from "expo-file-system";
import { MaterialIcons } from "@expo/vector-icons";
import { getFileType } from "../utils/fileType";
import { useVideoPlayer, VideoView } from "expo-video";
import * as MediaLibrary from "expo-media-library";

const camera = () => {
  const { name } = useLocalSearchParams<{ name: string }>();
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  const fullUri = FileSystem.Paths.document.uri + name;
  const type = getFileType(fullUri);
  const player = useVideoPlayer(fullUri, (player) => {
    player.loop = true;
    player.play();
  });

  const onDelete = async () => {
    // await FileSystem.deleteAsync(uri)
    const file = new FileSystem.File(fullUri);
    // console.log(file, 'this is file')
    await file.delete();
    router.back();
  };

  const onSave = async () => {
    if (permissionResponse!.status !== "granted") {
      await requestPermission();
    }

    const fetchedAlbums = await MediaLibrary.createAssetAsync(fullUri)
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
                onPress={onSave}
                name="save"
                size={26}
                color="dimgray"
              />
            </View>
          ),
        }}
      />
      {type === "image" && (
        <Image
          source={{ uri: fullUri }}
          style={{ height: "100%", width: "100%" }}
        />
      )}
      {type === "video" && (
        <VideoView player={player} style={{ width: "100%", flex: 1 }} />
      )}
    </View>
  );
};

export default camera;

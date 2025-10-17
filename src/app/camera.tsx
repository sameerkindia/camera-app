import {
  View,
  StyleSheet,
  Pressable,
  Image,
  Button,
  Alert,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { router } from "expo-router";
import {
  CameraCapturedPicture,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { File, Paths } from "expo-file-system";
import { useVideoPlayer, VideoView } from "expo-video";
import {
  useAudioRecorder,
  AudioModule,
  RecordingPresets,
  useAudioPlayer,
} from "expo-audio";
import * as MediaLibrary from "expo-media-library";

const cameraScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const [ready, setReady] = useState(false);
  const [facing, setFacing] = useState<CameraType>("back");
  const camera = useRef<CameraView>(null);
  const [picture, setPicture] = useState<CameraCapturedPicture>();
  const [isRecording, setIsRecording] = useState<Boolean>(false);
  const [video, setVideo] = useState<string | undefined>();
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const player = useVideoPlayer({ uri: video }, (p) => {
    p.play();
  });
  // const player = video
  //   ? useVideoPlayer({ uri: video }, (p) => {
  //       p.play();
  //     })
  //   : null;

  useEffect(() => {
    (async () => {
      if (permission && !permission.granted && permission.canAskAgain) {
        requestPermission();
      }

      if (!mediaPermission?.granted) {
        await requestMediaPermission();
      }

      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        alert("Microphone permission is required");
      }
    })();
  }, [permission, mediaPermission]);

  // const stopRecording = async () => {
  //   await recorder.stop();
  //   const uri = recorder.uri;
  //   setRecordingUri(uri);

  //   // now load into player
  //   player.loadAsync({ uri });
  //   setPlayerReady(true);
  // };

  const handleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  const takePicture = async () => {
     if (isRecording) {
        await camera.current?.stopRecording();
        setIsRecording(false);
        await new Promise((r) => setTimeout(r, 300));
      }

    if (!ready) {
      Alert.alert("Camera is not ready yet");
      return;
    }

    if (camera.current) {
      const res = await camera.current?.takePictureAsync();
      setPicture(res);
    }
  };

  const startRecording = async () => {
    setIsRecording(true);
    const res = await camera.current?.recordAsync({ maxDuration: 60 });

    // Audio recording
    await recorder.prepareToRecordAsync();
    recorder.record();

    setIsRecording(false);
    setVideo(res?.uri);
  };

  const onPress = async () => {
    if (isRecording) {
      camera.current?.stopRecording();
      await recorder.stop();
    } else {
      takePicture();
    }
  };

  const saveFile = async (uri: string) => {
    try {
      // Step 1: Create a File object from the source URI
      const srcFile = new File(uri);

      // Step 2: Check if the file exists (READ permission required)
      if (!srcFile.exists) {
        throw new Error("Source file does not exist or no READ permission");
      }

      // Step 3: Prepare destination file inside document directory
      const fileName = srcFile.name || `photo_${Date.now()}.jpg`;
      const destFile = new File(Paths.document, fileName);

      // Step 4: Copy source file to destination
      srcFile.copy(destFile);

      // console.log('✅ File saved at:', destFile.uri);

      setPicture(undefined);
      setVideo(undefined);
      router.back();

      // return destFile.uri;
    } catch (error) {
      console.error("❌ Error saving file:", error);
      throw error;
    }
  };

  if (picture || video) {
    return (
      <View style={{ flex: 1 }}>
        {picture && (
          <Image
            source={{ uri: picture.uri }}
            style={{ width: "100%", flex: 1 }}
          />
        )}

        {video && player && (
          <VideoView player={player} style={{ width: "100%", flex: 1 }} />
        )}

        <View style={{ padding: 10 }}>
          <SafeAreaView edges={["bottom"]}>
            <Button
              title="Save"
              // onPress={() => saveFile(picture?.uri || video)}
              onPress={() => {
                if (picture?.uri) saveFile(picture.uri);
                else if (video) saveFile(video);
              }}
            />
          </SafeAreaView>
        </View>
        <MaterialIcons
          onPress={() => {
            setPicture(undefined);
            setVideo(undefined);
          }}
          name="close"
          size={35}
          color="white"
          style={{ position: "absolute", top: 50, left: 50 }}
        />
      </View>
    );
  }

  return (
    <>
      <View>
        <CameraView
          style={styles.cameraView}
          facing={facing}
          ref={camera}
          mode="video"
          onCameraReady={() => setReady(true)}
        />
        <View style={styles.footer}>
          <View />
          <Pressable
            style={[
              styles.recordButton,
              { backgroundColor: isRecording ? "crimson" : "white" },
            ]}
            onPress={onPress}
            onLongPress={startRecording}
          />
          <MaterialIcons
            name="flip-camera-ios"
            size={24}
            color={"white"}
            onPress={handleFacing}
          />
        </View>
        {/* <Text style={{fontSize: 24, fontWeight: '600'}}>image screen</Text> */}
        {/* <Link href="/">home</Link> */}

        <MaterialIcons
          name="close"
          color={"white"}
          style={styles.close}
          size={30}
          onPress={() => router.back()}
        />
      </View>
    </>
  );
};

export default cameraScreen;

const styles = StyleSheet.create({
  cameraView: { width: "100%", height: "100%" },
  close: {
    position: "absolute",
    top: 50,
    left: 50,
  },
  recordButton: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: "white",
  },
  footer: {
    position: "absolute",
    marginTop: "auto",
    width: "100%",
    bottom: 0,
    padding: 20,
    paddingBottom: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#00000099",
  },
});

//  const saveFile = async (uri: string)=>{
//       // const filename = path.parse(uri).base
//       // const file = new File(Paths.cache.uri, Paths.cache.uri , 'new-images');
//       const file = new File(Paths.cache.uri, 'new-images', 'image.jpg')
//       const fileCreated = file.create()
//       console.log(Paths.cache.uri , " this is file")
//       // await file.copy(Paths.cache.uri)

//       console.log(fileCreated,  "working")

//       // await FileSystem.copyAsync({
//       //   from: uri,
//       //   to: FileSystem.documentDirectory
//       // })
//  }

//  const saveFile = async (uri: string) => {
//   // try {
//   //       if (Platform.OS === 'android') {
//   //     const granted = await PermissionsAndroid.request(
//   //       PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
//   //     );

//   //     if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//   //       console.log('❌ Permission denied');
//   //       return;
//   //     }
//   //   }
//   //   // 🔸 Create File object from original URI
//   //   const sourceFile = new FileSystem.File(uri);
//   //   console.log(sourceFile , "this is source file")

//   //   // 🧾 Auto-generate filename from the original name
//   //   const fileName = sourceFile.name || `file_${Date.now()}`;
//   //   console.log(fileName , "this is source file name")

//   //   const mimeType = sourceFile.type || 'image/jpeg';
//   //   console.log(mimeType , "this is source file mime ttype")

//   //   // 📁 Create directory for saved files
//   //   const documentsDir = new FileSystem.Directory(FileSystem.Paths.document.uri);
//   //   console.log(documentsDir , "this is directory")

//   //   // ✅ Create file in the directory with the same name
//   //   const destinationFile = await documentsDir.createFile(fileName, mimeType);
//   //   console.log(destinationFile , "this is destination file")

//   //   // 📥 Copy the file
//   //   await sourceFile.copy(destinationFile);

//   //   console.log('✅ File saved at:', destinationFile.uri);
//   //   return destinationFile.uri;
//   // } catch (error) {
//   //   console.error('❌ Error saving file:', error);
//   //   throw error;
//   // }

//   console.log('working')

//   //   try {
//   //   const fileName = uri.split('/').pop();
//   //   const destinationUri = FileSystem.Paths.document.uri + fileName;

//   //   const base64 = await FileSystem.readAsStringAsync(uri, {
//   //     encoding: FileSystem.EncodingType.Base64,
//   //   });

//   //   await FileSystem.writeAsStringAsync(destinationUri, base64, {
//   //     encoding: FileSystem.EncodingType.Base64,
//   //   });

//   //   console.log('✅ File saved at:', destinationUri);
//   //   return destinationUri;
//   // } catch (error) {
//   //   console.error('❌ Error saving file:', error);
//   //   throw error;
//   // }

//   //   try {
//   //   // Get a reference to the file object
//   //   const sourceFile = await FileSystem.getFileInfoAsync(sourceUri);
//   //   if (!sourceFile.exists) {
//   //     console.log('❌ Source file not found!');
//   //     return;
//   //   }

//   //   // Build target URI inside app's document directory
//   //   const targetUri = FileSystem.documentDirectory + fileName;

//   //   // Create a new File handle at the target location
//   //   const targetFile = await FileSystem.getFileForUriAsync(targetUri);

//   //   // Copy file from cache to document directory
//   //   await targetFile.copyFromAsync(sourceUri, mimeType);

//   //   console.log('✅ File saved at:', targetUri);
//   // } catch (error) {
//   //   console.error('❌ Error saving file:', error);
//   // }

//     try {
//     // Step 1: Create a File object from the source URI
//     const srcFile = new File(uri);

//     // Step 2: Check if the file exists (READ permission required)
//     if (!srcFile.exists) {
//       throw new Error('Source file does not exist or no READ permission');
//     }

//     // Step 3: Prepare destination file inside document directory
//     const fileName = srcFile.name || `photo_${Date.now()}.jpg`;
//     const destFile = new File(Paths.document, fileName);

//     // Step 4: Copy source file to destination
//     srcFile.copy(destFile);

//     console.log('✅ File saved at:', destFile.uri);

//     setPicture(undefined)
//     router.back()

//     // return destFile.uri;
//   } catch (error) {
//     console.error('❌ Error saving file:', error);
//     throw error;
//   }
// }

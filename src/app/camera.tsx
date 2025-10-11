import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Image,
  Button,
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
// import { File, Directory, Paths } from "expo-file-system";
// import * as FileSystem from 'expo-file-system'
import * as FileSystem from 'expo-file-system'
import { File, Paths } from "expo-file-system";
// import { ActivityIndicator } from "react-native/types_generated/index";

const cameraScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  const camera = useRef<CameraView>(null);
  const [picture, setPicture] = useState<CameraCapturedPicture>();

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission]);

  const handleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  const takePicture = async () => {
    const res = await camera.current?.takePictureAsync();
    setPicture(res);
  };


 const saveFile = async (uri: string) => {
    try {
    // Step 1: Create a File object from the source URI
    const srcFile = new File(uri);

    // Step 2: Check if the file exists (READ permission required)
    if (!srcFile.exists) {
      throw new Error('Source file does not exist or no READ permission');
    }

    // Step 3: Prepare destination file inside document directory
    const fileName = srcFile.name || `photo_${Date.now()}.jpg`;
    const destFile = new File(Paths.document, fileName);

    // Step 4: Copy source file to destination
    srcFile.copy(destFile);


    // console.log('✅ File saved at:', destFile.uri);

    setPicture(undefined)
    router.back()

    // return destFile.uri;
  } catch (error) {
    console.error('❌ Error saving file:', error);
    throw error;
  }
}


  if (picture) {
    return (
      <View style={{flex: 1}}>
        <Image
          source={{ uri: picture.uri }}
          style={{ width: "100%", flex: 1 }}
        />
        <View style={{ padding: 10 }}>
          <SafeAreaView edges={["bottom"]} >
            <Button title="Save" onPress={()=>saveFile(picture.uri)} />
          </SafeAreaView>
        </View>
        <MaterialIcons
          onPress={() => {
            setPicture(undefined);
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
        <CameraView style={styles.cameraView} facing={facing} ref={camera}>
          <View style={styles.footer}>
            <View />
            <Pressable style={styles.recordButton} onPress={takePicture} />
            <MaterialIcons
              name="flip-camera-ios"
              size={24}
              color={"white"}
              onPress={handleFacing}
            />
          </View>
        </CameraView>
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
    marginTop: "auto",
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
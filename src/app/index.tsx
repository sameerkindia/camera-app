import {
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Link, useFocusEffect } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
// import { Directory, Paths } from "expo-file-system";
import * as FileSystem from "expo-file-system";
import { FileType, getFileType } from "../utils/fileType";
import { useVideoPlayer } from "expo-video";

type Media = {
  name: string;
  uri: string;
  fileType: FileType;
};

const homeScreen = () => {
  const [images, setImages] = useState<Media[]>([]);
  // useEffect(() => {
  //   loadFiles();
  // }, []);

  useFocusEffect(
    useCallback(() => {
      loadFiles();
    }, [])
  );

  const loadFiles = async () => {
    try {
      const docDir = new FileSystem.Directory(FileSystem.Paths.document);

      if (!docDir.exists) {
        console.log("Document directory does not exist");
        setImages([]);
        return;
      }

      const allFiles = docDir.list();
      const imageUris: Media[] = [];

      for (const file of allFiles) {
        if ("list" in file) {
          // console.log(file.list(), "new");
          // Optional: if you ever save inside subdirectories like /images
          const subItems = file.list();
          for (const sub of subItems) {
            if (!("list" in sub) && isMediaFile(sub.uri)) {
              imageUris.push({
                name: extractFileName(sub.uri),
                uri: sub.uri,
                fileType: getFileType(sub.uri),
              });
            }
          }
        } else if (isMediaFile(file.uri)) {
          imageUris.push({
            name: extractFileName(file.uri),
            uri: file.uri,
            fileType: getFileType(file.uri),
          });
        }
      }

      // console.log("✅ Loaded image URIs:", JSON.stringify(imageUris));
      setImages(imageUris);
    } catch (error) {
      console.error("❌ Error loading files:", error);
      setImages([]);
    }
  };

  // Helper function to filter only image files
  // const isImageFile = (uri: string) => {
  //   return uri.match(/\.(jpg|jpeg|png|gif|heic|webp)$/i);
  // };

  const isMediaFile = (uri: string) => {
    return uri.match(/\.(jpg|jpeg|png|gif|heic|webp|mp4|mov|avi|mkv|webm)$/i);
  };

  const extractFileName = (uri: string) => {
    return uri.substring(uri.lastIndexOf("/") + 1);
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={images}
        numColumns={3}
        contentContainerStyle={{ gap: 1 }}
        columnWrapperStyle={{ gap: 1 }}
        renderItem={(image) => (
          <Link href={`/${image.item.name}`} asChild>
            <Pressable style={{ flex: 1, maxWidth: "33.33%" }}>
              {image.item.fileType === "image" && (
                <Image
                  source={{ uri: image.item.uri }}
                  style={{ aspectRatio: 3 / 4, borderRadius: 5 }}
                />
              )}

              {image.item.fileType === "video" && (
                <>
                  <MaterialIcons
                    name="play-circle-outline"
                    style={{ position: "absolute" }}
                    size={30}
                    color="white"
                  />
                  <Image
                    source={{ uri: image.item.uri }}
                    style={{ aspectRatio: 3 / 4, borderRadius: 5 }}
                  />
                </>
              )}
            </Pressable>
          </Link>
        )}
      />
      {/* <Text style={{ fontSize: 24, fontWeight: "600" }}>home screen</Text> */}

      {/* <Link href="/image-1">image 1</Link>
      <Link href="/image-2">image 2</Link>
      <Link href="/image-3">image 3</Link> */}

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

// const loadScreen = async () => {
//   try {
//     // Step 1: Access the document directory
//     const dir = new Directory(Paths.document);

//     // Step 2: Get the list of files inside
//     const files = dir.read(); // returns an array of File and Directory objects

//     // Step 3: Filter only image files (optional)
//     const imageFiles = files
//       .filter((item) => item instanceof File)
//       .map((file: any) => file.uri);

//     setImages(imageFiles);
//   } catch (error) {
//     console.error('❌ Error loading images:', error);
//   }
// };

//   const loadScreen3 = async () => {
//   try {
//     const docDir = new FileSystem.Directory(FileSystem.Paths.document);

//     if (!docDir.exists) {
//       console.log('Document directory does not exist');
//       setImages([]);
//       return;
//     }

//     // list() returns an array of File or Directory objects
//     const entries = docDir.list();

//     const imageUris: string[] = [];

//     for (const entry of entries) {
//       // The easiest safe check: Directory objects have `.list()` method; File objects do not.
//       if ('list' in entry) {
//         // It's a subdirectory → optional recursion
//         const subItems = entry.list();
//         for (const sub of subItems) {
//           if (!('list' in sub)) {
//             imageUris.push(sub.uri);
//           }
//         }
//       } else {
//         // It's a file
//         imageUris.push(entry.uri);
//       }
//     }

//     console.log('✅ Loaded image URIs:', imageUris);
//     setImages(imageUris);
//   } catch (error) {
//     console.error('❌ Error loading files:', error);
//     setImages([]);
//   }
// };

//   const loadScreen2 = async () => {
//   try {
//     // Use the new Paths + Directory API
//     const docDir = new FileSystem.Directory(FileSystem.Paths.document);

//     if (!docDir.exists) {
//       console.log('📂 Document directory does not exist');
//       setImages([]);
//       return;
//     }

//     // List all entries (files + folders)
//     const entries = docDir.list();

//     const uris: string[] = [];

//     // Loop manually (avoid instanceof — safer for TS)
//     // for (const entry of entries) {
//     //   // The new API gives you `.type` to check if it's file or directory
//     //   if (entry.type === 'file') {
//     //     uris.push(entry.uri);
//     //   } else if (entry.type === 'directory') {
//     //     // optional: if you want to also include subfolder images
//     //     const subEntries = entry.list();
//     //     for (const sub of subEntries) {
//     //       if (sub.type === 'file') uris.push(sub.uri);
//     //     }
//     //   }
//     // }

//     console.log('✅ Found files:', uris);
//     setImages(uris);
//   } catch (err) {
//     console.error('❌ Error loading files:', err);
//     setImages([]);
//   }
// };

//   const loadScreen = async () => {
//   try {
//     // Create a Directory object pointing to the document directory
//     const docDir = new Directory(Paths.document);

//     // If it doesn't exist or isn't readable, set empty and return
//     if (!docDir.exists) {
//       setImages([]);
//       return;
//     }

//     console.log(docDir , "this is doc")

//     // list() returns (File | Directory)[]
//     const items = docDir.list();

//     // recursively collect file URIs
//     const collectFileUris = (entries: (File | Directory)[]): string[] => {
//       const out: string[] = [];
//       for (const e of entries) {
//         if (e instanceof FileSystem.File) {
//           out.push(e.uri);
//         } else if (e instanceof Directory) {
//           // recurse into subdirectory
//           out.push(...collectFileUris(e.list()));
//         }
//       }
//       return out;
//     };

//     const uris = collectFileUris(items);

//     // put URIs in state for rendering
//     setImages(uris);
//   } catch (err) {
//     console.error('Error loading images:', err);
//     setImages([]);
//   }
// };

// useEffect(() => {
//   loadScreen();
// }, []);

// const loadScreen = async () => {
//   // const FileSystem = new File()
//   // const res = await FileSystem
//   try {
//     // if (!FileSystem.readDirectoryAsync) {
//     //   return;
//     // }

//     // const directoryContents = await FileSystem.readDirectoryAsync(
//     //   FileSystem.documentDirectory
//     // );

//         // Get the document directory path correctly
//   // const documentDirectory = await FileSystem.documentDirectory();
//   const directoryContents = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);

//   // Read the directory contents
//   const directoryContents = await FileSystem.readDirectoryAsync(documentDirectory);

//   console.log(directoryContents);
//   } catch (err) {}

//   // const res = await FileSystem.readDirectoryAsync(
//   //   FileSystem.documentDirectory()
//   // )

//   // console.log(res)
// };

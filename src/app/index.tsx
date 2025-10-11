import { View, Text, Pressable, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { Link } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
// import { Directory, Paths } from "expo-file-system";
import * as FileSystem from "expo-file-system";

const homeScreen = () => {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    loadScreen();
  }, []);

  const loadScreen = async () => {
    try {
      const docDir = new FileSystem.Directory(FileSystem.Paths.document);

      if (!docDir.exists) {
        console.log("Document directory does not exist");
        setImages([]);
        return;
      }

      const entries = docDir.list();
      const imageUris: string[] = [];

      for (const entry of entries) {
        if ("list" in entry) {
          // Optional: if you ever save inside subdirectories like /images
          const subItems = entry.list();
          for (const sub of subItems) {
            if (!("list" in sub) && isImageFile(sub.uri)) {
              imageUris.push(sub.uri);
            }
          }
        } else if (isImageFile(entry.uri)) {
          imageUris.push(entry.uri);
        }
      }

      console.log("✅ Loaded image URIs:", imageUris);
      setImages(imageUris);
    } catch (error) {
      console.error("❌ Error loading files:", error);
      setImages([]);
    }
  };

  // Helper function to filter only image files
  const isImageFile = (uri: string) => {
    return uri.match(/\.(jpg|jpeg|png|gif|heic|webp)$/i);
  };

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

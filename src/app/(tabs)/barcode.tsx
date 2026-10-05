import { StyleSheet, Text, View, StatusBar, Button, Pressable } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import { CameraView, useCameraPermissions } from 'expo-camera'

export default function Barcode() {
  const [ cameraPermission, requestCameraPermission ] = useCameraPermissions();
  const [ scanned, setScanned ] = useState(false);
  const [ codeStr, setCodeStr ] = useState<string | null>(null);

  if (!cameraPermission) {
    return <View style=""><Text className="text-white font-syne text-sm">Loading permissions...</Text></View>;
  }
  if(!cameraPermission.granted){
    return(
      <SafeAreaView className="bg-black size-full">
        <View className=" size-full gap-8 flex flex-col items-center justify-center">
          <Text className="text-white/80 text-md font-syne">Camera access required for scanning</Text>
          <Pressable onPress={requestCameraPermission} className="bg-white px-6 py-3" >
            <Text className="text-black font-syne font-medium">Give Access</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    )
  }
  const handleBarcodeScan = ({ type, data }: { type: string, data: string }) => {
    setScanned(true);
    setCodeStr(data)
  }
  return (
    <SafeAreaView className="bg-black flex-1 flex-col">
      <StatusBar barStyle="light-content" backgroundColor="#0B0C10" />
      <Header pageTitle='Track Bookings'></Header>
      <View className="px-6 h-full flex-1 flex-col justify-center gap-8">
        <View className="bg-zinc-600 h-[350] rounded-md"> 
          <CameraView 
            style={StyleSheet.absoluteFill}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: ["qr", "ean13", "code128"], 
            }}
            onBarcodeScanned={scanned ? undefined : handleBarcodeScan}
          />
        </View>
        <Text className="text-white font-syne text-md">Code: {codeStr}</Text>
        <Pressable className="bg-white px-6 py-3">
          <Text className="text-black font-syne font-medium" onPress={(e) => {setScanned(false)}}>Scan Again</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}
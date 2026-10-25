import { StyleSheet, Text, View, StatusBar, Button, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import { useFonts as useSpaceGrotesk, SpaceGrotesk_400Regular, SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';

export default function BookingDetails() {
    const [ data, setData ] = useState([]);
    const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

    useEffect(() => {
        async function fetchBookingData( barcode: string ) {
            try {
                const resposne = fetch(`${API_BASE_URL}/`)
            } catch(err) {
                console.error("Error fetching booking data:", err);
            }
        }
    }, []);

    const [spaceLoaded] = useSpaceGrotesk({
        SpaceGrotesk_400Regular,
        SpaceGrotesk_700Bold,
    });
    if (!spaceLoaded) {
        return null; 
    }
    return (
    <SafeAreaView className="bg-black flex-1 flex-col gap-10">
      <Header pageTitle='Booking Status'></Header>
      <View className="px-6 flex flex-col">
        <View className="border rounded-sm border-white/20 p-6 flex flex-col gap-2 mt-36">
            <View className="flex flex-row items-center gap-5 mb-4">
                <Text className="font-space-grotesk text-3xl text-white">MARS</Text>
                <Text className="px-2 py-1.5 bg-green-900/60 text-xs text-green-400 rounded-lg">Confirmed</Text>
            </View>
            <Text className="font-space-grotesk text-md text-white/50">Email : {'alex040@gmail.com'}</Text>
            <Text className="font-space-grotesk text-md text-white/50">Name : {'Alex Fergusion'}</Text>
            <Text className="font-space-grotesk text-md text-white/50">Date : {'12-02-2026'}</Text>
            <Text className="font-space-grotesk text-md text-white/50">SpaceId : {'0012'}</Text>
            <Text className="font-space-grotesk text-md text-white/50">TicketId : {'TKT-gd8-j5A'}</Text>
            <Text className="font-space-grotesk text-md text-white/50">Departure Station : {'Star Nova'}</Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})
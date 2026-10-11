import { Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { useFonts as useSyne, Syne_400Regular, Syne_700Bold } from '@expo-google-fonts/syne';
import { useFonts as useSpaceGrotesk, SpaceGrotesk_400Regular, SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';

type props = {
    pageTitle: string
}

export default function Header({ pageTitle }: props) {
    const [syneLoaded] = useSyne({
        Syne_400Regular,
        Syne_700Bold,
    });
    const [spaceLoaded] = useSpaceGrotesk({
        SpaceGrotesk_400Regular,
        SpaceGrotesk_700Bold,
    });
    if (!syneLoaded || !spaceLoaded) {
        return null; 
    }

    return (
        <View className="px-6 pt-6 bg-black">
            <View className="flex-row justify-between ">
                <Text className="font-syne-bold text-white">COSMOS</Text>
                <TouchableOpacity className="h-6 w-6 rounded-full bg-white/95 p-1" />
            </View>
            <View className="mt-3 flex-row items-center justify-between">
                <Text className="font-syne text-xl font-medium text-white">{pageTitle}</Text>
            </View>
        </View>
    )
}

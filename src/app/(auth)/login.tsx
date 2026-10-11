import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AntDesign from '@expo/vector-icons/AntDesign';
import { useFonts as useSyne, Syne_400Regular, Syne_700Bold } from '@expo-google-fonts/syne';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import * as Linking from 'expo-linking';

WebBrowser.maybeCompleteAuthSession();

export default function login() {
  const [syneLoaded] = useSyne({
      Syne_400Regular,
      Syne_700Bold,
  });

  const [loading, setLoading] = useState(false);
  
  async function handleGoogleLogin() {
    setLoading(true);
    try{
      const redirectUrl = Linking.createURL('/(tabs)'); 
      console.log('App Redirect URI:', redirectUrl);

      // 2. Instruct Supabase to generate the targeted authentication session URL
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true, // Crucial for Native Mobile: stops the client from forcing a web window redirect
        },
      });

      if (error) throw error;
      if (!data?.url) throw new Error('Could not retrieve an auth URL from Supabase.');

      // 3. Open the secure in-app mobile browser container using Supabase's signed endpoint
      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

      // 4. Parse returning credentials if the browser finishes successfully
      if (result.type === 'success' && result.url) {
        // Extract the parameters from the URL returned to the app
        const parsedUrl = Linking.parse(result.url);
        const { access_token, refresh_token } = parsedUrl.queryParams || {};

        if (access_token && refresh_token) {
          // Set the session manually inside the Supabase client
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: access_token as string,
            refresh_token: refresh_token as string,
          });
          
          if (sessionError) throw sessionError;
        }
      }
    } catch (error: any) {
        Alert.alert('Login Error', error.message || 'An error occurred during sign in.');
    } finally {
        setLoading(false);
    }
  }
  return (
    <SafeAreaView className="bg-black flex-1 justify-center items-center">
        <View className="w-full px-6 flex flex-col items-center gap-8">
          <Text className="text-white/90 font-semibold font-syne text-2xl">Admin Login</Text>
          <Pressable onPress={handleGoogleLogin} disabled={loading} className="py-3 w-full flex flex-row gap-4 items-center bg-zinc-800 rounded-full px-3">
            <AntDesign name="google" size={24} color="white" />
            <Text className={`text-md ${loading? 'text-white/20': 'text-white/50' }`}>Continue with Google</Text>
          </Pressable>
        </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})
import { supabase } from "@/lib/supabase";
import {
    Syne_400Regular,
    Syne_700Bold,
    useFonts as useSyne,
} from "@expo-google-fonts/syne";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { Alert, Platform, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [syneLoaded] = useSyne({
    Syne_400Regular,
    Syne_700Bold,
  });

  const [loading, setLoading] = useState(false);

  async function handleGoogleLogin() {
    setLoading(true);
    try {
      const redirectUrl = Linking.createURL("/(tabs)");
      console.log("App Redirect URI:", redirectUrl);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;
      if (!data?.url)
        throw new Error("Could not retrieve an auth URL from Supabase.");

      if (Platform.OS === "web") {
        window.location.href = data.url;
        return;
      }

      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectUrl,
      );

      if (result.type === "success" && result.url) {
        const parsedUrl = Linking.parse(result.url);
        const queryParams = parsedUrl.queryParams || {};
        const authCode = queryParams.code;

        if (typeof authCode === "string") {
          const { error: sessionError } =
            await supabase.auth.exchangeCodeForSession(authCode);

          if (sessionError) throw sessionError;
        } else {
          const accessToken = queryParams.access_token;
          const refreshToken = queryParams.refresh_token;

          if (
            typeof accessToken === "string" &&
            typeof refreshToken === "string"
          ) {
            const { error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (sessionError) throw sessionError;
          } else {
            throw new Error(
              "The sign-in callback did not include an authorization code or session tokens.",
            );
          }
        }
      }
    } catch (error: any) {
      Alert.alert(
        "Login Error",
        error.message || "An error occurred during sign in.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (!syneLoaded) {
    return (
      <SafeAreaView className="bg-black flex-1 justify-center items-center">
        <View className="w-full px-6 flex flex-col items-center gap-8">
          <Text className="text-white/90 font-semibold font-syne text-2xl">
            Loading...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-black flex-1 justify-center items-center">
      <View className="w-full px-6 flex flex-col items-center gap-8">
        <Text className="text-white/90 font-semibold font-syne text-2xl">
          Admin Login
        </Text>
        <Pressable
          onPress={handleGoogleLogin}
          disabled={loading}
          className="py-3 w-full flex flex-row gap-4 items-center bg-zinc-800 rounded-full px-3"
        >
          <AntDesign name="google" size={24} color="white" />
          <Text
            className={`text-md ${loading ? "text-white/20" : "text-white/50"}`}
          >
            Continue with Google
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

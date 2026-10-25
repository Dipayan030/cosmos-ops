import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Platform, View } from "react-native";
import "../../global.css";

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const segments = useSegments();
  const router = useRouter();

  const verifyAdminAccess = async (currentSession: Session | null) => {
    if (!currentSession) {
      setIsAdmin(null);
      return false;
    }

    const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL;
    if (!apiBaseUrl) {
      console.warn("EXPO_PUBLIC_API_URL is not set. Admin check cannot run.");
      setIsAdmin(false);
      return false;
    }

    const url = `${apiBaseUrl.replace(/\/+$/, "")}/api/v1/admin/login`;

    try {
      let response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${currentSession.access_token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.warn("Admin access check rejected", {
          status: response.status,
        });
        setIsAdmin(false);
        return false;
      }

      setIsAdmin(true);
      return true;
    } catch (error) {
      console.error("Error fetching admin profile", error);
      setIsAdmin(false);
      return false;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        let {
          data: { session: currentSession },
        } = await supabase.auth.getSession();

        if (
          !currentSession &&
          Platform.OS === "web" &&
          typeof window !== "undefined"
        ) {
          const callbackUrl = new URL(window.location.href);
          const authCode = callbackUrl.searchParams.get("code");

          if (authCode) {
            const { data, error } =
              await supabase.auth.exchangeCodeForSession(authCode);

            if (error) throw error;

            currentSession = data.session;
            callbackUrl.searchParams.delete("code");
            callbackUrl.searchParams.delete("state");
            window.history.replaceState(
              {},
              document.title,
              callbackUrl.toString(),
            );
          }
        }

        if (!isMounted) return;

        setSession(currentSession);
        if (currentSession) {
          await verifyAdminAccess(currentSession);
        } else {
          setIsAdmin(null);
        }

        if (isMounted) setIsInitialized(true);
      } catch (error) {
        console.error("Error initializing auth session", error);
        if (isMounted) setIsInitialized(true);
      }
    };

    void initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      if (!isMounted) return;

      setSession(currentSession);

      if (currentSession) {
        await verifyAdminAccess(currentSession);
      } else {
        setIsAdmin(null);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!session) {
      if (!inAuthGroup) {
        router.replace("/(auth)/login");
      }
      return;
    }

    if (isAdmin === null) {
      return;
    }

    if (isAdmin && inAuthGroup) {
      router.replace("/(tabs)");
      return;
    }

    if (!isAdmin) {
      router.replace("/(auth)/login");
    }
  }, [session, isAdmin, isInitialized, segments, router]);

  if (!isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="booking/[bookingId]"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}

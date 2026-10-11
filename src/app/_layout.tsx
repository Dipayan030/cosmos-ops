import '../../global.css';
import { Stack, useRouter, useSegments } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [ role, setRole ] = useState<String | null>(null);

  const segments = useSegments();
  const router = useRouter();

  async function getUserRole(session: Session | null) {
    if(session){
      try{
        const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
        const response = await fetch(`${API_BASE_URL}/api/v1/admin/login`, {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json'
          }
        });
        if(response.ok){
          const data = await response.json();
          setRole(data.role);
        } else setRole('user')
      } catch(err) {
        console.log('Error fetch admin profile',err);
      }
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsInitialized(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      if(session){
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED'){
          await getUserRole(session);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    // Check if the user is currently inside the (auth) group folder
    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup && role!=='admin') {
      // Redirect to login if not authenticated and trying to access private screens
      router.replace('/(auth)/login');
    } else if (session && inAuthGroup && role==='admin') {
      // Redirect to the main tab screen if already authenticated and trying to view login
      router.replace('/(tabs)');
    }
  }, [session, role, isInitialized, segments]);

  if (!isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false, }} />
      <Stack.Screen 
        name="booking/[bookingId]" 
        options={{ headerShown: false }} 
      />
    </Stack>
  );
}

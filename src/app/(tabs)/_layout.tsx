import { Tabs } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          paddingTop: 12,
          height: 70,
          backgroundColor: '#1a1a1a',
          borderTopWidth: 0,          // Removes the top border line on iOS/Android
          elevation: 0,               // Removes the drop shadow on Android
          shadowOpacity: 0,
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="space-dashboard"
              size={24}
              color={focused ? '#ffffff' : '#ffffff9b'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="barcode"
        options={{
          title: 'Barcode',
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="barcode-scan"
              size={24}
              color={focused ? '#ffffff' : '#ffffff9b'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="qrcode"
        options={{
          title: 'Qrcode',
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="qrcode-scan"
              size={24}
              color={focused ? '#ffffff' : '#ffffff9b'}
            />
          ),
        }}
      />
    </Tabs>
  );
}

import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs screenOptions={{tabBarActiveTintColor: 'green', headerShown: false}}>
      <Tabs.Screen 
        name="catalogo" options={{
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="book" color={color}/>,
      }}/>
      <Tabs.Screen 
        name="index" options={{
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="home" color={color}/>,
      }}/>
      <Tabs.Screen 
        name="page2" options={{
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="address-card" color={color}/>,
      }}/>
    </Tabs>
  )
}

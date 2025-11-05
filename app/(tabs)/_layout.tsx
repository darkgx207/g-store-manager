import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'white',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000',
          borderColor: 'lightgreen',
        },
        sceneStyle: {
          backgroundColor: "white",
        },
        animation: "shift",
        tabBarVisibilityAnimationConfig: {show: {animation: "spring"}},
        lazy: true,
      }}
    >
      <Tabs.Screen
        name="catalogo"
        options={{
          tabBarLabel: 'Catalogo',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.focused : {} }>
              <FontAwesome size={24} name="book" color={color}/>
            </View>
          )
      }}/>

      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Inicio",
          tabBarIcon: ({ focused, color }) => (
            <View style={focused ? styles.focused : {} }>
              <FontAwesome size={24} name="home" color={color}/>
            </View>
          )
        }}
      />

      <Tabs.Screen
        name="report"
        options={{
          tabBarLabel: 'Relatório',
          tabBarIcon: ({ focused, color }) => (
            <View style={focused ? styles.focused : {} }>
              <FontAwesome size={24} name="address-card" color={color}/>
            </View>
          )
      }}/>
    </Tabs>
  )
}

const styles = StyleSheet.create({
  focused: {
    backgroundColor: 'rgb(75, 64, 236)',
    borderRadius: 5,
    opacity: 1,
    width: 60,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'rgb(255, 255, 255)',
    borderWidth: .5
  }
});

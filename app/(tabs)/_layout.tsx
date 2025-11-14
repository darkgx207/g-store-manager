import { useDatabase } from "@/database/database";
import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Alert, BackHandler, StyleSheet, View } from "react-native";

export default function RootLayout() {
  const db = useDatabase();

  const tabCounters = {
    item: 0,
    order: 0,
    reset: 0,
  }

  const openSecretMenu = (counterType: 'item'| 'order' | 'reset') => {
    if (tabCounters[counterType] < 4) {
      tabCounters[counterType]++;
      return;
    }

    let msg = "";
    switch (counterType) {
      case "item": { msg = "apagar todos os items"; break }
      case "order": { msg = "apagar todos os pedidos"; break }
      case "reset": { msg = "resetar toda memoria"; break }
    }

    const confirmReset = () => {
      Alert.alert("ATENÇÃO", `ESSA AÇÃO NÃO PODE SER DESFEITA! DESEJA CONTINUAR?`, [
        { text: "Sim", onPress: async () => {
          if (counterType == 'item') await db.deleteAllItems();
          else if (counterType == 'order') await db.deleteOrder(0);
          else await db.resetDatabase();
          BackHandler.exitApp();
        }},
        { text: "Não" }
      ]);
    }

    Alert.alert("Aviso", `Tem certeza que deseja ${msg} do app?`, [
      { text: "Sim", onPress: () => { confirmReset() } },
      { text: "Não" }
    ]);
    tabCounters.item = 0;
    tabCounters.order = 0;
    tabCounters.reset = 0;
  }

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
        listeners={{
          tabLongPress: () => { openSecretMenu("item") }
        }}
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
        listeners={{
          tabLongPress: () => { openSecretMenu("order") }
        }}
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
        listeners={{
          tabLongPress: () => { openSecretMenu("reset") }
        }}
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

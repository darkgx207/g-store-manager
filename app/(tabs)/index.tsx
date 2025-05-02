import { Cart } from "@/components/cart";
import { Text, View, StyleSheet, Button, TextInput, Modal, Dimensions, ScrollView } from "react-native";

const WIDTH = Dimensions.get("screen").width;
const HEIGHT = Dimensions.get("screen").height;

export default function Index() {


  return (
    <View style={styles.center}>
      {/* Pedidos em aberto */}
      <View style={{paddingTop: 20}}>
        <Text style={{fontSize: 18, fontWeight: 600, marginLeft: 20 }}>Pedidos em aberto</Text>
        <ScrollView style={styles.onGoingItems}>
          <Cart></Cart>
        </ScrollView>
      </View>

      {/* Criar novo pedido */}
    <View style={{ margin: 5, marginTop: 20 }}>
        <Button title="Novo pedido" color='green' />
    </View>
    </View>
  );
}



























const styles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: 'rgba(157, 206, 117, 0.85)',
  },
  onGoingItems: {
    backgroundColor: '#000',
    opacity: 0.5,
    height: HEIGHT - 300,
    marginHorizontal: 5,
    borderRadius: 5,
    borderColor: '#000',
    borderWidth: 1,
  }
})

import { Pedido } from "@/components/pedido";
import { Text, View, StyleSheet, Button, Dimensions, ScrollView } from "react-native";

const WIDTH = Dimensions.get("screen").width;
const HEIGHT = Dimensions.get("screen").height;

export default function Index() {

  return (
    <View style={styles.center}>
      {/* Pedidos em aberto */}
      <View style={{paddingTop: 20}}>
        <Text style={{fontSize: 18, fontWeight: 600, marginLeft: 20 }}>Pedidos em aberto</Text>
        <ScrollView style={styles.onGoingItems}>
          <Pedido preco="22,50"/>
          <Pedido preco="122,00"/>
          <Pedido preco="1230,33"/>
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
    backgroundColor: '#2c967c',
    opacity: .9,
    height: HEIGHT - 300,
    marginHorizontal: 5,
    borderRadius: 5,
    borderColor: '#000',
    borderWidth: 1,
  }
})

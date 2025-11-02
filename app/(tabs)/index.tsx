import { Pedido } from "@/components/pedido";
import { Text, View, StyleSheet, Button, Dimensions, ScrollView, Modal } from "react-native";
import NewOrderModal from "../newOrderModal";
import { useEffect, useState } from "react";
import { useDatabase } from "@/database/database";
import { OrderResume } from "@/database/models/OrderResume";

const WIDTH = Dimensions.get("screen").width;
const HEIGHT = Dimensions.get("screen").height;

export default function Index() {
  const db = useDatabase();
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orders, setOrders] = useState<OrderResume[]>([]);
  const [selected, setSelected] = useState<number | undefined>(undefined);
  
  const fetchItemOrder = async() => {
    const res = (await db.fetchItemOrder(0, false)) || [];
    setOrders(res)
  };
  
  useEffect(() => {
    fetchItemOrder();
  }, []);
  
  return (
    <View style={styles.center}>
      {/* Pedidos em aberto */}
      <View style={{paddingTop: 20}}>
        <Text style={{fontSize: 18, fontWeight: 600, marginLeft: 20 }}>Pedidos em aberto</Text>
        <ScrollView style={styles.onGoingItems}>
          {orders.map((order, i) => (
            <Pedido order={order} key={String(i)} editOrder={setSelected}/>
          ))}
        </ScrollView>
      </View>

      {/* Criar novo pedido */}
      <View style={{ margin: 5, marginTop: 20 }}>
        <Button title="Novo pedido" color='green' onPress={() => setShowOrderModal(!showOrderModal)}/>
      </View>
      
      <Modal visible={showOrderModal || selected != undefined} presentationStyle="formSheet" animationType="slide">
        <NewOrderModal closeModal={() => { setShowOrderModal(false); setSelected(undefined); fetchItemOrder() }} orderId={selected} />
      </Modal>
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

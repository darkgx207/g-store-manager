import { Button, ScrollView, StyleSheet, View, Modal, FlatList } from "react-native";
import { useEffect, useState } from "react";
import * as ip from 'expo-image-picker';
import { ItemCard } from "@/components/ItemCard";
import NewItemModal from "../newItemModal";
import { useDatabase } from "@/database/database";
import { Item } from "@/database/models/Item";

export default function Catalogo() {  
  const db = useDatabase();
  const [showModal, setShowModal] = useState(false);
  const [foodList, setFoodList] = useState<Item[]>([]);

  useEffect(() => {
    (async () => {
      setFoodList(await db.fetchItems())
    })();

  }, [showModal])

  return (
    <View style={{flex: 1}}>
      <View style={styles.addContainer}>
        <Button title="Cadastrar novo item" color='green' onPress={() => setShowModal(true)}/>
      </View>

      <FlatList 
        style={styles.listContainer}
        data={foodList}
        contentContainerStyle={{ gap: 5, margin: 0, padding: 5 }}
        renderItem={({item}) => <ItemCard imgUri={item.imgUri} title={item.title} description={item.description} price={item.price} />}
      />

      <Modal
        visible={showModal}
        animationType="slide"
      >
        <NewItemModal closeModal={() => setShowModal(false)}/>
      </Modal>
    </View>

  );
}


const styles = StyleSheet.create({
  addContainer: {
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'rgb(5, 5, 5)'
  },
  b1: {
    backgroundColor: 'lightblue'
  },
  scrollContainer: {
    backgroundColor: 'rgba(157, 206, 117, 0.85)',
    height: 500
  },
  listContainer: {
    backgroundColor: 'rgba(157, 206, 117, 0.85)',
  }
});
import { Button, ScrollView, StyleSheet, View, Modal, FlatList, TouchableHighlight, TouchableOpacity, Text, Alert } from "react-native";
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
  const [selected, setSelected] = useState(0);

  const fetchItems = async () => {
    setFoodList(await db.fetchItems())
  }

  useEffect(() => {
    fetchItems();
  }, [showModal])

  const toggleItemSelected = (key: number) => {
    setSelected( (key === selected) ? 0 : key);
  }

  const deleteItem = (id: number) => {
    Alert.alert("ATENÇÃO","Tem certeza que deseja remover este item?", [
      {
        text: "SIM", 
        onPress: async () => {
          (await db.deleteItem(id)) && Alert.alert("","Item excluído com sucesso");
          fetchItems();
        }
      },
      { text: "NÃO" }
    ]);
  }

  return (
    <View style={{flex: 1}}>
      <View style={styles.addContainer}>
        <Button title="Cadastrar novo item" color='green' onPress={() => setShowModal(true)}/>
      </View>

      <FlatList 
        style={styles.listContainer}
        data={foodList}
        contentContainerStyle={{ gap: 5, margin: 0, padding: 5 }}
        keyExtractor={ (item) => String(item.id) }
        renderItem={({item}) => 
          <ItemCard 
            imgUri={item.imgUri} 
            title={item.title} 
            description={item.description} 
            price={item.price} 
            selected={item.id === selected}
            handlePress={() => { toggleItemSelected(item.id!) }}
            handleTrash={() => deleteItem(item.id!)}
          />
        }
      />

      <Modal visible={showModal} animationType="slide">
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
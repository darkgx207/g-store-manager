import { Button, ScrollView, StyleSheet, View, Modal } from "react-native";
import { useState } from "react";
import * as ip from 'expo-image-picker';
import { ItemCard } from "@/components/ItemCard";
import NewItemModal from "../newItemModal";
import { foodsList } from "@/fake-data/foods";

export default function Catalogo() {  
  const [showModal, setShowModal] = useState(false);

  return (
    <View style={{flex: 1}}>
      <View style={styles.addContainer}>
        <Button title="Cadastrar novo item" color='green' onPress={() => setShowModal(true)}/>
      </View>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.listContainer}>
          {foodsList.map((value, key) => (
            <ItemCard imgUri={value.imgUri} title={value.title} description={value.description} price={value.price} key={key}/>
          ))}
        </View>
      </ScrollView>

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
    padding: 5,
    gap: 5
  }
});
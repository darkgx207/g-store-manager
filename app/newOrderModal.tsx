import ItemCardOrder from "@/components/ItemCardOrder";
import { useDatabase } from "@/database/database";
import { Item } from "@/database/models/Item";
import { Order } from "@/database/models/Order";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Alert, Button, FlatList, ScrollView, StyleSheet, Text, TextInput, TextInputSubmitEditingEvent, TouchableOpacity, View } from "react-native";

interface INewOrderProps {
  closeModal: () => void,
  orderId?: number
}

export interface ItemByNumber extends Item {
  quantity?: number,
  itemOrderId?: number
}


const renderItemResume = (item: ItemByNumber, i: number) => {
  if (!item.quantity) return;
  const sellingUnit = item.sellingUnit === "Unidade" ? "un" : "kg";
  const quantityPerSellingUnit = `(${item.quantity} ${sellingUnit})`;
  const pricePerQuantity = (item.quantity * item.price).toFixed(2);
  
  return {
    element: (
      <Text
        key={String(i)}
        style={{ color: "#000", fontWeight: "bold" }}
      >
        {item.title} {quantityPerSellingUnit}: <Text style={{ color: "green" }}>R$ {pricePerQuantity}</Text>
      </Text>
    ),
    sum: Number(pricePerQuantity)
  };
};

const createTotalResume = (items: ItemByNumber[]) => {
  let total = 0;
  const eachItemResume = items.map((item, i) => {
    const res = renderItemResume(item, i);
    if (!res) return;
    
    total = Number((total + res.sum).toFixed(2));
    return res.element;
  });
  
  return (
    <View style={style.totalContainer}>
      <ScrollView style={{ flex: 1}}>
        { eachItemResume }
      </ScrollView>
      <View style={{backgroundColor: "#7cf7a5"}}>
        <Text>Total: R$ { total }</Text>
      </View>
    </View>
  );
}

const NewOrderModal = (props: INewOrderProps) => {
  const db = useDatabase();
  const [text, setText] = useState('');
  const [items, setItems] = useState<ItemByNumber[]>([]);
  
  const fetchItems = async () => {
    if (props.orderId) {
      await fetchItemsFromOrder(props.orderId);
      return
    }
    const dbItems = await db.fetchItems();
    setItems(dbItems);
  };
  
  const fetchItemsFromOrder = async (orderId: number) => {
    const dbItems = await db.fetchItemsByOrder(orderId, false);
    if (!dbItems)
      Alert.alert("", "Não foi possivel editar/visualizar este pedido.");
    else
      setItems(dbItems);
  }
  
  const wipeSearch = () => {
    setText("");
    sortBySearchText();
  };
  
  const sortBySearchText = (e?: TextInputSubmitEditingEvent) => {
    const text = e?.nativeEvent.text || "";
    const regex = RegExp(`${text}`, "i");
    
    const items_ = [...items].sort((a, b) => {
      const a_ = regex.test(a.title);
      const b_ = regex.test(b.title);
      
      if (a_ && b_) return a.title.localeCompare(b.title);
      if (a_) return -1;
      if (b_) return 1;
      return 0;
    });
    setItems(items_);
  };
  
  const updateQuantity = (value: number, id?: number) => {
    const index = items.findIndex(x => x.id == id);
    if (index == -1) return;
    
    const item: ItemByNumber = {
      ...items[index],
      quantity: value
    };
    
    items[index] = item;
    setItems([...items]);
  };
  
  const deleteOrder = () => {
    const act = async () => {
      await db.deleteOrder(props.orderId!);
      props.closeModal();
    };
    const btns = [{ text: "Sim", onPress: act }, { text: "Não" }];
    Alert.alert("", "Tem certeza que deseja excluir este pedido?", btns);
  }
  
  const saveOrder = async () => {
    try {
      let total = 0;
      const itemsToSave = items.filter(item => {
        if (item.itemOrderId && !item.quantity) return true;
        if (!(item.quantity && item.quantity > 0)) return false;
        total += Number((item.price * item.quantity).toFixed(2));
        return true;
      });
      
      const order: Order = {
        items: itemsToSave,
        isPaid: false,
        updatedAt: new Date(),
        total: Number(total.toFixed(2)),
        id: props.orderId
      };
      
      if (!props.orderId) {
        const result = await db.createOrder(order);
        Alert.alert("", result != 0 ? "Salvo com Sucesso!" : "Não foi possivel salvar o pedido")
        props.closeModal();
        return;
      }
      
      const result = await db.updateOrder(order);
      Alert.alert("", result ? "Atualizado com Sucesso!" : "Não foi possivel atualizar o pedido")
      props.closeModal();
    }
    catch (e) { 
      Alert.alert("Error", "Não foi possivel salvar/atualizar o pedido");
      console.error(e);
    }
  };
  
  useEffect(() => {
    fetchItems();
  }, []);
  
  
  return (
    <View style={style.container}>
      
      {/*Search bar*/}
      <View style={style.searchBar}>
        <TextInput 
          placeholder="Digite o item que procura"
          style={{ color: "red", flex: 1, marginEnd: 5, fontSize: 15, paddingVertical: 5 }}
          placeholderTextColor={"#0006"}
          onChangeText={setText}
          value={text}
          maxFontSizeMultiplier={1}
          onSubmitEditing={sortBySearchText}
        />
        
        { text.length > 0 && (
          <TouchableOpacity onPress={wipeSearch}>
            <Ionicons
              name="close-circle-outline" 
              size={25}
              style={{ color: "red", fontWeight: "700" }}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {/* Items container */}
      <View style={style.centralContainer}>
        <View style={style.itemsContainer}>
          <FlatList 
            style={{ backgroundColor: 'rgba(157, 206, 117, 0.85)' }}
            contentContainerStyle={{ gap: 5, margin: 0, padding: 5 }}
            keyExtractor={ (_, i) => String(i) }
            data={items}
            renderItem={({item}) => 
              <ItemCardOrder 
                item={item}
                updateQuantity={(q) => updateQuantity(q, item.id)}
              />
            }
          />
        </View>
        
        { createTotalResume(items) }
        
      </View>
      
      {/*Bottom */}
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <Button title="Salvar" onPress={saveOrder} color={"green"}/>
        <Button title="Fechar" onPress={props.closeModal} color={"red"}/>
      {props.orderId && (
        <Button title="Excluir" onPress={deleteOrder} color={"#fc0335"}/>
      )}
      </View>
      
    </View>
  )
};


const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  searchBar: {
    borderBlockColor: "#000",
    borderWidth: 2,
    borderRadius: 5,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  centralContainer: {
    flex: 1,
    paddingVertical: 5,
    gap: 2
  },
  itemsContainer: {
    borderWidth: 1,
    borderBlockColor: "#000",
    flex: 1,
    borderRadius: 5
  },
  totalContainer: {
    borderWidth: 1,
    borderBlockColor: "#000",
    height: 150,
    borderRadius: 5,
    flexGrow: 0,
    backgroundColor: 'rgba(157, 206, 117, 0.4)'
  }
});

export default NewOrderModal;

import { ItemByNumber } from "@/app/newOrderModal";
import { UnidadeVendas } from "@/constants/constantValues";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View, Image, Animated, Text, TextInput, TouchableOpacity, Alert } from "react-native"

interface IItemCardOrderProps {
  item: ItemByNumber,
  updateQuantity: (q: number) => void
}

const textPricebySellingUnit = (unit: (typeof UnidadeVendas)[keyof typeof UnidadeVendas], price: number) => (
  <Text style={{ fontWeight: "semibold", color: "white" }}>
    R$ {price.toFixed(2).replace('.', ',')} ({unit})
  </Text>
);


export default function ItemCardOrder(props: IItemCardOrderProps) {
  const quantity = props.item.quantity || 0;

  const setQuantity = (value: number) => {
    props.updateQuantity(value);
  };

  const quantityText = quantity > 0 ? String(quantity) : '';

  const setQuantityByText = (value: string) => {
    const res = Number(value);
    setQuantity(Number.isNaN(res) ? 0 : res);
  };

  const addByUnit = (subtract?: boolean ) => {
    const increment = subtract ? -1 : 1;
    let result = 0;

    if (props.item.sellingUnit == "Unidade")
      result = quantity + increment;
    else
      result = Number((quantity + (increment / 10)).toFixed(1))

    setQuantity(result < 0.0 ? 0 : result);
  }

  return (
    <View style={style.card}>
      <View style={{ flex: 0.4 }}>
        <Image source={{ uri: props.item.imgUri }} style={style.image}/>
      </View>
      <Animated.View style={{ flex: 0.6 }}>
        <Text style={style.title}>{props.item.title}</Text>
        <Text style={style.price}>{textPricebySellingUnit(props.item.sellingUnit, props.item.price)}</Text>
        <View style={style.buttonContainer}>
          <TouchableOpacity activeOpacity={.5} onPress={() => addByUnit()}>
            <Ionicons name="add-circle-outline" color={"#00fa70"} style={style.button} />
          </TouchableOpacity>
          <TextInput style={{width: 50, color: "#fff", textAlign: "center" }}
            maxLength={4}
            keyboardType="numeric"
            value={quantityText}
            onChangeText={setQuantityByText}
          />
          <TouchableOpacity activeOpacity={ quantity > 0 ? .5 : 1} onPress={() => addByUnit(true) }>
            <Ionicons name="remove-circle-outline" color={"red"} style={[style.button, quantity <= 0 && {color: "#555f"}]} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const style = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(39, 37, 37, 0.83)',
    width: '100%',
    height: 80,
    borderRadius: 5,
    flexDirection: 'row',
    overflow: 'hidden',
    borderColor: '#000',
    borderWidth: 1,
    position: 'relative'
  },
  title: {
    color: '#fff',
    marginLeft: 10,
    marginTop: 5,
    fontSize: 16,
    fontWeight: 'bold'
  },
  price: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 12,
    fontWeight: 'semibold',
    textAlignVertical: 'bottom',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgb(125, 130, 136)',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 5
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 30
  },
  button: {
    // color: "#fff",
    fontSize: 30
  }
});

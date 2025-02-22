import { imgBolo } from "@/assets/data/bolo";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";

interface ItemCardProps {
  imgUri: string,
  title?: string,
  description?: string,
  price?: string
}

const WIDTH = Dimensions.get('screen').width;

export function ItemCard(props: ItemCardProps) {
    const image = `data:image/png;base64,${imgBolo}`;

    return (
      <View style={styles.card}>
        <View style={{ flex: 0.4 }}>
          <Image source={{ uri: props.imgUri }} style={styles.image}/>
        </View>
        <View style={{ flex: 0.6 }}>
          <Text style={styles.title}>{props.title}</Text>
          <Text style={styles.description} ellipsizeMode="tail" numberOfLines={3}>{props.description}</Text>
          <Text style={styles.price}>R$ {props.price}</Text>
        </View>
      </View>
    );
}


const styles = StyleSheet.create({
 card: {
    backgroundColor: 'rgba(39, 37, 37, 0.83)',
    width: '100%',
    height: 100,
    borderRadius: 5,
    flexDirection: 'row',
    overflow: 'hidden',
    borderColor: '#000',
    borderWidth: 1
  },
  title: {
    color: '#fff',
    marginLeft: 10,
    marginTop: 5,
    fontSize: 16,
    fontWeight: 'bold'
  },
  description: {
    color: '#fff',
    margin: 5,
    fontSize: 12
  },
  price: {
    color: '#fff',
    textAlign: "right",
    marginRight: 12,
    fontSize: 14,
    fontWeight: 'bold'
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgb(125, 130, 136)',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 5
  }
});
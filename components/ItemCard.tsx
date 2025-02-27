import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Animated, BackHandler, Dimensions, Image, Modal, Pressable, StyleSheet, Text, TextInput, Touchable, TouchableHighlight, TouchableOpacity, View } from "react-native";

interface ItemCardProps {
  imgUri: string,
  title?: string,
  description?: string,
  price?: number,
  handlePress?: () => void,
  selected?: boolean,
  handleTrash?: () => void,
  handleEdit?: () => void
}

const WIDTH = Dimensions.get('screen').width;

export function ItemCard(props: ItemCardProps) {

    return (
        <Pressable style={styles.card} onLongPress={() => { props.handlePress?.()} } delayLongPress={150}>
          <View style={{ flex: 0.4 }}>
            <Image source={{ uri: props.imgUri }} style={styles.image}/>
          </View>
          <Animated.View style={{ flex: 0.6 }}>
            <Text style={styles.title}>{props.title}</Text>
            <Text style={styles.description} ellipsizeMode="tail" numberOfLines={3}>{props.description}</Text>
            <Text style={styles.price}>R$ {props.price?.toFixed(2).replace('.',',')}</Text>
          </Animated.View>

          {props.selected && (
            <View style={styles.options}>
              <TouchableOpacity activeOpacity={0.8} onPress={props.handleTrash}>
                <Ionicons name="trash-outline" color={'white'} size={50} style={{color: 'red'}}/>
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons name="create-outline" color={'white'} size={50}/>
              </TouchableOpacity>
            </View>
          )}
        </Pressable>
    );
}


const styles = StyleSheet.create({
  options: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    gap: 50
  },
  card: {
    backgroundColor: 'rgba(39, 37, 37, 0.83)',
    width: '100%',
    height: 100,
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
    fontWeight: 'bold',
    textAlignVertical: 'bottom',
    flex: 1,
    marginBottom: 1
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
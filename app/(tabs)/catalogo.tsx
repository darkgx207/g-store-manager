import { FontAwesome } from "@expo/vector-icons";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Page3() {
  return (
    <View style={{flex: 1}}>
      <View style={styles.addContainer}>
        <Button title="Cadastrar novo item" color='green'/>
      </View>
      <TouchableOpacity style={styles.b1}>
        <Text>CLick me</Text>
      </TouchableOpacity>
      
    </View>
  );
}


const styles = StyleSheet.create({
  addContainer: {
    justifyContent: 'center',
    padding: 10
  },
  b1: {
    backgroundColor: 'lightblue'
  }
});
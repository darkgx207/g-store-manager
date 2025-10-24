import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";

interface ICustomText {
  content: string,
  opts?: {
    color?: string,
    fontSize?: number,
    alignX?: "auto" | "center" | "left" | "right" | "justify",
    weight?: any | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900"
  }
}

function Textc({ content, opts }: ICustomText) {
  return (
    <Text 
      numberOfLines={2}
      style={{
      color: opts?.color || "#000",
      fontSize: opts?.fontSize || 14,
      textAlign: opts?.alignX,
      fontWeight: opts?.weight || "400",
    }}>
      {content}
    </Text>
  )
}

// Buscar todos os pedidos em aberto do banco de dados.
export function Pedido({ preco }: {preco?: string} ) {
  if (!preco) preco = "00,00";
  
  const confirmPayment = () => {
    Alert.alert(
      "", "Tem certeza que deseja confirmar o pagamento?",
      [{ text: "Sim", onPress: () => { }}, { text: "Não", onPress: () => { }}],
      {cancelable: true}
    )
  }
  
  const showOrder = () => {
    
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={{ flex: 1 }}>
          <Textc content="Identificador: 11, Cliente: Alberto" opts={{weight: "800"}}/>
          <Textc content="Coxinha(1), Espetinho(2), Pizza Margerita(1), Feijão tropeiro, Macarronada"/>
        </View>
        
        <View style={styles.centralBtnLayout}>
          <TouchableOpacity style={styles.centralBtn} onPress={confirmPayment}>
            <Textc content="Confirmar pagamento" opts={{fontSize: 14, color: "#fff"}} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.centralBtn, {backgroundColor: "#000"}]} onPress={showOrder}>
            <Textc content="Visualizar" opts={{fontSize: 14, color: "#fff"}} />
          </TouchableOpacity>
          <View style={{flex: 1}}>
            <Textc content={"R$ "+ preco} opts={{alignX: "right" , weight: "700"}}/>
          </View>
        </View>
      </View>
      
    </View>
  );
}
/* Funçoes necessárias
  - confirmar pagamento {Salvar no db}
  - Editar Pedido {apagar, inserir novas items, alterar nome?}
*/

const styles = StyleSheet.create({
  text: {
    color: "#000",
    fontWeight: 800
  },
  container: {
    backgroundColor: "#fff",
    width: "100%",
    height: 100,
    borderBlockColor: "#000",
    borderWidth: 1,
    borderRadius: 7,
    opacity: .9,
  },
  innerContainer: {
    flex: 1,
    padding: 2,
  },
  centralBtnLayout: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 10
  },
  centralBtn: { 
    backgroundColor: "green",
    padding: 8,
    borderRadius: 10
  }
});

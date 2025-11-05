import { useDatabase } from "@/database/database";
import { OrderResume } from "@/database/models/OrderResume";
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

interface IPedidoProps {
  order: OrderResume
  editOrder?: (id?: number) => void
  confirmPayment?: () => void
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
export function Pedido(props: IPedidoProps) {
  const db = useDatabase();

  const confirmPayment = async () => {
    if (!props.order.id) return;
    const res = await db.setOrderAsPaid(props.order.id);
    if (!res) {
      Alert.alert("", "Não foi possivel atualizar pedido");
      return;
    }
    props.confirmPayment?.();
  }

  const handleConfirmPayment = () => {
    const buttons = [{ text: "Sim", onPress: () => { confirmPayment() } }, { text: "Não", onPress: () => { } }];
    Alert.alert("", "Tem certeza que deseja confirmar o pagamento?", buttons, { cancelable: true });
  }

  const showOrder = () => {
    props.editOrder?.(props.order.id);
  }

  const getItensResume = (): string => {
    let resume = "";
    const size = props.order.items?.length;

    props.order.items?.forEach((it, i) => {
      resume += `${it.title}(${it.quantity})${(i+1 == size) ? "" : ", "}`;
    });

    return resume;
  }

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={{ flex: 1 }}>
          <Textc content={`Identificador: ${props.order.id}`} opts={{weight: "800"}}/>
          <Textc content={getItensResume()} />
        </View>

        <View style={styles.centralBtnLayout}>
          <TouchableOpacity style={styles.centralBtn} onPress={handleConfirmPayment}>
            <Textc content="Confirmar pagamento" opts={{fontSize: 14, color: "#fff"}} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.centralBtn, {backgroundColor: "#000"}]} onPress={showOrder}>
            <Textc content="Visualizar" opts={{fontSize: 14, color: "#fff"}} />
          </TouchableOpacity>
          <View style={{flex: 1}}>
            <Textc content={"R$ "+ props.order.total} opts={{alignX: "right" , weight: "700"}}/>
          </View>
        </View>
      </View>

    </View>
  );
}

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

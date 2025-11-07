import { useState } from "react";
import { StyleSheet, Image, TouchableOpacity, TextInput, ImageURISource, Dimensions, Button, KeyboardAvoidingView, ScrollView, View, Alert, Platform } from "react-native";
import * as imagePicker from 'expo-image-picker';
import { useDatabase } from "@/database/database";
import { Item } from "@/database/models/Item";
import { getCameraPermissionsAsync } from "expo-image-picker";
import { RadioSelect } from "@/components/gRadio";
import { UnidadeVendas } from "@/constants/constantValues";
import { requestCameraPermission } from "@/utils/access-util";

interface INewItemModelProps {
  closeModal: () => void,
  item?: Item
}

const defaultImage = require('../assets/images/img-not-found.png');
const WIDTH = Dimensions.get("screen").width;
const HEIGHT = Dimensions.get("screen").height;

export default function NewItemModal({ closeModal, item }: INewItemModelProps) {
    const sql = useDatabase();

    // Solução para evitar infinity hook callback
    const img_ = item?.imgUri;
    const title_ = item?.title || "";
    const price_ = item?.price || "";
    const desc_ = item?.description || "";
    const sellingUnit_ = item?.sellingUnit || "Unidade";

    const [img, setImg] = useState<ImageURISource>(img_ && { uri: img_ } || defaultImage);
    const [title, setTitle] = useState(title_);
    const [price, setPrice] = useState(price_.toString());
    const [desc, setDesc] = useState(desc_);
    const [sellingUnit, setSellingUnit] = useState(sellingUnit_);

    const takePhoto = () => {
      const uploadFromCamera = async () => {
        if (Platform.OS === "ios") {
          const permission = await getCameraPermissionsAsync();
          if (!permission.granted) {
            console.warn("[error] Permissão de camera não concedida");
            Alert.alert("", "Sem permissão de acesso a camera");
            return;
          }
        }

        const photo = await imagePicker.launchCameraAsync({quality: 1, mediaTypes: 'images'});
        if (photo.canceled) return;
        setImg({ uri: photo.assets?.[0].uri })
      };

      const uploadFromGallery = async () => {
        const photo = await imagePicker.launchImageLibraryAsync({quality: 1, mediaTypes: 'images'});
        if (photo.canceled) return;

        const uri = photo.assets?.[0].uri;
        setImg({ uri });
      };

      const buttons = [
        { text: "cancelar" },
        { text: "camera", onPress: uploadFromCamera },
        { text: "galeria", onPress: uploadFromGallery }
      ];

      Alert.alert("UPLOAD","Qual opção deseja utilizar", buttons, {cancelable: true});
    };

    const saveNewItem = async () => {
        const _price = price.replace(',', '.');
        const _item: Item = {
            description: desc,
            title: title,
            price: Number(_price),
            imgUri: img?.uri || "",
            id: item?.id || 0,
            sellingUnit: sellingUnit
        };

        if (_item.id) { await sql.updateItem(_item) && Alert.alert('', "Item atualizado com sucesso") }
        else { await sql.createItem(_item) }

        closeModal();
    }

    return (
        <ScrollView>
          <View style={[style.container, { alignItems: "center" }]}>
            <TouchableOpacity style={[style.imageContainer, { marginVertical: 20 }]} onPress={takePhoto}>
              <Image
                source={ img || defaultImage }
                style={{ width: 250, height: 250 }}
              />
            </TouchableOpacity>
            <KeyboardAvoidingView style={{ gap: 10, maxHeight: HEIGHT }} behavior="padding">
              <TextInput
                placeholder="Nome"
                textAlign="left"
                style= {style.input}
                maxLength={50}
                value={title}
                onChangeText={setTitle}
                placeholderTextColor={"#0007"}
              />

              <TextInput
                placeholder="Preço"
                textAlign="left"
                style= {style.input}
                maxLength={50}
                keyboardType="decimal-pad"
                onChangeText={setPrice}
                value={price}
                placeholderTextColor={"#0007"}
              />

              <TextInput
                placeholder="Descrição"
                textAlign="left"
                style= {[style.input, { marginTop: 5, minHeight: 100, maxHeight: 200 }]} multiline={true}
                maxLength={250}
                value={desc}
                onChangeText={setDesc}
                placeholderTextColor={"#0007"}
              />

              <RadioSelect
                options={[UnidadeVendas.UNIDADE, UnidadeVendas.KG]}
                label="Unidade de venda"
                defaultValue={sellingUnit}
                onChange={(value) => {
                  setSellingUnit(value as typeof sellingUnit);
                }}
              />

              <Button title="Salvar" color={"green"} onPress={saveNewItem} />
              <Button title="Cancelar" color={"red"}  onPress={() => closeModal() }/>
            </KeyboardAvoidingView>
          </View>
        </ScrollView>
    )
}


const style = StyleSheet.create({
    container: {
        padding: 2,
        flex: 1
    },
    imageContainer: {
        backgroundColor: 'rgb(122, 122, 122)',
        width: 250,
        height: 250,
        borderRadius: 10,
        overflow: 'hidden',
        borderColor: 'black',
        borderWidth: 1
    },
    input: {
        borderWidth: 1,
        borderRadius: 5,
        width: WIDTH*0.8,
        padding: 8,
        fontSize: 20,
        textAlignVertical: 'top'
    }
});

import { useMemo, useState } from "react";
import { StyleSheet, Image, TouchableOpacity, TextInput, ImageURISource, Dimensions, Button, KeyboardAvoidingView, ScrollView, View, Alert, BackHandler,  } from "react-native";
import * as imagePicker from 'expo-image-picker';
import { useDatabase } from "@/database/database";
import { Item } from "@/database/models/Item";


const defaultImage = require('../assets/images/img-not-found.png');
const WIDTH = Dimensions.get("screen").width;
const HEIGHT = Dimensions.get("screen").height;

export default function NewItemModal({closeModal, item}: {closeModal: () => void, item?: Item}) {
    const sql = useDatabase();

    const [img, setImg] = useState<ImageURISource>();
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [desc, setDesc] = useState('');

    if (item) {
        useMemo(() => {
            setImg({uri: item.imgUri});
            setTitle(item.title);
            setPrice(item.price.toString());
            setDesc(item.description);
        }, [item]);
    }

    const takePhoto = () => {
        Alert.alert("UPLOAD","Qual opção deseja utilizar", [
            {text: "cancelar"},
            {
                text: "camera",
                onPress: async () => {
                    const photo = await imagePicker.launchCameraAsync({quality: 1, mediaTypes: 'images'});
                    if (photo.canceled) return;
                    setImg({ uri: photo.assets?.[0].uri })
                }
            },
            {
                text: "galeria",
                onPress: async () => {
                    const photo = await imagePicker.launchImageLibraryAsync({quality: 1, mediaTypes: 'images'});
                    if (photo.canceled) return;
                    setImg({ uri: photo.assets?.[0].uri })
                }
            }
        ],{cancelable: true});
        
    };

    const saveNewItem = async () => {
        const _item: Item = {
            description: desc,
            title: title,
            price: Number(price),
            imgUri: img?.uri || "",
            id: item?.id || 0
        };

        if (_item.id) { await sql.updateItem(_item) && Alert.alert('', "Item atualizado com sucesso") } 
        else { await sql.createItem(_item) }

        closeModal();
    }

    return (
        <ScrollView>
            <View style={[style.container, { alignItems: "center" }]}>
                <TouchableOpacity style={[style.imageContainer, { marginVertical: 30 }]} onPress={takePhoto}>
                    <Image 
                        source={ img || defaultImage }
                        style={{ width: 250, height: 250 }}
                    />
                </TouchableOpacity>
                <KeyboardAvoidingView style={{ gap: 10 }} behavior="padding">
                    <TextInput 
                        placeholder="Nome" 
                        textAlign="left" 
                        style= {style.input}
                        maxLength={50}
                        value={title}
                        onChangeText={setTitle}
                    />

                    <TextInput 
                        placeholder="Preço" 
                        textAlign="left" 
                        style= {style.input}
                        maxLength={50}
                        keyboardType="decimal-pad"
                        onChangeText={setPrice}
                        value={price}
                    />

                    <TextInput 
                        placeholder="Descrição" 
                        textAlign="left" 
                        style= {[style.input, { marginTop: 5, minHeight: 100, maxHeight: 200 }]} multiline={true} 
                        maxLength={250}
                        value={desc}
                        onChangeText={setDesc}
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
        padding: 10,
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
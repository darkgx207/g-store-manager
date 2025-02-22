import { useState } from "react";
import { StyleSheet, Image, TouchableOpacity, TextInput, ImageURISource, Dimensions, Button, KeyboardAvoidingView, ScrollView, View } from "react-native";
import * as imagePicker from 'expo-image-picker';
import { router } from "expo-router";


const defaultImage = require('../assets/images/img-not-found.png');
const WIDTH = Dimensions.get("screen").width;
const HEIGHT = Dimensions.get("screen").height;

export default function NewItemModal({closeModal}: {closeModal: () => void}) {
    const [img, setImg] = useState<ImageURISource>();

    const takePhoto = async () => {
        const photo = await imagePicker.launchCameraAsync({quality: 1, mediaTypes: 'images'});
        if (photo.canceled) return;

        setImg({ uri: photo.assets?.[0].uri })
    };

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
                    />

                    <TextInput 
                        placeholder="Preço" 
                        textAlign="left" 
                        style= {style.input}
                        maxLength={50}
                        keyboardType="decimal-pad"

                    />

                    <TextInput 
                        placeholder="Descrição" 
                        textAlign="left" 
                        style= {[style.input, { marginTop: 5, minHeight: 100, maxHeight: 200 }]} multiline={true} 
                        maxLength={250}
                    />
                    <Button title="Salvar" color={"green"}/>
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
        padding: 5,
        fontSize: 25,
        textAlignVertical: 'top'
    }
});
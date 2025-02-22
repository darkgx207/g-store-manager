import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, useColorScheme } from "react-native";


export default function mainContainer() {
    const theme = useColorScheme();
    return(
        <SafeAreaView style={{flex: 1}}>
            <StatusBar backgroundColor="black" style={ theme === 'dark' ? 'dark':'light'} translucent={false}/>
            <Stack screenOptions={{animation: "slide_from_bottom"}}>
                <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
            </Stack>
        </SafeAreaView>
    )
}
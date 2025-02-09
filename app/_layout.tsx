import { Stack } from "expo-router";

export default function mainContainer() {
    return(
        <Stack>
            <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
        </Stack>
    )
}
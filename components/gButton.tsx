import { TouchableOpacity, Text, StyleProp, ViewStyle } from "react-native";

type Props = {
    text: string,
    color?: string,
    style?: StyleProp<ViewStyle>,
    onPress?: CallableFunction

}

export default function GButton(props: Props) {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => props.onPress?.()}
            style={[
                { backgroundColor: props.color, height: 40, justifyContent: 'center' },
                props.style
            ]}
        >
            <Text style={{ textAlign: 'center', color: 'white', fontWeight: '800', fontSize: 16 }}>
                {props.text}
            </Text>
        </TouchableOpacity>
    );
}

import { View, Text, Button } from 'react-native'
import { useNavigation } from '@react-navigation/native'

export default function Vendedor() {
    const navigation = useNavigation()

    return (
        <View>
            <Text>
                Esta es la pantalla de vendedor
            </Text>
        </View>
    )
}   
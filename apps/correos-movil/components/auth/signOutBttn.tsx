import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import { useClerk } from '@clerk/clerk-expo'
import AsyncStorage from '@react-native-async-storage/async-storage'


export const LogoutButton = () => {
    const { signOut } = useClerk()

    const handleSignOut = async () => {
        try {
            // 1. Limpiar token del AsyncStorage
            await AsyncStorage.removeItem('token')

            // 2. Cerrar sesión en Clerk
            await signOut()

            // 3. La navegación se manejará automáticamente cuando 
            //    Clerk cambie isSignedIn a false
            console.log('Logout successful')

        } catch (err) {
            console.error('Logout error:', JSON.stringify(err, null, 2))
        }
    }

    return (
        <TouchableOpacity onPress={handleSignOut}>   
            <Text style={{ color: 'red', fontWeight: 'bold' }}>
                Cerrar Sesión
            </Text>
        </TouchableOpacity>
    )
}
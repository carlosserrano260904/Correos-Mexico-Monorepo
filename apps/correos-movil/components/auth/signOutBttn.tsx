import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useMyAuth } from '../../context/AuthContext'


export const LogoutButton = () => {
    const { logout } = useMyAuth()

    const handleSignOut = async () => {
        try {
            await AsyncStorage.removeItem('token')
            await logout()
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
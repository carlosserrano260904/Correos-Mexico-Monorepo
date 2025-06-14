import { View, Text } from 'react-native'
import React from 'react'
import { Link } from '@react-navigation/native'

export default function HomeUser() {
  return (
    <View>
      <Text>Bienvenido Usuario</Text>
      <Link 
        screen={'ProfileUser'}
      >Configuracion</Link>
    </View>
  )
}
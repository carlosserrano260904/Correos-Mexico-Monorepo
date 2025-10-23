import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import { ChevronRight, ArrowLeft } from 'lucide-react-native';
import { moderateScale } from 'react-native-size-matters';
import { RootStackParamList } from '../../schemas/schemas';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

type ReceivePackageRouteProp = RouteProp<RootStackParamList, 'RecibirPaquete'>;
type NavigationProp = StackNavigationProp<RootStackParamList, 'RecibirPaquete'>;

export default function ReceivePackage() {
  const navigation = useNavigation();
  const route = useRoute<ReceivePackageRouteProp>();
  const packageData = route.params.package;
  
  return (
    <View style={styles.container}>
        <View style={styles.arrowContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft size={moderateScale(24)}/>
          </TouchableOpacity>
        </View>

        <View style={styles.receiveContainer}>
          <View>
            <Text style={styles.receiveText}>¿Quien recibe?</Text>
          </View>
          <View>
            <TouchableOpacity style={styles.receiveItemContainer} onPress={() =>  navigation.navigate('TakeEvidencePhoto', { package: packageData, destinatario: packageData.destinatario })}>
              <Text style={styles.receiveItemText} numberOfLines={1} ellipsizeMode='tail'>{packageData.destinatario}</Text>
              <ChevronRight size={moderateScale(24)}/>
            </TouchableOpacity>

            <TouchableOpacity style={styles.receiveItemContainer} onPress={() =>  navigation.navigate('NombreQuienRecibe', { package: packageData, parentesco: "Familiar" })}>
              <Text style={styles.receiveItemText}>Familiar</Text>
              <ChevronRight size={moderateScale(24)}/>
            </TouchableOpacity>

            <TouchableOpacity style={styles.receiveItemContainer} onPress={() =>  navigation.navigate('NombreQuienRecibe', { package: packageData, parentesco: "Recepcion" })}>
              <Text style={styles.receiveItemText}>Recepción</Text>
              <ChevronRight size={moderateScale(24)}/>
            </TouchableOpacity>

            <TouchableOpacity style={styles.receiveItemContainer} onPress={() =>  navigation.navigate('NombreQuienRecibe', { package: packageData, parentesco: "Amigo" })}>
              <Text style={styles.receiveItemText}>Amigo</Text>
              <ChevronRight size={moderateScale(24)}/>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.receiveItemContainer} onPress={() =>  navigation.navigate('NombreQuienRecibe', { package: packageData, parentesco: "Vecino" })}>
              <Text style={styles.receiveItemText}>Vecino</Text>
              <ChevronRight size={moderateScale(24)}/>
            </TouchableOpacity>
          </View>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    height: screenHeight,
    backgroundColor: "white"
  },
  arrowContainer: {
    height: "10%",
    paddingHorizontal: moderateScale(20),
    paddingTop: moderateScale(40),
  },
  receiveContainer: {
    height: "90%",
    paddingHorizontal: moderateScale(20),
    flexDirection: "column",
  },
  receiveItemContainer: {
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: "center",
    marginBottom: moderateScale(24)
  },
  receiveText: {
    fontWeight: 600,
    fontSize: moderateScale(20),
    marginBottom: moderateScale(40),
    textAlign: "center"
  },
  receiveItemText: {
    fontWeight: 400,
    fontSize: moderateScale(16),
    width: "90%"
  }
});

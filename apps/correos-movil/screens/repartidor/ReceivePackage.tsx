import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import { ChevronRight, ArrowLeft } from 'lucide-react-native';
import { moderateScale } from 'react-native-size-matters';
import { useNavigation, useRoute } from '@react-navigation/native'
import axios from 'axios';

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

export default function ReceivePackage() {
  const navigation = useNavigation();
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
            <TouchableOpacity style={styles.receiveItemContainer} onPress={() => navigation.navigate("TomarEvidencia")}>
              <Text style={styles.receiveItemText} numberOfLines={1} ellipsizeMode='tail'>Juan Perez</Text>
              <ChevronRight size={moderateScale(24)}/>
            </TouchableOpacity>

            <TouchableOpacity style={styles.receiveItemContainer}>
              <Text style={styles.receiveItemText}>Familiar ó amigo</Text>
              <ChevronRight size={moderateScale(24)}/>
            </TouchableOpacity>

            <TouchableOpacity style={styles.receiveItemContainer}>
              <Text style={styles.receiveItemText}>Recepción</Text>
              <ChevronRight size={moderateScale(24)}/>
            </TouchableOpacity>

            <TouchableOpacity style={styles.receiveItemContainer}>
              <Text style={styles.receiveItemText}>Otro</Text>
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
    height: screenHeight
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

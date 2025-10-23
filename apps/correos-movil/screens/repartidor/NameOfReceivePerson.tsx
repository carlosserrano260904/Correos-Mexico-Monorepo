import { View, Text, StyleSheet, Dimensions, SafeAreaView, TouchableOpacity, TextInput } from 'react-native'
import * as React from 'react'
import { moderateScale } from 'react-native-size-matters';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;


export default function NameOfReceivePerson() {
    const navigation = useNavigation();
    const route = useRoute();
    const packageData = route.params.package;
    const { parentesco } = route.params as { parentesco: string };
    const [ nombre, setNombre ] = React.useState('')

    console.log("Parentesco: ", parentesco);

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.arrowContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft size={moderateScale(24)}/>
          </TouchableOpacity>
        </View>

        <View style={styles.textContainer}>
            <Text style={styles.text}>Nombre de quien recibe:</Text>
            <TextInput 
              placeholder="Nombre de quien recibe"
              placeholderTextColor='#979797'
              value={nombre}
              onChangeText={setNombre}
              style={styles.input}
            />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => {
              if (!nombre.trim()) {
                alert('Por favor ingresa el nombre de quien recibe.');
                return;
              }

              navigation.navigate('TakeEvidencePhoto', {
                package: packageData,
                destinatario: `${parentesco}: ${nombre.trim()}`,
              });
            }}
            
          >
            <Text style={styles.textButton}>Continuar</Text>
          </TouchableOpacity>
        </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    arrowContainer: {
      height: screenHeight * 0.1,
      paddingTop: moderateScale(40),
    },
    container:{
      width: screenWidth,
      height: screenHeight,
      backgroundColor: "white",
      paddingHorizontal: moderateScale(20),
    },
    textContainer: {
      height: screenHeight * 0.5,
    },
    input: {
      borderWidth: 1,
      borderColor: '#979797',
      borderRadius: moderateScale(8),
    },
    text: {
      fontSize: moderateScale(16),
      fontWeight: 600,
      marginBottom: moderateScale(12),
      marginTop: moderateScale(64)
    },
    buttonContainer: {
      height: screenHeight * 0.4,
      justifyContent: "flex-end"
    },
    button: {
      backgroundColor: "#DE1484",
      borderRadius: moderateScale(8),
      height: screenHeight *0.048,
      marginBottom: moderateScale(52),
      alignItems: "center",
      justifyContent: "center"
    },
    textButton: {
      fontSize: moderateScale(16),
      color: "white",
      fontWeight: 700
    }

})

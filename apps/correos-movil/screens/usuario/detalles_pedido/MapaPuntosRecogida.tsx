import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

const Colors = {
  primary: '#E91E63',
  secondary: '#FF6B9D',
  white: '#FFFFFF',
  black: '#000000',
  dark: '#212121',
  gray: '#757575',
  lightGray: '#E0E0E0',
  background: '#F5F5F5',
  border: '#E0E0E0',
};

const MapaPuntosRecogidaScreen = () => {
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header blanco sin rosa */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBack}
          accessibilityLabel="Regresar"
          accessibilityHint="Regresa a la pantalla anterior"
        >
          <Ionicons name="arrow-back" size={24} color={Colors.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Puntos de Recogida</Text>
        <View style={{ width: 24 }} /> {/* Espacio para balancear el header */}
      </View>

      <View style={styles.estadoContainer}>
        <Text style={styles.estadoLabel}>Estado: </Text>
        <Text style={styles.estadoValue}>Durango <Text style={{color: Colors.primary}}>▼</Text></Text>
      </View>

      <Text style={styles.contador}>
        <Text style={{color: Colors.primary, fontWeight: 'bold'}}>4</Text> puntos disponibles en Durango
      </Text>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Punto 1 */}
        <View style={styles.puntoContainer}>
          <View style={styles.iconContainer}>
            <Text style={styles.locationIcon}>📍</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.nombrePunto}>Correos de México - Centro Durango</Text>
            <Text style={styles.direccion}>Av. 20 de Noviembre 123, Centro</Text>
            <Text style={styles.direccion}>Victoria de Durango, Durango</Text>
            <View style={styles.detallesContainer}>
              <Text style={styles.horario}>🕐 Lun-Vie: 9:00-18:00, Sáb: 9:00-14:00</Text>
              <Text style={styles.telefono}>📞 618-123-4567</Text>
            </View>
            <View style={styles.serviciosContainer}>
              <View style={styles.servicioTag}>
                <Text style={styles.servicioText}>Paquetería</Text>
              </View>
              <View style={styles.servicioTag}>
                <Text style={styles.servicioText}>Sobres</Text>
              </View>
              <View style={styles.servicioTag}>
                <Text style={styles.servicioText}>Mensajería</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Punto 2 */}
        <View style={styles.puntoContainer}>
          <View style={styles.iconContainer}>
            <Text style={styles.locationIcon}>📍</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.nombrePunto}>Correos de México - Plaza Bicentenario</Text>
            <Text style={styles.direccion}>Blvd. Dolores del Río 655, Fracc. Silvestre Dorador</Text>
            <Text style={styles.direccion}>Victoria de Durango, Durango</Text>
            <View style={styles.detallesContainer}>
              <Text style={styles.horario}>🕐 Lun-Dom: 10:00-22:00</Text>
              <Text style={styles.telefono}>📞 618-987-6543</Text>
            </View>
            <View style={styles.serviciosContainer}>
              <View style={styles.servicioTag}>
                <Text style={styles.servicioText}>Paquetería</Text>
              </View>
              <View style={styles.servicioTag}>
                <Text style={styles.servicioText}>Sobres</Text>
              </View>
              <View style={styles.servicioTag}>
                <Text style={styles.servicioText}>Mensajería</Text>
              </View>
              <View style={styles.servicioTag}>
                <Text style={styles.servicioText}>Cajas</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Punto 3 */}
        <View style={styles.puntoContainer}>
          <View style={styles.iconContainer}>
            <Text style={styles.locationIcon}>📍</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.nombrePunto}>Correos de México - Guadalupe Victoria</Text>
            <Text style={styles.direccion}>Calle Constitución 456, Guadalupe Victoria</Text>
            <Text style={styles.direccion}>Victoria de Durango, Durango</Text>
            <View style={styles.detallesContainer}>
              <Text style={styles.horario}>🕐 Lun-Vie: 8:00-17:00, Sáb: 9:00-13:00</Text>
              <Text style={styles.telefono}>📞 618-456-7890</Text>
            </View>
            <View style={styles.serviciosContainer}>
              <View style={styles.servicioTag}>
                <Text style={styles.servicioText}>Paquetería</Text>
              </View>
              <View style={styles.servicioTag}>
                <Text style={styles.servicioText}>Sobres</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Punto 4 */}
        <View style={styles.puntoContainer}>
          <View style={styles.iconContainer}>
            <Text style={styles.locationIcon}>📍</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.nombrePunto}>Correos de México - Lerdo</Text>
            <Text style={styles.direccion}>Calle Juárez 321, Centro</Text>
            <Text style={styles.direccion}>Lerdo, Durango</Text>
            <View style={styles.detallesContainer}>
              <Text style={styles.horario}>🕐 Lun-Vie: 8:30-16:30</Text>
              <Text style={styles.telefono}>📞 618-234-5678</Text>
            </View>
            <View style={styles.serviciosContainer}>
              <View style={styles.servicioTag}>
                <Text style={styles.servicioText}>Paquetería</Text>
              </View>
              <View style={styles.servicioTag}>
                <Text style={styles.servicioText}>Sobres</Text>
              </View>
              <View style={styles.servicioTag}>
                <Text style={styles.servicioText}>Mensajería</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: width * 0.04,
    paddingBottom: height * 0.02,
    paddingTop: height * 0.06,
    backgroundColor: Colors.white,
    minHeight: height * 0.12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  backButton: {
    padding: width * 0.02,
  },
  headerTitle: {
    fontSize: Math.min(width * 0.045, 20),
    color: Colors.dark,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    marginLeft: -24,
  },
  estadoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  estadoLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  estadoValue: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '500',
  },
  contador: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  scrollView: {
    flex: 1,
  },
  puntoContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 5,
  },
  locationIcon: {
    fontSize: 24,
    color: Colors.primary,
  },
  infoContainer: {
    flex: 1,
  },
  nombrePunto: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  direccion: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  detallesContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  horario: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  telefono: {
    fontSize: 14,
    color: '#555',
  },
  serviciosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  servicioTag: {
    backgroundColor: '#FFE5F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 5,
  },
  servicioText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
});

export default MapaPuntosRecogidaScreen;

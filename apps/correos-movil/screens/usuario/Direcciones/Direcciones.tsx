import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    Keyboard,
    TouchableWithoutFeedback,
    View,
    BackHandler,
    Modal,
    FlatList,
} from 'react-native';
import { actualizarDireccionAPI, agregarDireccionAPI, eliminarDireccionAPI, obtenerDirecciones } from '../../../api/direcciones';
import { DireccionesSchema } from '../../../schemas/schemas';
import { obtenerDatosPorCodigoPostal } from '../../../api/postal';
import { useMyAuth } from '../../../context/AuthContext';
import AppHeader from '../../../components/common/AppHeader';
import Loader from '../../../components/common/Loader';

const PINK = '#E6007E';

export interface Direccion {
    id?: number;
    nombre: string;
    telefono: string;
    direccion: string;
    numerointerior: number | null;
    numeroexterior: number | null;
    masInfo?: string;
    codigoPostal: string;
    municipio: string;
    colonia: string;
    estado: string;
}

interface ListaDireccionesProps {
    direcciones: Direccion[];
    onAgregarNueva: () => void;
    onEditar: (index: number) => void;
    onEliminar: (index: number) => void;
    navigation: any;
    direccionSeleccionada: number | null;
    setDireccionSeleccionada: (id: number) => void;
    modoSeleccion: boolean;
}

function adaptarDireccion(apiDir: (typeof DireccionesSchema._type)): Direccion {
    return {
        id: apiDir.id,
        nombre: apiDir.nombre,
        telefono: String(apiDir.numero_celular),
        direccion: apiDir.calle,
        numerointerior: apiDir.numero_interior ?? null,
        numeroexterior: apiDir.numero_exterior ?? null,
        masInfo: apiDir.mas_info,
        codigoPostal: apiDir.codigo_postal,
        municipio: apiDir.municipio,
        colonia: apiDir.colonia_fraccionamiento,
        estado: apiDir.estado,
    };
}

function ListaDirecciones({ direcciones, onAgregarNueva, onEditar, onEliminar, navigation, direccionSeleccionada, setDireccionSeleccionada, modoSeleccion }: ListaDireccionesProps & { modoSeleccion: boolean }) {

    const confirmarSeleccion = async () => {
        if (direccionSeleccionada === null) {
            Alert.alert('Selecciona una dirección');
            return;
        }

        const direccion = direcciones.find(d => d.id === direccionSeleccionada);
        if (!direccion) {
            Alert.alert('Error', 'La dirección seleccionada no existe');
            return;
        }

        try {
            await AsyncStorage.setItem('direccionSeleccionadaId', String(direccion.id));
            navigation.goBack();
        } catch (error) {
            console.error('Error al guardar dirección:', error);
            Alert.alert('Error', 'No se pudo guardar la dirección seleccionada');
        }
    };

    return (
        <>
            <AppHeader title="Mis Direcciones" onBack={() => navigation.goBack()} />

            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                <Text style={styles.sectionTitle}>Direcciones guardadas</Text>

                {direcciones.length === 0 ? (
                    <Text>No hay direcciones guardadas.</Text>
                ) : (
                    direcciones.map((dir, index) => (
                        <View key={index} style={styles.card}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.cardTitle}>
                                    {dir.direccion} {dir.numeroexterior}
                                </Text>

                                {modoSeleccion && (
                                    <TouchableOpacity
                                        onPress={() => setDireccionSeleccionada(dir.id!)}
                                        style={{ paddingHorizontal: 5 }}
                                    >
                                        <Ionicons
                                            name={
                                                direccionSeleccionada === dir.id
                                                    ? 'radio-button-on'
                                                    : 'radio-button-off'
                                            }
                                            size={22}
                                            color={PINK}
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>
                            <Text>Nombre: {dir.nombre}</Text>
                            <Text>Teléfono: {dir.telefono}</Text>
                            {dir.numerointerior != null && <Text>Número interior: {dir.numerointerior}</Text>}
                            {dir.masInfo && <Text>Más info: {dir.masInfo}</Text>}
                            <Text>Código postal: {dir.codigoPostal}</Text>
                            <Text>Colonia: {dir.colonia}</Text>
                            <Text>Municipio: {dir.municipio}</Text>
                            <Text>Estado: {dir.estado}</Text>

                            <View style={styles.cardButtons}>
                                <TouchableOpacity
                                    style={[styles.iconButton, { backgroundColor: '#E6007E' }]}
                                    onPress={() => onEditar(index)}
                                >
                                    <Ionicons name="pencil" size={17} color="#fff" />
                                </TouchableOpacity>

                                {!modoSeleccion && (
                                    <TouchableOpacity
                                        style={[styles.iconButton, { backgroundColor: '#FF3B30' }]}
                                        onPress={() =>
                                            Alert.alert('Confirmar eliminación', '¿Seguro que quieres eliminar esta dirección?', [
                                                { text: 'Cancelar', style: 'cancel' },
                                                { text: 'Eliminar', style: 'destructive', onPress: () => onEliminar(index) },
                                            ])
                                        }
                                    >
                                        <Ionicons name="trash" size={17} color="#fff" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    ))
                )}

                {!modoSeleccion && (
                    <TouchableOpacity style={styles.button} onPress={onAgregarNueva}>
                        <Text style={styles.buttonText}>Agregar nueva dirección</Text>
                    </TouchableOpacity>
                )}

                {modoSeleccion && (
                    <View>
                    <TouchableOpacity style={styles.button} onPress={onAgregarNueva}>
                    <Text style={styles.buttonText}>Agregar nueva dirección</Text>
                     </TouchableOpacity>
                   
                    <TouchableOpacity style={styles.button} onPress={confirmarSeleccion}>
                        <Text style={styles.buttonText}>Usar esta dirección</Text>
                    </TouchableOpacity>
                    </View>
                )}

            </ScrollView>
        </>
    );
}

export default function AgregarDomicilio({ navigation, route }: { navigation: any, route: any }) {
    const [direcciones, setDirecciones] = useState<Direccion[]>([]);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [coloniasDisponibles, setColoniasDisponibles] = useState<string[]>([]);
    const [mostrarColonias, setMostrarColonias] = useState(false);
    const { userId } = useMyAuth();
    const [codigoPostalValido, setCodigoPostalValido] = useState(true);
    const modoSeleccion = route?.params?.modoSeleccion || false;

    // NUEVOS ESTADOS PARA EL MODAL DE COLONIAS
    const [modalColoniasVisible, setModalColoniasVisible] = useState(false);
    const [coloniaBuscada, setColoniaBuscada] = useState('');
    const [coloniasFiltradas, setColoniasFiltradas] = useState<string[]>([]);

    const [direccionSeleccionada, setDireccionSeleccionada] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const backAction = () => {
            if (mostrarFormulario) {
                setMostrarFormulario(false);
                setEditIndex(null);
                return true;
            }
            return false;
        };

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

        return () => backHandler.remove();
    }, [mostrarFormulario]);

    const [formData, setFormData] = useState<Omit<Direccion, 'numerointerior' | 'numeroexterior'> & {
        numerointerior: string;
        numeroexterior: string;
    }>({
        nombre: '',
        telefono: '',
        direccion: '',
        numerointerior: '',
        numeroexterior: '',
        masInfo: '',
        codigoPostal: '',
        municipio: '',
        colonia: '',
        estado: '',
    });

    // FUNCIÓN PARA FILTRAR COLONIAS
    useEffect(() => {
        if (coloniaBuscada) {
            const filtered = coloniasDisponibles.filter(colonia =>
                colonia.toLowerCase().includes(coloniaBuscada.toLowerCase())
            );
            setColoniasFiltradas(filtered);
        } else {
            setColoniasFiltradas(coloniasDisponibles);
        }
    }, [coloniaBuscada, coloniasDisponibles]);

    // COMPONENTE DEL MODAL DE COLONIAS
    const ModalColonias = () => (
        <Modal
            visible={modalColoniasVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setModalColoniasVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {/* Header del Modal */}
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Selecciona una colonia</Text>
                        <TouchableOpacity 
                            onPress={() => setModalColoniasVisible(false)}
                            style={styles.closeButton}
                        >
                            <Ionicons name="close" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    {/* Barra de búsqueda */}
                    <View style={styles.searchContainer}>
                        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Buscar colonia..."
                            value={coloniaBuscada}
                            onChangeText={setColoniaBuscada}
                            placeholderTextColor="#999"
                        />
                    </View>

                    {/* Lista de colonias */}
                    <FlatList
                        data={coloniasFiltradas}
                        keyExtractor={(item, index) => index.toString()}
                        style={styles.coloniasList}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.coloniaItem,
                                    formData.colonia === item && styles.coloniaItemSelected
                                ]}
                                onPress={() => {
                                    handleChange('colonia', item);
                                    setModalColoniasVisible(false);
                                    setColoniaBuscada('');
                                }}
                            >
                                <Text style={[
                                    styles.coloniaText,
                                    formData.colonia === item && styles.coloniaTextSelected
                                ]}>
                                    {item}
                                </Text>
                                {formData.colonia === item && (
                                    <Ionicons name="checkmark" size={20} color={PINK} />
                                )}
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={
                            <View style={styles.emptyState}>
                                <Ionicons name="location-outline" size={40} color="#ccc" />
                                <Text style={styles.emptyStateText}>
                                    {coloniasDisponibles.length === 0 
                                        ? 'No hay colonias disponibles' 
                                        : 'No se encontraron colonias'
                                    }
                                </Text>
                            </View>
                        }
                    />

                    {/* Contador de resultados */}
                    <View style={styles.resultsCounter}>
                        <Text style={styles.resultsText}>
                            {coloniasFiltradas.length} de {coloniasDisponibles.length} colonias
                        </Text>
                    </View>
                </View>
            </View>
        </Modal>
    );

    const guardarDatos = async () => {
        if (!formData.nombre || !formData.telefono || !formData.direccion || !formData.codigoPostal || !formData.municipio || !formData.colonia || !formData.estado) {
            Alert.alert('Error', 'Por favor, completa todos los campos obligatorios.');
            return;
        }

        const payload: Direccion = {
            ...formData,
            numeroexterior: formData.numeroexterior ? parseInt(formData.numeroexterior) : null,
            numerointerior: formData.numerointerior ? parseInt(formData.numerointerior) : null,
        };

        try {
            if (editIndex !== null && direcciones[editIndex].id) {
                const id = direcciones[editIndex].id!;
                await actualizarDireccionAPI(id, payload);
            } else {
                await agregarDireccionAPI(payload, userId);
            }

            const resultado = await obtenerDirecciones(userId);
            const adaptadas = resultado.map(adaptarDireccion);
            setDirecciones(adaptadas);
            setMostrarFormulario(false);
            setEditIndex(null);
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'No se pudo guardar la dirección');
        }
    };

    useEffect(() => {
        async function cargar() {
            try {
                const resultado = await obtenerDirecciones(userId);
                const adaptadas = resultado.map(adaptarDireccion);
                setDirecciones(adaptadas);
            } catch (err) {
                console.error('Error cargando direcciones:', err);
                Alert.alert('Error', 'No se pudieron cargar las direcciones');
            } finally {
                setLoading(false);
            }
        }

        cargar();
    }, []);

    const handleChange = (key: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const editarDireccion = (index: number) => {
        const dir = direcciones[index];
        setFormData({
            ...dir,
            numeroexterior: dir.numeroexterior !== null ? String(dir.numeroexterior) : '',
            numerointerior: dir.numerointerior !== null ? String(dir.numerointerior) : '',
        });
        setEditIndex(index);
        setMostrarFormulario(true);
    };

    const eliminarDireccion = async (index: number) => {
        const direccion = direcciones[index];
        if (direccion.id === undefined) {
            Alert.alert('Error', 'La dirección no tiene un ID válido');
            return;
        }

        try {
            await eliminarDireccionAPI(direccion.id);
            const resultado = await obtenerDirecciones(userId);
            const adaptadas = resultado.map(adaptarDireccion);
            setDirecciones(adaptadas);
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'No se pudo eliminar la dirección');
        }
    };
    
    function isNombreValido(nombre: string): boolean {
        if (nombre.length < 3) return false;
        const letras = nombre.toLowerCase().replace(/\s/g, '');
        return !/^([a-zA-Z])\1+$/.test(letras);
    }

    if (loading) {
        return <Loader message="Cargando tus direcciones..." />;
    }
    
    if (mostrarFormulario) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                <ModalColonias />
                
                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View>
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: '#555', marginBottom: 20 }]}
                                onPress={() => {
                                    setCodigoPostalValido(true);
                                    setMostrarFormulario(false);
                                    setEditIndex(null);
                                    setFormData({
                                        nombre: '',
                                        telefono: '',
                                        direccion: '',
                                        numerointerior: '',
                                        numeroexterior: '',
                                        masInfo: '',
                                        codigoPostal: '',
                                        municipio: '',
                                        colonia: '',
                                        estado: '',
                                    });
                                }}
                            >
                                <Text style={styles.buttonText}>← Volver a la lista</Text>
                            </TouchableOpacity>

                            <Text style={styles.sectionTitle}>Datos Personales</Text>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Nombre *</Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        formData.nombre.length === 0
                                            ? null
                                            : isNombreValido(formData.nombre)
                                                ? styles.inputValido
                                                : styles.inputInvalido,
                                    ]}
                                    value={formData.nombre}
                                    maxLength={40}
                                    onChangeText={(text) => handleChange('nombre', text)}
                                />
                                {formData.nombre.length > 0 && !isNombreValido(formData.nombre) && (
                                    <Text style={styles.errorText}>Ingresa un nombre válido (mínimo 3 letras, sin letras repetidas).</Text>
                                )}
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Teléfono móvil *</Text>
                                <TextInput
                                    keyboardType="phone-pad"
                                    style={[styles.input,
                                    formData.telefono.length === 0
                                        ? null
                                        : formData.telefono.length === 10
                                            ? styles.inputValido
                                            : styles.inputInvalido,
                                    ]}
                                    value={formData.telefono}
                                    onChangeText={(text) => {
                                        const clean = text.replace(/[^0-9]/g, '');
                                        if (clean.length <= 20) {
                                            handleChange('telefono', clean);
                                        }
                                    }}
                                />
                            </View>

                            <Text style={styles.sectionTitle}>Datos de envío</Text>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Dirección *</Text>
                                <TextInput
                                    style={[styles.input,
                                    formData.direccion.length === 0
                                        ? null
                                        : formData.direccion.length >= 3
                                            ? styles.inputValido
                                            : styles.inputInvalido,
                                    ]}
                                    value={formData.direccion}
                                    maxLength={99}
                                    onChangeText={(text) => handleChange('direccion', text)}
                                />
                            </View>

                            <View style={styles.row}>
                                <View style={[styles.inputContainer, styles.halfInput]}>
                                    <Text style={styles.label}>Número exterior</Text>
                                    <TextInput
                                        style={[styles.input,
                                        formData.numeroexterior.length === 0
                                            ? null
                                            : formData.numeroexterior.length > 0
                                                ? styles.inputValido
                                                : styles.inputInvalido,
                                        ]}
                                        value={formData.numeroexterior ?? ''}
                                        keyboardType="number-pad"
                                        onChangeText={(text) => {
                                            const soloNumeros = text.replace(/[^0-9]/g, '');
                                            if (soloNumeros === '') {
                                                handleChange('numeroexterior', soloNumeros);
                                                return;
                                            }
                                            const valor = parseInt(soloNumeros, 10);
                                            if (!isNaN(valor) && valor < 32768) {
                                                handleChange('numeroexterior', soloNumeros);
                                            } else {
                                                Alert.alert('Valor inválido', 'El número exterior es muy largo');
                                            }
                                        }}
                                    />
                                </View>

                                <View style={[styles.inputContainer, styles.halfInput]}>
                                    <Text style={styles.label}>Número interior</Text>
                                    <TextInput
                                        style={[styles.input,
                                        formData.numerointerior.length === 0
                                            ? null
                                            : formData.numerointerior.length >= 0
                                                ? styles.inputValido
                                                : styles.inputInvalido,
                                        ]}
                                        value={formData.numerointerior ?? ''}
                                        keyboardType="number-pad"
                                        onChangeText={(text) => {
                                            const soloNumeros = text.replace(/[^0-9]/g, '');
                                            if (soloNumeros === '') {
                                                handleChange('numerointerior', soloNumeros);
                                                return;
                                            }
                                            const valor = parseInt(soloNumeros, 10);
                                            if (!isNaN(valor) && valor < 32768) {
                                                handleChange('numerointerior', soloNumeros);
                                            } else {
                                                Alert.alert('Valor inválido', 'El número interior es muy largo');
                                            }
                                        }}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Más información</Text>
                                <TextInput
                                    style={[styles.input,
                                    formData.masInfo.length === 0
                                        ? null
                                        : formData.masInfo.length > 3
                                            ? styles.inputValido
                                            : styles.inputInvalido,
                                    ]}
                                    value={formData.masInfo}
                                    maxLength={99}
                                    onChangeText={(text) => handleChange('masInfo', text)}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Código Postal *</Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        formData.codigoPostal.length === 0
                                            ? null
                                            : codigoPostalValido
                                                ? styles.inputValido
                                                : styles.inputInvalido,

                                    ]}

                                    value={formData.codigoPostal}
                                    keyboardType="number-pad"
                                    maxLength={5}
                                    onChangeText={async (text) => {
                                        const clean = text.replace(/[^0-9]/g, '');

                                        if (clean.length <= 5) {
                                            handleChange('codigoPostal', clean);
                                            setCodigoPostalValido(false);
                                            if (clean.length === 5) {
                                                try {
                                                    const resultado = await obtenerDatosPorCodigoPostal(clean);
                                                    if (resultado && resultado.length > 0) {
                                                        setCodigoPostalValido(true);
                                                        const colonias = resultado.map((item: any) => item.d_asenta);
                                                        setColoniasDisponibles(colonias);
                                                        setMostrarColonias(colonias.length > 0);
                                                        handleChange('colonia', '');
                                                        const datos = resultado[0];
                                                        handleChange('municipio', datos.d_mnpio);
                                                        handleChange('estado', datos.d_estado);
                                                    } else {
                                                        setCodigoPostalValido(false);
                                                    }
                                                } catch (error) {
                                                    Alert.alert('Error', 'No se pudo buscar el código postal');
                                                }
                                            }
                                        }
                                    }}
                                />
                                {codigoPostalValido == false && formData.codigoPostal.length > 0 && (
                                    <Text style={styles.errorText}>No se encontraron datos para este código postal o no existe</Text>
                                )}
                            </View>

                            {/* NUEVO SELECTOR DE COLONIAS */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Colonia *</Text>
                                <TouchableOpacity 
                                    style={[
                                        styles.coloniaSelector,
                                        formData.colonia ? styles.inputValido : styles.inputInvalido,
                                        !codigoPostalValido && styles.inputInvalido
                                    ]}
                                    onPress={() => {
                                        if (coloniasDisponibles.length > 0) {
                                            setModalColoniasVisible(true);
                                        }
                                    }}
                                    disabled={coloniasDisponibles.length === 0}
                                >
                                    <Text style={[
                                        styles.coloniaSelectorText,
                                        !formData.colonia && styles.placeholderText
                                    ]}>
                                        {formData.colonia || 'Selecciona una colonia'}
                                    </Text>
                                    <Ionicons 
                                        name="chevron-down" 
                                        size={20} 
                                        color={coloniasDisponibles.length === 0 ? '#ccc' : '#666'} 
                                    />
                                </TouchableOpacity>
                                
                                {coloniasDisponibles.length === 0 && formData.codigoPostal.length === 5 && (
                                    <Text style={styles.helperText}>
                                        Ingresa un código postal válido para ver las colonias
                                    </Text>
                                )}
                                
                                {coloniasDisponibles.length > 0 && (
                                    <Text style={styles.helperText}>
                                        {coloniasDisponibles.length} colonias disponibles
                                    </Text>
                                )}
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Municipio</Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        formData.codigoPostal.length === 0
                                            ? null
                                            : codigoPostalValido
                                                ? styles.inputValido
                                                : styles.inputInvalido,

                                    ]}
                                    value={formData.municipio}
                                    editable={false}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Estado</Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        formData.codigoPostal.length === 0
                                            ? null
                                            : codigoPostalValido
                                                ? styles.inputValido
                                                : styles.inputInvalido,

                                    ]}
                                    value={formData.estado}
                                    editable={false}
                                />
                            </View>

                            <TouchableOpacity style={styles.button} onPress={guardarDatos}>
                                <Text style={styles.buttonText}>
                                    {editIndex !== null ? 'Guardar cambios' : 'Guardar datos'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </ScrollView>

            </SafeAreaView>
        );
    }

    return (
        <ListaDirecciones
            direcciones={direcciones}
            onAgregarNueva={() => {
                setFormData({
                    nombre: '',
                    telefono: '',
                    direccion: '',
                    numerointerior: '',
                    numeroexterior: '',
                    masInfo: '',
                    codigoPostal: '',
                    municipio: '',
                    colonia: '',
                    estado: '',
                });
                setEditIndex(null);
                setMostrarFormulario(true);
            }}
            onEditar={editarDireccion}
            onEliminar={eliminarDireccion}
            navigation={navigation}
            direccionSeleccionada={direccionSeleccionada}
            setDireccionSeleccionada={setDireccionSeleccionada}
            modoSeleccion={modoSeleccion}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f7f7f7',
        flex: 1,
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginVertical: 10,
        color: '#333',
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 12,
        fontSize: 14,
        borderColor: '#ddd',
        borderWidth: 1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfInput: {
        width: '48%',
    },
    button: {
        backgroundColor: '#E6007E',
        paddingVertical: 14,
        borderRadius: 30,
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    cardTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 6,
        color: '#333',
    },
    cardButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
    },
    smallButton: {
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 20,
        marginLeft: 10,
    },
    smallButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    iconButton: {
        padding: 10,
        borderRadius: 25,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        marginBottom: 8,
    },
    label: {
        marginBottom: 1,
        fontWeight: 'normal',
        color: '#333',
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        overflow: 'hidden',
    },
    inputValido: {
        borderColor: 'green',
        borderWidth: 1,
    },
    inputInvalido: {
        borderColor: 'red',
        borderWidth: 1,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
    },

    // NUEVOS ESTILOS PARA EL MODAL DE COLONIAS
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
        paddingBottom: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        padding: 4,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 20,
        marginBottom: 10,
        backgroundColor: '#f8f8f8',
        borderRadius: 12,
        paddingHorizontal: 15,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
        color: '#333',
    },
    coloniasList: {
        maxHeight: 300,
        marginHorizontal: 20,
    },
    coloniaItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    coloniaItemSelected: {
        backgroundColor: '#fce4f1',
        borderRadius: 8,
    },
    coloniaText: {
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
    coloniaTextSelected: {
        color: PINK,
        fontWeight: '600',
    },
    emptyState: {
        alignItems: 'center',
        padding: 40,
    },
    emptyStateText: {
        marginTop: 10,
        color: '#666',
        textAlign: 'center',
    },
    resultsCounter: {
        paddingHorizontal: 20,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    resultsText: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },

    // ESTILOS PARA EL SELECTOR DE COLONIA EN EL FORMULARIO
    coloniaSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 15,
        marginBottom: 8,
        borderColor: '#ddd',
        borderWidth: 1,
    },
    coloniaSelectorText: {
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
    placeholderText: {
        color: '#999',
    },
    helperText: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
});
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { actualizarDireccionAPI, agregarDireccionAPI, eliminarDireccionAPI, obtenerDirecciones } from '../../../api/direcciones';
import { Picker } from '@react-native-picker/picker';
import { DireccionesSchema } from '../../../schemas/schemas';
import { obtenerDatosPorCodigoPostal } from '../../../api/postal';

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
}

function adaptarDireccion(apiDir: (typeof DireccionesSchema._type)): Direccion {
    return {
        id: apiDir.id,
        nombre: apiDir.nombre,
        telefono: String(apiDir.numero_celular),
        direccion: apiDir.calle,
        numerointerior: apiDir.numero_interior != null ? apiDir.numero_interior : null,
        numeroexterior: apiDir.numero_exterior != null ? apiDir.numero_exterior : null,
        masInfo: apiDir.mas_info,
        codigoPostal: apiDir.codigo_postal,
        municipio: apiDir.municipio,
        colonia: apiDir.colonia_fraccionamiento,
        estado: apiDir.estado,
    };
}

function ListaDirecciones({ direcciones, onAgregarNueva, onEditar, onEliminar }: ListaDireccionesProps) {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.sectionTitle}>Direcciones guardadas</Text>

            {direcciones.length === 0 ? (
                <Text>No hay direcciones guardadas.</Text>
            ) : (
                direcciones.map((dir, index) => (
                    <View key={index} style={styles.card}>
                        <Text style={styles.cardTitle}>
                            {dir.direccion} {dir.numeroexterior}
                        </Text>
                        <Text>Nombre: {dir.nombre}</Text>
                        <Text>Teléfono: {dir.telefono}</Text>
                        {dir.numerointerior != null ? <Text>Número interior: {dir.numerointerior}</Text> : null}
                        {dir.masInfo ? <Text>Más info: {dir.masInfo}</Text> : null}
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

                            <TouchableOpacity
                                style={[styles.iconButton, { backgroundColor: '#FF3B30' }]}
                                onPress={() =>
                                    Alert.alert(
                                        'Confirmar eliminación',
                                        '¿Seguro que quieres eliminar esta dirección?',
                                        [
                                            { text: 'Cancelar', style: 'cancel' },
                                            { text: 'Eliminar', style: 'destructive', onPress: () => onEliminar(index) },
                                        ]
                                    )
                                }
                            >
                                <Ionicons name="trash" size={17} color="#fff" />
                            </TouchableOpacity>
                        </View>

                    </View>
                ))
            )}

            <TouchableOpacity style={styles.button} onPress={onAgregarNueva}>
                <Text style={styles.buttonText}>Agregar nueva dirección</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

export default function AgregarDomicilio() {
    const [direcciones, setDirecciones] = useState<Direccion[]>([]);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [coloniasDisponibles, setColoniasDisponibles] = useState<string[]>([]);
    const [mostrarColonias, setMostrarColonias] = useState(false);

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
                await agregarDireccionAPI(payload, 1);
            }

            const resultado = await obtenerDirecciones(1);
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
                const resultado = await obtenerDirecciones(1);
                const adaptadas = resultado.map(adaptarDireccion);
                setDirecciones(adaptadas);
            } catch (err) {
                console.error('Error cargando direcciones:', err);
                Alert.alert('Error', 'No se pudieron cargar las direcciones');
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
            const resultado = await obtenerDirecciones(1);
            const adaptadas = resultado.map(adaptarDireccion);
            setDirecciones(adaptadas);
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'No se pudo eliminar la dirección');
        }
    };

    if (mostrarFormulario) {
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 80}
        >
             <ScrollView
    contentContainerStyle={styles.content}
    keyboardShouldPersistTaps="handled"
  >
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#555', marginBottom: 20 }]}
                    onPress={() => {
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

                    <TextInput
                        placeholder="Nombre *"
                        style={styles.input}
                        value={formData.nombre}
                        maxLength={99}
                        onChangeText={(text) => handleChange('nombre', text)}
                        />
                    <TextInput
                        placeholder="Teléfono móvil *"
                        keyboardType="phone-pad"
                        style={styles.input}
                        value={formData.telefono}
                        onChangeText={(text) => {
                            const clean = text.replace(/[^0-9]/g, '');
                            if (clean.length <= 20) {
                                handleChange('telefono', clean);
                            }
                        }}
                    />

                    <Text style={styles.sectionTitle}>Datos de envío</Text>

                    <TextInput
                        placeholder="Dirección *"
                        style={styles.input}
                        value={formData.direccion}
                        maxLength={99}
                        onChangeText={(text) => handleChange('direccion', text)}
                    />

                    <TextInput
                        placeholder="Número exterior"
                        style={styles.input}
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

                    <TextInput
                        placeholder="Número interior"
                        style={styles.input}
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
                    <TextInput
                        placeholder="Más información"
                        style={styles.input}
                        value={formData.masInfo}
                        maxLength={99}
                        onChangeText={(text) => handleChange('masInfo', text)}
                    />

                    <TextInput
                        placeholder="Código postal *"
                        style={[styles.input, styles.halfInput]}
                        value={formData.codigoPostal}
                        keyboardType="number-pad"
                        maxLength={5}
                        onChangeText={async (text) => {
                            const clean = text.replace(/[^0-9]/g, '');
                            if (clean.length <= 5) {
                                handleChange('codigoPostal', clean);

                                if (clean.length === 5) {
                                    const resultado = await obtenerDatosPorCodigoPostal(clean);
                                    if (resultado && resultado.length > 0) {
                                        const colonias = resultado.map((item: any) => item.d_asenta);

                                        setColoniasDisponibles(colonias);
                                        setMostrarColonias(colonias.length > 0);
                                        handleChange('colonia', '');

                                        const datos = resultado[0];
                                        handleChange('municipio', datos.d_mnpio);
                                        handleChange('estado', datos.d_estado);
                                    } else {
                                        Alert.alert('Aviso', 'No se encontraron datos para este código postal');
                                    }
                                }
                            }
                        }}
                    />

                    {mostrarColonias && coloniasDisponibles.length > 0 && (
                        <View style={styles.input}>
                            <Picker
                                selectedValue={formData.colonia}
                                onValueChange={(itemValue: string) => handleChange('colonia', itemValue)}
                            >
                                <Picker.Item label="Selecciona una colonia" value="" />
                                {coloniasDisponibles.map((colonia, index) => (
                                    <Picker.Item key={index} label={colonia} value={colonia} />
                                ))}
                            </Picker>
                        </View>
                    )}

                    <TextInput
                        placeholder="Municipio"
                        style={styles.input}
                        value={formData.municipio}
                        editable={false}
                    />

                    <TextInput
                        placeholder="Estado"
                        style={styles.input}
                        value={formData.estado}
                        editable={false}
                    />

                    <TouchableOpacity style={styles.button} onPress={guardarDatos}>
                        <Text style={styles.buttonText}>
                            {editIndex !== null ? 'Guardar cambios' : 'Guardar datos'}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
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
        />
    );
}

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
});

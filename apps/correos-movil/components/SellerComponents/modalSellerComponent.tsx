import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView, TextInput, TouchableOpacity, FlatList, Modal } from "react-native";
import { RadioButton } from "react-native-paper";
import { moderateScale } from "react-native-size-matters";
import { CircleSlash, Pause, SquarePen, ChevronDown } from "lucide-react-native";
import ButtonSellerComponent from "./buttonSellerComponent";
import ImagenesInput from "./ImagesInpuntComponent";

const screenWidht = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

export default function ModalSellerComponent({
    onPressNormalButton,
    onPressCancelButton,
    type
} : {
    onPressNormalButton: any,
    onPressCancelButton: any,
    type: 
        'actualizar-cupon' | 
        'actualizar-producto' | 
        'quitar-cupon' | 
        'quitar-producto' | 
        'asiganar-cupon-usuario'
    ;
}) {

    const [typeAmount, setTypeAmount] = useState('cantidad');
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
    const [selectedCategorie, setSelectedCategorie] = useState<string | null>(null);
    const [listVisible, setListVisible] = useState(false);
    const [dateStart, setDateStart] = useState('');
    const [dateExpired, setDateExpired] = useState('');
    const [amountStock, setAmountStock] = useState('');

    const products = [
        { id: '1', nombre: 'Camiseta' },
        { id: '2', nombre: 'Pantalón' },
        { id: '3', nombre: 'Zapatos ' },
    ];

    const categories = [
        { id: '1', nombre: 'Ropa y calzado' },
        { id: '2', nombre: 'Linea blanca' },
        { id: '3', nombre: 'Jugueteria' },
    ];

    const handleSelect = (item: string) => {
        setSelectedProduct(item);
        setListVisible(false);
    };

    const handleSelectCategories = (item: string) => {
        setSelectedCategorie(item);
        setListVisible(false);
    };

    // Función que aplica formato dd/mm/yyyy mientras el usuario escribe
    const handleDateChange = (text: string) => {
        // Eliminar todo lo que no sean números
        const cleaned = text.replace(/\D/g, '');

        // Insertar "/" en las posiciones correctas
        let formatted = cleaned;
        if (cleaned.length > 2 && cleaned.length <= 4) {
        formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
        } else if (cleaned.length > 4) {
        formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
        }

        // 3️⃣ Limitar a máximo 10 caracteres (dd/mm/yyyy)
        if (formatted.length > 10) formatted = formatted.slice(0, 10);

        return formatted;
    };

    const handleAmountChange = (text: string) => {
        // Eliminar todo lo que no sean números
        const cleaned = text.replace(/\D/g, '');

        let nuberFormatted = cleaned;

        return nuberFormatted;
    }


    return(
        <View style={styles.centeredView}> 
            {
                type === 'quitar-cupon' ? (
                    <View style={styles.modalView}>
                        <View>
                            <Text style={styles.text}>
                                ¿Estás seguro de que quieres deshabilitar este cupón?
                            </Text>
                        </View>

                        <View style={styles.buttonsContainer}>
                            <ButtonSellerComponent 
                                type={'normal'} 
                                haveIcon={true} 
                                icon={<CircleSlash color={'white'} size={moderateScale(16)} strokeWidth={3}/>}
                                text={'Deshabilitar'} 
                                onPressButton={onPressNormalButton}
                            />
                            <ButtonSellerComponent 
                                type={'cancel'} 
                                haveIcon={false} 
                                text={'Cancelar'} 
                                onPressButton={onPressCancelButton}
                            />
                        </View>
                    </View>
                ) : type === 'quitar-producto' ? (
                    <View style={styles.modalView}>
                        <View>
                            <Text style={styles.text}>
                                ¿Estás seguro de que quieres pausar este producto?
                            </Text>
                        </View>

                        <View style={styles.buttonsContainer}>
                            <ButtonSellerComponent 
                                type={'normal'} 
                                haveIcon={true} 
                                icon={<Pause color={'white'} size={moderateScale(16)} strokeWidth={3}/>}
                                text={'Pausar'} 
                                onPressButton={onPressNormalButton}
                            />
                            <ButtonSellerComponent 
                                type={'cancel'} 
                                haveIcon={false} 
                                text={'Cancelar'} 
                                onPressButton={onPressCancelButton}
                            />
                        </View>
                    </View>
                ) : type === 'actualizar-cupon' ? (
                    <View style={styles.modalView}>
                        <View style={styles.editTitleContainer}>
                            <SquarePen size={moderateScale(20)} color={'#030712'} strokeWidth={3}/>
                            <Text style={styles.editTitle}>Editar/Actualizar Cupón</Text>
                        </View>
                        <View style={styles.inputsContainer}>
                            <View style={styles.textInputContainer}>
                                <Text style={styles.label}>Nombre</Text>
                                <TextInput maxLength={15} selectionColor={'#DE1484'} placeholder="Nombre no mayor a 15 caracteres" placeholderTextColor={'#9CA3AF'} style={styles.textInput}/>
                            </View>
                            <View style={styles.textInputContainer}>
                                <View style={styles.separationContainer}>
                                    <Text style={styles.label}>Tipo de descuento</Text>
                                    <RadioButton.Group onValueChange={setTypeAmount} value={typeAmount}>
                                        <View style={styles.radioButtonsContainer}>
                                            <View style={styles.radioButton}>
                                                <RadioButton value="cantidad" color={'#DE1484'} />
                                                <Text style={styles.radioButtonText}>Cantidad</Text>
                                            </View>
                                            <View style={styles.radioButton}>
                                                <RadioButton value="porcentaje" color={'#DE1484'} />
                                                <Text style={styles.radioButtonText}>Porcentaje</Text>
                                            </View>
                                        </View>
                                    </RadioButton.Group>
                                </View>
                                <View style={styles.separationContainer}>
                                    {typeAmount && typeAmount === 'cantidad' ? (
                                        <Text style={styles.label}>Ingresa la cantidad en pesos</Text>
                                    ) : <Text style={styles.label}>Ingresa la cantidad en porcentaje</Text>}
                                    
                                    <TextInput 
                                        inputMode={typeAmount === 'cantidad' ? 'decimal' : 'numeric'} 
                                        placeholder={typeAmount === 'cantidad' ? "Cantidad en pesos" : "Cantidad en porcentaje"} 
                                        placeholderTextColor={'#9CA3AF'} 
                                        selectionColor={'#DE1484'} 
                                        style={styles.textInput}
                                    />
                                </View>
                            </View>
                            <View style={styles.textInputDateContainer}>
                                <View style={styles.separationDateContainer}>
                                    <Text style={styles.label}>Inicio</Text>
                                    <TextInput 
                                        value={dateStart} 
                                        onChangeText={(text) => setDateStart(handleDateChange(text))} 
                                        keyboardType="number-pad"
                                        maxLength={10}
                                        placeholder="DD/MM/AA" 
                                        placeholderTextColor={'#9CA3AF'} 
                                        selectionColor={'#DE1484'} 
                                        style={styles.textInput}
                                    />
                                </View>
                                <View style={styles.separationDateContainer}>
                                    <Text style={styles.label}>Expiración</Text>
                                    <TextInput 
                                        value={dateExpired} 
                                        onChangeText={(text) => setDateExpired(handleDateChange(text))} 
                                        keyboardType="number-pad"
                                        maxLength={10}
                                        placeholder="DD/MM/AA" 
                                        placeholderTextColor={'#9CA3AF'} 
                                        selectionColor={'#DE1484'} 
                                        style={styles.textInput}
                                    />
                                </View>
                            </View>
                            <View style={styles.textInputContainer}>
                                <Text style={styles.label}>Producto a aplicar cupón</Text>
                                <TouchableOpacity
                                    style={styles.textInputDropDown}
                                    onPress={() => setListVisible(true)}
                                    activeOpacity={0.8}
                                >
                                    <Text
                                    style={[
                                        styles.dropdownText,
                                        !selectedProduct && styles.placeholderText,
                                    ]}
                                    >
                                    {selectedProduct || 'Selecciona un producto'}
                                    </Text>
                                    <ChevronDown size={18} color="#9CA3AF" />
                                </TouchableOpacity>

                                {/* Modal con lista de opciones */}
                                <Modal visible={listVisible} transparent animationType="fade">
                                    <TouchableOpacity
                                    style={styles.overlay}
                                    activeOpacity={1}
                                    onPressOut={() => setListVisible(false)}
                                    >
                                    <View style={styles.modalContainer}>
                                        <FlatList
                                        data={products}
                                        keyExtractor={(item) => item.id}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                            style={styles.option}
                                            onPress={() => handleSelect(item.nombre)}
                                            >
                                            <Text style={styles.optionText}>{item.nombre}</Text>
                                            </TouchableOpacity>
                                        )}
                                        />
                                    </View>
                                    </TouchableOpacity>
                                </Modal>
                            </View>
                        </View>
                        <View style={styles.buttonsContainer}>
                            <ButtonSellerComponent 
                                type={'normal'} 
                                haveIcon={false} 
                                text={'Guardar cambios'} 
                                onPressButton={onPressNormalButton}
                            />
                            <ButtonSellerComponent 
                                type={'cancel'} 
                                haveIcon={false} 
                                text={'Cancelar'} 
                                onPressButton={onPressCancelButton}
                            />
                        </View>
                    </View>
                ) : type === 'actualizar-producto' ? (
                    <ScrollView contentContainerStyle={[styles.modalView, {paddingVertical: moderateScale(20)}]} showsVerticalScrollIndicator={false}>
                        <View style={styles.editTitleContainer}>
                            <SquarePen size={moderateScale(20)} color={'#030712'} strokeWidth={3}/>
                            <Text style={styles.editTitle}>Editar/Actualizar Producto</Text>
                        </View>
                        <View style={styles.inputsContainer}>
                            <View style={styles.textInputContainer}>
                                <Text style={styles.label}>Nombre</Text>
                                <TextInput selectionColor={'#DE1484'} placeholder="Nombre de tu producto" placeholderTextColor={'#9CA3AF'} style={styles.textInput}/>
                            </View>
                            <View style={styles.textInputContainer}>
                                <View style={styles.separationContainer}>
                                    <Text style={styles.label}>Descripción</Text>
                                    
                                    <TextInput 
                                        maxLength={200}
                                        multiline={true}
                                        placeholder={'Escribe una descripción de tu producto, no mayor a 200 caracteres.'} 
                                        placeholderTextColor={'#9CA3AF'} 
                                        selectionColor={'#DE1484'} 
                                        style={styles.textInputDescription}
                                    />
                                </View>
                            </View>
                            <View style={styles.textInputDateContainer}>
                                <View style={styles.separationDateContainer}>
                                    <Text style={styles.label}>Precio</Text>
                                    <TextInput 
                                        keyboardType="number-pad"
                                        maxLength={8}
                                        placeholder="Cantidad" 
                                        placeholderTextColor={'#9CA3AF'} 
                                        selectionColor={'#DE1484'} 
                                        style={styles.textInput}
                                    />
                                </View>
                                <View style={styles.separationDateContainer}>
                                    <Text style={styles.label}>Cantidad en stock</Text>
                                    <TextInput 
                                        value={amountStock} 
                                        onChangeText={(text) => setAmountStock(handleAmountChange(text))} 
                                        keyboardType="number-pad"
                                        maxLength={10}
                                        placeholder="Cantidad" 
                                        placeholderTextColor={'#9CA3AF'} 
                                        selectionColor={'#DE1484'} 
                                        style={styles.textInput}
                                    />
                                </View>
                            </View>
                            <View style={styles.textInputContainer}>
                                <Text style={styles.label}>Categoría</Text>
                                <TouchableOpacity
                                    style={styles.textInputDropDown}
                                    onPress={() => setListVisible(true)}
                                    activeOpacity={0.8}
                                >
                                    <Text
                                    style={[
                                        styles.dropdownText,
                                        !selectedCategorie && styles.placeholderText,
                                    ]}
                                    >
                                    {selectedCategorie || 'Selecciona una categoría'}
                                    </Text>
                                    <ChevronDown size={18} color="#9CA3AF" />
                                </TouchableOpacity>

                                {/* Modal con lista de opciones */}
                                <Modal visible={listVisible} transparent animationType="fade">
                                    <TouchableOpacity
                                    style={styles.overlay}
                                    activeOpacity={1}
                                    onPressOut={() => setListVisible(false)}
                                    >
                                    <View style={styles.modalContainer}>
                                        <FlatList
                                        data={categories}
                                        keyExtractor={(item) => item.id}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                            style={styles.option}
                                            onPress={() => handleSelectCategories(item.nombre)}
                                            >
                                            <Text style={styles.optionText}>{item.nombre}</Text>
                                            </TouchableOpacity>
                                        )}
                                        />
                                    </View>
                                    </TouchableOpacity>
                                </Modal>
                            </View>
                            <View style={styles.textInputContainer}>
                                <Text style={styles.label}>Imágenes del producto</Text>
                                <ImagenesInput />
                            </View>
                        </View>
                        <View style={styles.buttonsContainer}>
                            <ButtonSellerComponent 
                                type={'normal'} 
                                haveIcon={false} 
                                text={'Guardar cambios'} 
                                onPressButton={onPressNormalButton}
                            />
                            <ButtonSellerComponent 
                                type={'cancel'} 
                                haveIcon={false} 
                                text={'Cancelar'} 
                                onPressButton={onPressCancelButton}
                            />
                        </View>
                    </ScrollView>
                ) :
                null
            }
            
        </View>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        backgroundColor: '#ffffff',
        borderRadius: moderateScale(20),
        padding: moderateScale(24),
        width: screenWidht * 0.9,
        gap: moderateScale(24)
    },
    text: {
        fontFamily: 'system-ui',
        fontWeight: 500,
        fontSize: moderateScale(16),
        textAlign: 'center'
    },
    buttonsContainer: {
        flexDirection: 'column',
        gap: moderateScale(12)
    },
    editTitleContainer: {
        flexDirection: 'row',
        gap: moderateScale(4),
        alignItems: 'center'
    }, 
    editTitle: {
        fontFamily: 'system-ui',
        fontWeight: 700,
        fontSize: moderateScale(20),
        color: '#030712'
    },
    inputsContainer: {
        gap: moderateScale(12)
    },
    textInputContainer: {
        flexDirection: 'column',
        gap: moderateScale(4)
    },
    textInputDateContainer: {
        flexDirection: 'row',
        gap: moderateScale(4),
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    label: {
        fontFamily: 'system-ui',
        fontWeight: 500,
        fontSize: moderateScale(16),
        color: '#6B7280'
    },
    textInput: {
        backgroundColor: '#F9FAFB',
        borderRadius: moderateScale(8),
        borderColor: '#E5E7EB',
        borderWidth: 1,
        paddingLeft: moderateScale(8),
    },
    textInputDescription: {
        backgroundColor: '#F9FAFB',
        borderRadius: moderateScale(8),
        borderColor: '#E5E7EB',
        borderWidth: 1,
        paddingLeft: moderateScale(8),
        height: screenHeight * 0.15,
    },
    textInputDropDown: {
        backgroundColor: '#F9FAFB',
        borderRadius: moderateScale(8),
        borderColor: '#E5E7EB',
        borderWidth: 1,
        padding: moderateScale(8),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    radioButtonsContainer: {
        flexDirection: 'row',
        gap: moderateScale(24),
        alignItems: 'center'
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    separationContainer: {
        gap: moderateScale(4)
    },
    separationDateContainer: {
        gap: moderateScale(4),
        width: '45%'
    },
    radioButtonText: {
        fontFamily: 'system-ui',
        fontWeight: 500,
        fontSize: moderateScale(14),
        color: '#1F2937'
    },
    dropdownText: { 
        fontSize: moderateScale(14), 
        color: '#111827' 
    },
    placeholderText: { 
        color: '#9CA3AF' 
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingHorizontal: moderateScale(40),
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: moderateScale(8),
        paddingVertical: moderateScale(20),
    },
    option: {
        paddingVertical: moderateScale(12),
        paddingHorizontal: moderateScale(16),
    },
    optionText: {
        fontSize: moderateScale(14),
        color: '#111827',
    },
})
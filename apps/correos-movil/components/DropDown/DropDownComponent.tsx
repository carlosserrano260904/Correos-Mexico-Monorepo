import * as React from 'react';
import { StyleSheet, ViewStyle, TextStyle, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import { moderateScale } from 'react-native-size-matters';

type Item = {
  label: string;
  value: string;
};

type Props = {
  data: Item[];
  value: string | null;
  setValue: (val: string) => void;
  placeholder?: string;

  // Estilos opcionales que pueden ser pasados desde fuera
  placeholderStyle?: TextStyle;
  selectedTextStyle?: TextStyle;
  inputSearchStyle?: TextStyle;
  iconStyle?: ViewStyle;

  // Personalización del ícono (opcional)
  renderLeftIcon?: () => React.ReactNode;
};

const DropdownComponent = ({
  data,
  value,
  setValue,
  placeholder = 'Selecciona una opción',
  placeholderStyle,
  selectedTextStyle,
  inputSearchStyle,
  iconStyle,
  renderLeftIcon,
}: Props) => {
  return (
    <Dropdown
      placeholderStyle={placeholderStyle || styles.placeholderStyle}
      selectedTextStyle={selectedTextStyle || styles.selectedTextStyle}
      inputSearchStyle={inputSearchStyle || styles.inputSearchStyle}
      data={data}
      search
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder={placeholder}
      searchPlaceholder="Buscar..."
      value={value}
      onChange={(item) => setValue(item.value)}
      renderLeftIcon={
        renderLeftIcon ??
        (() => (
          <View style={iconStyle ?? {borderRadius: "100%", borderWidth: 1, width: moderateScale(16), height: moderateScale(16), marginRight: moderateScale(4)}} />
        ))
      }
    />
  );
};

export default DropdownComponent;

  const styles = StyleSheet.create({
    icon: {
      marginRight: moderateScale(5),
    },
    placeholderStyle: {
      fontSize: moderateScale(12),
    },
    selectedTextStyle: {
      fontSize: moderateScale(14),
    },
    iconStyle: {
      width: moderateScale(20),
      height: moderateScale(20),
    },
    inputSearchStyle: {
      height: moderateScale(40),
      fontSize: moderateScale(16),
    },
  });
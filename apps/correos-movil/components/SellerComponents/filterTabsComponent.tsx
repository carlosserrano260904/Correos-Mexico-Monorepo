import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height

interface CategoryItem {
    label: string,
    value: string
}

export default function FilterTabs<T extends Record<string, any>>({
    // Pide el array de categorias a filtrar
    categories,
    // Pide el array de objetos que va filtrar
    data,
    // Pide la accion para establecer o pasar el array de objetos filtrados
    onFilter,
    // Pide el id o kay de la categoria
    categoryKey,
    // Pide el nombre de la categoria para llamar a todos los objetos de data
    nameAll,
    // Pide el nombre de una categoria extra especial
    extra,
}: {
    categories: CategoryItem[];
    data: T[];
    onFilter: (filteredData: T[]) => void;
    categoryKey: keyof T;
    nameAll: string;
    extra?: string[];
}) {

    const normalizeCategories = (cats: (string | CategoryItem)[]): CategoryItem[] =>
        cats.map((cat) => (typeof cat === 'string' ? { label: cat, value: cat } : cat));
    // Define la categoria seleccionada, como predeterminada esta el de todos los objetos
    const [selected, setSelected] = useState<CategoryItem>({ label: nameAll, value: nameAll });

    const normalizedCategories = [
        { label: nameAll, value: nameAll },
        ...normalizeCategories(categories),
        ...(extra ? normalizeCategories(extra) : []),
    ];

    // Funcion para filtrar los objetos segun la categoria seleccionada
    useEffect(() => {
        if (selected.value === nameAll) {
        onFilter(data);
        } else {
        const filtered = data.filter((item) => item[categoryKey] === selected.value);
        onFilter(filtered);
        }
    }, [selected, data]);


    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.scroll}
            contentContainerStyle={styles.content}
        >
            {normalizedCategories.map((tab) => {
                const active = tab.value === selected.value;
                return (
                <TouchableOpacity
                    key={tab.value}
                    style={[styles.tab, active ? styles.tabActive : styles.tabInactive]}
                    onPress={() => setSelected(tab)}
                >
                    <Text style={[styles.tabText, active ? styles.tabTextActive : styles.tabTextInactive]}>
                    {tab.label}
                    </Text>
                </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scroll: {
        flexGrow: 0,
    },
    content: {
        flexDirection: 'row',
        gap: screenWidth * 0.022
    },
    tab: {
        paddingVertical: screenHeight * 0.008,
        paddingHorizontal: screenWidth * 0.05,
        borderRadius: moderateScale(100),
        borderWidth: 1,
    },
    tabActive: {
        backgroundColor: '#DE1484',
        borderColor: '#DE1484',
    },
    tabInactive: {
        backgroundColor: '#F3F4F6',
        borderColor: '#E5E7EB',
    },
    tabText: {
        fontSize: screenHeight * 0.015,
        fontWeight: '500',
    },
    tabTextActive: {
        color: '#fff',
    },
    tabTextInactive: {
        color: '#9CA3AF',
    },
});


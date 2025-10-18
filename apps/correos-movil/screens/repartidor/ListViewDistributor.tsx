import React from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { LogOut } from "lucide-react-native";

export default function ListViewDistributor() {
    return (
        <View style={styles.container}>
            <Text>Lista de paquetes</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
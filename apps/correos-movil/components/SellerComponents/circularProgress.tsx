import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const screenWidht = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CircularProgress = ({ 
    // Pide el porcentaje de "lleno"
    percentage, 
    // Pide el radio del grafico, que por defecto ya tiene un valor
    radius = screenWidht * 0.12, 
    // Pide la anchura de la linea, que por defecto ya tiene un valor
    strokeWidth = 10 
}:{
    percentage: number,
    radius?: any,
    strokeWidth?: number
}) => {
    // Define el valor o porcentaje que se va a llenar el grafico
    const animatedValue = useRef(new Animated.Value(0)).current;

    // Define la circunferencia del grafico
    const circumference = 2 * Math.PI * radius;
    // Define la mitad del grafico
    const halfCircle = radius + strokeWidth;

    // Al tener el porcentaje se renderiza el grafico y se llena segun su porcentaje
    useEffect(() => {
        // Animacion para llenar el grafico segun el porcentaje
        Animated.timing(animatedValue, {
        toValue: percentage,
        duration: 1200,
        useNativeDriver: true,
        }).start();
    }, [percentage]);

    // Define el rango de llenado del grafico
    const strokeDashoffset = animatedValue.interpolate({
        inputRange: [0, 100],
        outputRange: [circumference, 0],
    });

    // Funcion que define el tipo de color de linea segun el porcentaje del grafico
    const getColor = (p: number) => {
        if (p < 30) return '#E53935'; // rojo
        if (p < 70) return '#FB8C00'; // naranja
        return '#43A047'; // verde
    };

    // Define el color
    const color = getColor(percentage);

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={radius * 2 + strokeWidth * 2} height={radius * 2 + strokeWidth * 2} viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}>
            {/* Círculo de fondo */}
            <Circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="#E0E0E0"
            strokeWidth={strokeWidth}
            fill="none"
            />
            {/* Círculo animado */}
            <AnimatedCircle
            cx="50%"
            cy="50%"
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            fill="none"
            rotation="-90"
            originX={halfCircle}
            originY={halfCircle}
            />
        </Svg>

        <View style={styles.labelContainer}>
            <Text style={styles.text}>{`${percentage}%`}</Text>
        </View>
        </View>
    );
    };

    const styles = StyleSheet.create({
    labelContainer: {
        position: 'absolute',
        alignItems: 'center',
    },
    text: {
        fontFamily: 'system-ui',
        fontWeight: 700,
        fontSize: screenHeight * 0.03,
        color: '#111827',
        textAlign: 'center',
    },
});

export default CircularProgress;

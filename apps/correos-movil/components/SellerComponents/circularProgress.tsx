import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { moderateScale } from 'react-native-size-matters';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CircularProgress = ({ 
    percentage, radius = moderateScale(44), strokeWidth = 10 
}:{
    percentage: number,
    radius?: any,
    strokeWidth?: number
}) => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    const circumference = 2 * Math.PI * radius;
    const halfCircle = radius + strokeWidth;

    useEffect(() => {
        Animated.timing(animatedValue, {
        toValue: percentage,
        duration: 1200,
        useNativeDriver: true,
        }).start();
    }, [percentage]);

    const strokeDashoffset = animatedValue.interpolate({
        inputRange: [0, 100],
        outputRange: [circumference, 0],
    });

    const getColor = (p: number) => {
        if (p < 30) return '#E53935'; // rojo
        if (p < 70) return '#FB8C00'; // naranja
        return '#43A047'; // verde
    };

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
        fontSize: moderateScale(24),
        color: '#111827',
        textAlign: 'center',
    },
    subText: {
        fontSize: 12,
        color: '#888',
    },
});

export default CircularProgress;

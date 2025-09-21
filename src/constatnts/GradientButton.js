import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

// Button constant
const GradientButton = ({ title, onPress, style }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.buttonContainer, style]}>
            <LinearGradient
                colors={['#4B0082', '#FF1493', '#FF8C00']} // 3-color horizontal gradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}
            >
                <Text style={styles.text}>{title}</Text>
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        width: '80%',
        borderRadius: 10,
        overflow: 'hidden',
        marginVertical: 10,
    },
    gradient: {
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 10,
        alignItems: 'center',
    },
    text: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default GradientButton;

// expects
// <GradientButton
//   title="Next"
//   onPress={() => console.log('Button Pressed')}
// />

import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Image } from 'react-native';

const WelcomeScreen = () => {
    return (
        <View style={styles.container}>
            <Image
                source={require('../../assets/WelcomScreen/welcomebannersopacity.jpg')}
                style={{
                    width: '130%',
                    height: '130%',
                    transform: [{ rotate: '-25deg' }], // rotate image by 10 degrees
                    marginRight: 150,
                    marginBottom:-250,
                    opacity:0.5,
                }}
                resizeMode="contain"
            />

            <Image
                source={require('../../assets/WelcomScreen/Logo.png')} // Replace with your welcome image path
                style={{ width: 150, height: 150, marginBottom: 20, borderRadius: 35, marginTop: 260 }}
                resizeMode="contain"
            />
            <Text style={styles.title}>Welcome!</Text>
            <Text style={styles.title}>Poster Maker Pro</Text>
            <ActivityIndicator size="large" color="#000000" style={styles.loader} />
            <Text style={styles.subtitle}>"Design stunning posters, flyers, and graphics in minutes."</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        marginBottom:280,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
        width: '80%',
        textAlign: 'center',
    },
    loader: {
        marginVertical: 10,
    },
});

export default WelcomeScreen;
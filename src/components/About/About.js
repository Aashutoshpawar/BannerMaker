import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

const About = ({ navigation }) => {
    return (
        <View>
            <Text>About Page</Text>
            <FontAwesome5Icon name="cog" />
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
                <Text>Log out</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        marginBottom: 12,
    },
    button: {
        padding: 10,
        backgroundColor: '#007BFF',
        borderRadius: 5,
        width: 100,
    },
});

export default About;

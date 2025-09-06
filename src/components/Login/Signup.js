import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

const Signup = ({navigation}) => {
    return (
        <View>
            <Text>Signup Screen</Text>
            <TextInput placeholder="Email" style={styles.input} />
            <TextInput placeholder="Password" style={styles.input} secureTextEntry />
            <TextInput placeholder="Confirm Password" style={styles.input} secureTextEntry />
            <Button title="Sign Up" onPress={() => {navigation.navigate('Login')}} />
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
});

export default Signup;

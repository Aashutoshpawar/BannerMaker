import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Linking, Share } from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

const settingsOptions = [
    { id: '1', title: 'Change Language', icon: 'language', onPress: () => alert('Change Language pressed') },
    { id: '2', title: 'Rate Us', icon: 'star', onPress: () => Linking.openURL('market://details?id=com.yourapp') },
    { id: '3', title: 'Share App', icon: 'share-alt', onPress: () => Share.share({ message: 'Check out this app: https://play.google.com/store/apps/details?id=com.yourapp' }) },
    { id: '4', title: 'Privacy Policy', icon: 'shield-alt', onPress: () => Linking.openURL('https://yourapp.com/privacy') },
    { id: '5', title: 'Terms of Service', icon: 'file-contract', onPress: () => Linking.openURL('https://yourapp.com/terms') },
    { id: '6', title: 'Contact Us', icon: 'envelope', onPress: () => Linking.openURL('mailto:support@yourapp.com') },
];

const About = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Settings</Text>
            {settingsOptions.map(option => (
                <TouchableOpacity key={option.id} style={styles.option} onPress={option.onPress}>
                    <FontAwesome5Icon name={option.icon} size={20} color="#333" style={styles.icon} />
                    <Text style={styles.optionText}>{option.title}</Text>
                </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.logoutText}>Log out</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc',
    },
    icon: {
        marginRight: 15,
    },
    optionText: {
        fontSize: 16,
        color: '#333',
    },
    logoutButton: {
        marginTop: 280,
        padding: 15,
        backgroundColor: '#3b5998',
        borderRadius: 8,
        alignItems: 'center',
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default About;

import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Linking,
    Share,
    ScrollView,
    Modal,
    FlatList,
    Alert,
} from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import GradientButton from '../../constants/GradientButton';
import LinearGradient from "react-native-linear-gradient";
import AsyncStorage from '@react-native-async-storage/async-storage';

const languages = [
    { id: 'en', title: 'English' },
    { id: 'hi', title: 'हिन्दी' },
    { id: 'mr', title: 'मराठी' },
    { id: 'ta', title: 'தமிழ்' },
    { id: 'te', title: 'తెలుగు' },
    { id: 'kn', title: 'ಕನ್ನಡ' },
    { id: 'ml', title: 'മലയാളം' },
    { id: 'bn', title: 'বাংলা' },
    { id: 'gu', title: 'ગુજરાતી' },
    { id: 'pa', title: 'ਪੰਜਾਬੀ' },
];

const About = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedLang, setSelectedLang] = useState('English');

    const settingsOptions = [
        { id: '1', title: 'Change Language', icon: 'language', onPress: () => setModalVisible(true) },
        { id: '2', title: 'Rate Us', icon: 'star', onPress: () => Linking.openURL('market://details?id=com.yourapp') },
        { id: '3', title: 'Share App', icon: 'share-alt', onPress: () => Share.share({ message: 'Check out this app: https://play.google.com/store/apps/details?id=com.yourapp' }) },
    ];

    const supportOptions = [
        { id: '4', title: 'Privacy Policy', icon: 'shield-alt', onPress: () => Linking.openURL('https://yourapp.com/privacy') },
        { id: '5', title: 'Terms of Service', icon: 'file-contract', onPress: () => Linking.openURL('https://yourapp.com/terms') },
        { id: '6', title: 'Contact Us', icon: 'envelope', onPress: () => Linking.openURL('mailto:support@yourapp.com') },
    ];

    const GradientBorderCircle = ({ children }) => (
        <LinearGradient
            colors={['#4B0082', '#FF1493', '#FF8C00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.gradientBorder}
        >
            <View style={styles.innerCircle}>
                {children}
            </View>
        </LinearGradient>
    );

    const renderOption = (option) => (
        <TouchableOpacity key={option.id} style={styles.option} onPress={option.onPress}>
            <GradientBorderCircle>
                <FontAwesome5Icon name={option.icon} size={16} color="#12110D" />
            </GradientBorderCircle>
            <Text style={styles.optionText}>{option.title}</Text>
        </TouchableOpacity>
    );

    // ✅ Logout confirmation alert
    const handleLogout = () => {
        Alert.alert(
            "Confirmation",
            "Are you sure you want to logout?",
            [
                {
                    text: "No",
                    onPress: () => console.log("Logout cancelled"),
                    style: "cancel"
                },
                {
                    text: "Yes",
                    onPress: () => {
                        navigation.navigate('Login')
                        AsyncStorage.clear();

                    }
                }
            ],
            { cancelable: true }
        );
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Text style={styles.header}>Settings</Text>

            {/* App Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>App</Text>
                {settingsOptions.map(renderOption)}
            </View>

            {/* Support Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Support</Text>
                {supportOptions.map(renderOption)}
            </View>

            {/* Logout */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <GradientButton title="Log out" onPress={handleLogout} />
            </TouchableOpacity>

            {/* Language Modal */}
            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Select Language</Text>
                        <FlatList
                            data={languages}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.languageOption,
                                        selectedLang === item.title && styles.languageSelected,
                                    ]}
                                    onPress={() => {
                                        setSelectedLang(item.title);
                                        setModalVisible(false);
                                    }}
                                >
                                    <Text style={styles.languageText}>{item.title}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.closeText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
        padding: 15,
    },
    header: {
        fontSize: 28,
        fontWeight: '700',
        color: '#111',
        marginBottom: 25,
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6b7280',
        marginBottom: 8,
        marginLeft: 5,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#e5e7eb',
    },
    optionText: {
        fontSize: 16,
        color: '#111',
        fontWeight: '500',
    },
    logoutButton: {
        marginTop: 30,
        paddingVertical: 16,
        alignItems: 'center',
        borderRadius: 12,
    },
    gradientBorder: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
        padding: 2,
    },
    innerCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 15,
        textAlign: 'center',
    },
    languageOption: {
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ddd',
    },
    languageText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#111',
    },
    languageSelected: {
        backgroundColor: '#e0f2fe',
        borderRadius: 6,
    },
    closeButton: {
        marginTop: 15,
        paddingVertical: 12,
        backgroundColor: '#ef4444',
        borderRadius: 8,
    },
    closeText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '600',
    },
});

export default About;

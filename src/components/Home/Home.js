import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styles from "./home.css"


const Home = ({navigation}) => {
    return (
        <View>
            <View >
                <Text style={styles.header}>Poster Maker Pro</Text>
            </View>
          
        </View>
    );
}

export default Home;

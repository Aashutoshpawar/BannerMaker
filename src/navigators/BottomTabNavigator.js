import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../components/Home/Home'
import Create from '../components/Create/Create'
import Draft from '../components/Draft/Draft'
import About from '../components/About/About'
const Tab = createBottomTabNavigator();

// Example screens
function HomeScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.text}>Home Screen</Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.text}>Profile Screen</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.text}>Settings Screen</Text>
    </View>
  );
}

const BottomTabNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: 'skyblue',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: { backgroundColor: 'white', height: 60 ,paddingBottom:20},
        }}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Create" component={Create} />
        <Tab.Screen name="Draft" component={Draft} />
        <Tab.Screen name="Setting" component={About} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222',
  },
  text: {
    color: 'white',
    fontSize: 20,
  },
});

export default BottomTabNavigator;

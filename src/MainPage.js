import React from 'react';
import { StyleSheet, View } from 'react-native';
import BottomTabNavigator from './navigators/BottomTabNavigator';

const MainPage = () => {
  return (
    <View style={styles.container}>
      <BottomTabNavigator />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // 👈 makes the navigator fill the screen
  },
});

export default MainPage;

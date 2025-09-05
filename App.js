import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import MainPage from './src/MainPage'
import BottomTabNavigator from './src/navigators/BottomTabNavigator'
import { enableScreens } from 'react-native-screens';
import { StatusBar } from 'react-native';



function App() {
  enableScreens(); // Call this at the top of your entry file (App.js)
  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="dark-content" // For dark icons (use "light-content" for light icons)
        backgroundColor="white" // Only Android, sets the background color of the status bar
      />
      <SafeAreaView style={styles.container}>
        <BottomTabNavigator>
          <MainPage />
        </BottomTabNavigator>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default App;

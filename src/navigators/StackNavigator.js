import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Login from '../components/Login/Login';
import Home from '../components/Home/Home';
import Create from '../components/Create/Create';
import Draft from '../components/Draft/Draft';
import About from '../components/About/About';
import BottomTabNavigator from './BottomTabNavigator';
import MainPage from '../MainPage';
import PreviewTemplate from '../components/Home/PreviewTemplate/PreviewTemplate';
import Crop from '../components/Create/Crop/Crop';
import Canvas from '../components/Canvas/Canvas';
import OtpScreen from '../components/Login/OtpScreen';
import CategoryTemplates from '../components/Home/CategoryTemplates/CategoryTemplates';

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* First screen → Login */}
      <Stack.Screen name="Login" component={Login} />
      {/* After login, show Bottom Tabs */}
      {/* <Stack.Screen name="BottomTabNavigator" component={BottomTabNavigator}></Stack.Screen> */}
      <Stack.Screen name="BottomTabNavigator" component={BottomTabNavigator} />

      {/* Extra screens (stack pushable) */}
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Create" component={Create} />
      <Stack.Screen name="Draft" component={Draft} />
      <Stack.Screen name="About" component={About} />
      <Stack.Screen name="MainPage" component={MainPage} />
      <Stack.Screen name="PreviewTemplate" component={PreviewTemplate} />
      <Stack.Screen name="Crop" component={Crop} />
      <Stack.Screen name="Canvas" component={Canvas} />
      <Stack.Screen name='OTPScreen' component={OtpScreen} />
      <Stack.Screen name="CategoryTemplates" component={CategoryTemplates} />
    </Stack.Navigator>
  );
};

export default StackNavigator;

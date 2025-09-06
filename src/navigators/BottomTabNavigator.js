import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../components/Home/Home';
import Create from '../components/Create/Create';
import Draft from '../components/Draft/Draft';
import About from '../components/About/About';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import SimpleLineIcons from 'react-native-vector-icons/FontAwesome5';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const Tab = createBottomTabNavigator();

// Wrap FontAwesome5 in Animated
const AnimatedFontAwesome5 = Animated.createAnimatedComponent(FontAwesome5);

const AnimatedIcon = ({ name, color, focused }) => {
  const scale = useSharedValue(focused ? 1.3 : 1);

  useEffect(() => {
    scale.value = withSpring(focused ? 1.3 : 1, { damping: 12, stiffness: 150 });
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
  transform: [
    {
      scale: withSpring(scale.value, {
        damping: 18,      // higher damping = less bounce
        stiffness: 120,   // lower stiffness = slower, smoother
        mass: 0.8,        // optional, affects speed of spring
      }),
    },
  ],
  
}));


  return <AnimatedFontAwesome5 name={name} color={color} size={24} style={animatedStyle} solid />;
};

const BottomTabNavigator = () => {
  return (
    // <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: 'skyblue',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: { backgroundColor: 'white', height: 60, paddingBottom: 10, },
        }}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: ({ color, focused }) => <AnimatedIcon name="home" color={color} focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Create"
          component={Create}
          options={{
            tabBarIcon: ({ color, focused }) => <AnimatedIcon name="plus-circle" color={color} focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Draft"
          component={Draft}
          options={{
            tabBarIcon: ({ color, focused }) => <AnimatedIcon name="file-alt" color={color} focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Setting"
          component={About}
          options={{
            tabBarIcon: ({ color, focused }) => <AnimatedIcon name="cog" color={color} focused={focused} />,
          }}
        />
      </Tab.Navigator>
    // </NavigationContainer>
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
  },
});

export default BottomTabNavigator;

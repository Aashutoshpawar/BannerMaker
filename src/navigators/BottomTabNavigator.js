import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import Home from "../components/Home/Home";
import Create from "../components/Create/Create";
import Draft from "../components/Draft/Draft";
import About from "../components/About/About";

const Tab = createBottomTabNavigator();
const AnimatedFontAwesome5 = Animated.createAnimatedComponent(FontAwesome5);

// 🔹 Animated Icon Component
const AnimatedIcon = ({ name, color, focused }) => {
  const scale = useSharedValue(focused ? 1.2 : 1);

  useEffect(() => {
    scale.value = withSpring(focused ? 1.2 : 1);
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedFontAwesome5
      name={name}
      color={color}
      size={22}
      style={animatedStyle}
      solid
    />
  );
};

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "skyblue",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { backgroundColor: "white", height: 60, paddingBottom: 8 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <AnimatedIcon name="home" color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Create"
        component={Create}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <AnimatedIcon name="plus-circle" color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Draft"
        component={Draft}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <AnimatedIcon name="file-alt" color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Setting"
        component={About}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <AnimatedIcon name="cog" color={color} focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;

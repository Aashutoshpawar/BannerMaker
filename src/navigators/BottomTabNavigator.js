import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import MaterialDesignIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Home from "../components/Home/Home";
import Create from "../components/Create/Create";
import Draft from "../components/Draft/Draft";
import About from "../components/About/About";

const Tab = createBottomTabNavigator();

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
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" color={color} size={25} />
          ),
        }}
      />
      <Tab.Screen
        name="Create"
        component={Create}
        options={{
          tabBarIcon: ({ color }) => (
            <SimpleLineIcons name="plus" color={color} size={25} solid />
          ),
        }}
      />
      <Tab.Screen
        name="Draft"
        component={Draft}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialDesignIcons name="circle-edit-outline" color={color} size={25} solid />
          ),
        }}
      />
      <Tab.Screen
        name="Setting"
        component={About}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings-outline" color={color} size={25} solid />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;

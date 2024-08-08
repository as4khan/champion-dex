import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home } from "../screens/Home";
import { Scan } from "../screens/Scan";
import { MaterialIcons } from '@expo/vector-icons';
import { MainNavigator } from "./MainNavigator";

const Tab = createBottomTabNavigator();

export function BottomTabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof MaterialIcons.glyphMap;

          switch (route.name) {
            case "Home":
              iconName = "home";
              break;
            case "Scan":
              iconName = "camera";
              break;
            default:
              iconName = "home"; // Default icon
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#28282B",
        tabBarInactiveTintColor: "white",
        tabBarStyle: {
          backgroundColor: "#FF3E3E", // Pokédex black background
        },
      })}
    >
      <Tab.Screen name="Home" component={MainNavigator} options={{ headerShown: false }} />
      <Tab.Screen name="Scan" component={Scan} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}
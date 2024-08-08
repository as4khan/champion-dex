import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "../screens/Home";
import { Detail } from "../screens/Details";
import { Search } from "../screens/Search";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import type { MainStackParamList } from "./types";

const Stack = createNativeStackNavigator<MainStackParamList>();

export function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#FF3E3E", // Pokédex red background
        },
        headerTitleStyle: {
          color: 'white',
        },
        headerTintColor: 'white',
      }}
    >
      <Stack.Screen
        name="Home"
        component={Home}
        options={({ navigation }) => ({
          headerLargeTitle: true,
          headerTitle: 'Pokédex',
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('Search')}>
              <MaterialIcons name="search" color="white" size={32} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen name="Detail" component={Detail} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Search" component={Search} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

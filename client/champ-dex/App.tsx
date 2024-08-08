import React from 'react';
import {Home} from './src/screens/Home';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {MainNavigator} from './src/navigators/MainNavigator'
import { NavigationContainer } from '@react-navigation/native';
import {NativeBaseProvider} from 'native-base'
import { BottomTabsNavigator } from './src/navigators/BottomTabsNavigator'


const queryClient = new QueryClient();

export default function App() {
  return(
    <QueryClientProvider client={queryClient}>
      <NativeBaseProvider>
        <NavigationContainer>
          <BottomTabsNavigator/>
        </NavigationContainer>
      </NativeBaseProvider>

    </QueryClientProvider>
  )
}
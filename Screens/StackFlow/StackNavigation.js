import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from '../Spalsh/SplashScreen';
import OnBoardScreen from '../Onboard/OnBoardScreen';
import DevicesListScreen from '../ListOfDevices/DevicesListScreen';

const Stack = createNativeStackNavigator();

const MyStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="OnBoardScreen"
          component={OnBoardScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DevicesListScreen"
          component={DevicesListScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MyStack;
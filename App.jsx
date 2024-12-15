import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import SplashScreen from './componant/SplashScreen';
import {ToastProvider} from 'react-native-toast-notifications';
import Home from './View/Home';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';

const App = () => {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);
  const Stack = createNativeStackNavigator();
  return isLoading ? (
    <SplashScreen />
  ) : (
    <ToastProvider>
      <Home />
      {/* <NavigationContainer independent={true}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: ""
          }}>
          <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
      </NavigationContainer> */}
    </ToastProvider>
  );
};

const styles = StyleSheet.create({});

export default App;

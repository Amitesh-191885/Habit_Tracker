import React from 'react';
import {SafeAreaView, View, Text, Image, ActivityIndicator} from 'react-native';
import {PageTheme} from '../utility/Constant';

export default SplashScreen = () => {
  return (
    <SafeAreaView
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: PageTheme.lightTheme,
      }}>
      <View
        style={{
          marginTop: 50,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontSize: 22,
            color: PageTheme.highContrastTheme,
            fontFamily: 'Inter-SemiBold',
            textShadowRadius: 2,
          }}>
          Habit Tracker
        </Text>
        <Text
          style={{
            fontSize: 20,
            color: PageTheme.lowContrastTheme,
            fontFamily: 'Inter-Medium',
          }}>
          Quality is not an act, it is a habit!
        </Text>
        <ActivityIndicator
          size="large"
          color={PageTheme.darkTheme}
          style={{marginTop: 50}}
        />
      </View>
    </SafeAreaView>
  );
};

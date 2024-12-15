import React from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import {PageTheme} from '../utility/Constant';

const ProgressBar = ({message = 'Loading'}) => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size={'large'} color={PageTheme.highContrastTheme} />
      <Text
        style={{
          fontSize: 17,
          fontFamily: 'Inter-Bold',
          color: PageTheme.highContrastTheme,
          textAlign: 'center',
          marginTop: 20,
        }}>
        {message}...
      </Text>
    </View>
  );
};

export default ProgressBar;

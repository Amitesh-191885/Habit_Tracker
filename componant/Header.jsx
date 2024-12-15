import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {PageTheme, WINDOW_WIDTH} from '../utility/Constant';

const Header = ({title, subTitle}) => {
  return (
    <>
      <View style={styles.header}>
        <View style={styles.titleView}>
          <Text numberOfLines={1} style={styles.titleText}>
            {title}
          </Text>
          {subTitle ? (
            <Text numberOfLines={1} style={styles.subTitleText}>
              {subTitle ? subTitle : ''}
            </Text>
          ) : null}
        </View>
      </View>
    </>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    position: 'relative',
    width: WINDOW_WIDTH,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    backgroundColor: PageTheme.lightTheme,
    paddingLeft: 10,
    borderBottomWidth: 0.5,
    borderColor: PageTheme.lightTheme,
    shadowColor: PageTheme.midContrastTheme,
    marginBottom: 3,
    elevation: 8, //android only
    shadowOffset: {width: 0, height: 0}, //ios only
    shadowOpacity: 0.5, //ios only
    shadowRadius: 5, //ios only,
  },
  titleView: {
    width: 200,
    marginLeft: 5,
  },
  titleText: {
    fontSize: 16,
    color: PageTheme.black,
    marginLeft: 5,
    fontFamily: 'Inter-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1.25,
  },
  subTitleText: {
    fontSize: 12,
    color: '#000',
    marginLeft: 5,
    fontFamily: 'Inter',
  },
});

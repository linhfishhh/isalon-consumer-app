import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { Layout, Colors, CommonStyles } from '../constants';
import { VectorIconButton } from './Button';
import Space from './Space';

type Props = {
  title?: String,
  closeButtonName?: String,
  onClose: Function,
  color?: String,
  backgroundColor?: String,
  accessories?: Object,
};

export default function NavigationBar({
  title,
  color,
  backgroundColor,
  closeButtonName,
  onClose,
  accessories
}: Props) {
  const navStyles = StyleSheet.create({
    nav: {
      ...styles.nav,
      backgroundColor,
    },
    nav_title: {
      ...styles.title,
      color,
    }
  });
  return (
    <View style={navStyles.nav} zIndex={1000}>
      <View style={styles.nav_content}>
        <VectorIconButton
          name={closeButtonName}
          color={color}
          size={25}
          style={styles.back_button}
          onPress={onClose}
        />
        <Text style={navStyles.nav_title}>{title}</Text>
        <Space />
        {accessories}
      </View>
    </View>
  );
}

NavigationBar.defaultProps = {
  title: 'iSalon',
  closeButtonName: 'arrow-back',
  color: Colors.itemTextColor,
  backgroundColor: 'white',
  accessories: undefined
};

const styles = StyleSheet.create({
  nav: {
    height: 75, // 25 pixel from top, 45 pixel for title, 5 pixel for padding bottom,
    ...CommonStyles.navigation_shadow,
  },
  nav_content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: 25,
    marginRight: 25,
    marginTop: 25,
    height: 45,
  },
  back_button: {
    width: 25,
    height: 25,
  },
  title: {
    ...Layout.font.medium,
    fontSize: Layout.navigatorFontSize,
    marginLeft: 10,
  }
});

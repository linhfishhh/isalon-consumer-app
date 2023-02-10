import React from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import NavigationImage from './NavigationImage';
import Colors from '../constants/Colors';
import CommonStyles from '../constants/CommonStyles';

type Props = {
  hasNavigationBackground?: Boolean,
  hasSafeArea?: Boolean,
};

export default function MainContainer({
  style,
  children,
  hasNavigationBackground,
  hasSafeArea
}: Props) {
  const containerStyle = {
    ...styles.container,
    ...style,
  };
  return (
    <KeyboardAvoidingView
      enabled
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      style={containerStyle}
    >
      {hasNavigationBackground ? <NavigationImage /> : null}
      {
        hasSafeArea ? (
          <SafeAreaView style={styles.content}>
            {children}
          </SafeAreaView>
        ) : children
      }
    </KeyboardAvoidingView>
  );
}

MainContainer.defaultProps = {
  hasNavigationBackground: true,
  hasSafeArea: true,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Colors.backgroundColor
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    ...CommonStyles.padding_top_for_safearea
  }
});

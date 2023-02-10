import React from 'react';
import {
  StatusBar,
} from 'react-native';
import { WebView } from 'react-native-webview';
import styles from './styles';
import MainContainer from '../../components/MainContainer';
import NavigationBar from '../../components/NavigationBar';
import { CommonStyles } from '../../constants';

type Props = {
  navigation: Object
};

export default function WebScreen({ navigation }: Props) {
  const title = navigation.getParam('title');
  const uri = navigation.getParam('uri');

  const onBack = React.useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <MainContainer
      hasNavigationBackground={false}
      style={CommonStyles.main_container_white}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        hidden={false}
        translucent
      />
      <NavigationBar
        title={title}
        onClose={onBack}
      />
      <WebView style={styles.content} source={{ uri }} />
    </MainContainer>
  );
}

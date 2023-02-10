import React from 'react';
import {
  ScrollView,
  StatusBar,
} from 'react-native';
import HTML from 'react-native-render-html';
import styles from './styles';
import MainContainer from '../../components/MainContainer';
import NavigationBar from '../../components/NavigationBar';
import { Layout, CommonStyles } from '../../constants';

type Props = {
  navigation: Object
};

export default function HtmlViewScreen({ navigation }: Props) {
  const title = navigation.getParam('title');
  const content = navigation.getParam('content');

  const onBack = React.useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <MainContainer hasNavigationBackground={false} style={CommonStyles.main_container_white}>
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
      <ScrollView style={styles.content}>
        <HTML html={content} imagesMaxWidth={Layout.window.width} />
      </ScrollView>
    </MainContainer>
  );
}

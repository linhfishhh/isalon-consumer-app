import React, { useState } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import { DotIndicator } from 'react-native-indicators';

import GlobalStyles from '../../styles/GlobalStyles';
import Colors from '../../styles/Colors';
import Layout from '../../shop/constants/Layout';
import PageContainer from '../../components/PageContainer';
import MemberFAVScreen from '../MemberFAVScreen';
import ProductFavorites from './ProductFavorites';

const tabList = [
  {
    key: 'salon',
    title: 'Salon'
  },
  {
    key: 'shop',
    title: 'Sản phẩm',
  }
];

function FavoriteScreen(props) {
  const {
    navigation,
  } = props;

  const [dataTabList, setDataTabList] = useState({ index: 0, routes: tabList });

  const renderTabBar = (tabProps) => (
    <TabBar
      jumpTo={tabProps.jumpTo}
      layout={tabProps.layout}
      navigationState={tabProps.navigationState}
      position={tabProps.position}
      style={Styles.tabbar}
      tabStyle={Styles.tab}
      labelStyle={Styles.tabLabel}
      indicatorStyle={Styles.indicator}
      scrollEnabled
    />
  );

  const renderScene = ({ route }) => {
    if (route.key === 'salon') {
      return <MemberFAVScreen navigation={navigation} />
    }
    return <ProductFavorites navigation={navigation} />
  }

  const onChangeTab = (index) => {
    setDataTabList({ ...dataTabList, index });
  };

  return (
    <PageContainer
      darkTheme
      contentWrapperStyle={[GlobalStyles.pageWrapper, Styles.pageWrapper]}
      navigation={navigation}
      backgroundColor={Colors.LIGHT}
      navigationClose={false}
      navigationButtonStyle={Styles.closeButton}
      headerContainerStyle={Styles.header}
      headerTitleStyle={Styles.headerTitle}
      headerTitle="Danh sách yêu thích"
      layoutPadding={20}
      keyboardAvoid={false}
    >

      <TabView
        navigationState={dataTabList}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={onChangeTab}
        useNativeDriver
        lazy
        swipeEnabled={false}
      />
    </PageContainer>
  );
}

export default connect(
  (state) => ({
    
  }),
  {
    
  }
)(FavoriteScreen);

const Styles = StyleSheet.create({
  pageWrapper: {
    justifyContent: 'flex-start',
    backgroundColor: Colors.LIGHT,
    paddingLeft: 0,
    paddingRight: 0
  },
  closeButton: {
    color: Colors.LIGHT,
    fontFamily: Layout.font.medium.fontFamily
  },
  header: {
    backgroundColor: Colors.PRIMARY
  },
  headerTitle: {
    fontFamily: Layout.font.bold.fontFamily,
    color: Colors.LIGHT
  },

  tabbar: {
    backgroundColor: Colors.PRIMARY,
    height: 50
  },
  tab: {
    width: 'auto',
    marginHorizontal: 10
  },
  tabLabel: {
    fontFamily: Layout.font.medium.fontFamily,
    fontSize: Layout.fontSize,
    textTransform: 'capitalize'
  },
  indicator: {
    borderRadius: 25,
    height: 50,
    borderWidth: 10,
    ...Platform.select({
      ios: {
        borderColor: Colors.PRIMARY
      },
      android: {
        borderColor: 'transparent',
      },
    }),
    backgroundColor: '#F6921E'
  }
});

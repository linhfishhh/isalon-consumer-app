import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';
import Img from '../../components/Img';
import ImageButton from '../../components/ImageButton';
import icBack from '../../../assets/images/shop/ic_back.png';
import icSearch from '../../../assets/images/shop/ic_search_icon.png';

type Props = {

};

export default function NavigationBar({ navigation, title }: Props) {
  const backHitSlop = {
    top: 10, left: 10, right: 10, bottom: 10
  };
  const onBack = () => {
    navigation.goBack();
  };

  const onSearchPress = () => {
    navigation.navigate('SearchScreen');
  };

  return (
    <View style={styles.nav}>
      <ImageButton
        style={styles.back_button}
        source={icBack}
        hitSlop={backHitSlop}
        onPress={onBack}
      />
      <TouchableOpacity style={styles.search_container} onPress={onSearchPress}>
        <Img style={styles.search_icon} source={icSearch} />
        <Text style={styles.search_placeholder_text}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    height: 80,
    flexDirection: 'row',
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 20,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  back_button: {
    width: 18,
    height: 15,
    marginRight: 8
  },
  search_container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 8,
    height: Layout.navigationBarHeight,
    backgroundColor: Colors.searchFieldColor,
    borderRadius: 3,
    flex: 1,
  },
  search_icon: {
    width: 18,
    height: 20,
    marginLeft: 10
  },
  search_placeholder_text: {
    ...Layout.font.normal,
    color: Colors.tintColor,
    marginLeft: 5,
    marginRight: 5
  },
});

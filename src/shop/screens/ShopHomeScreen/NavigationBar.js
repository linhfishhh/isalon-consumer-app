import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text
} from 'react-native';
import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';
import Img from '../../components/Img';
import searchIcon from '../../../assets/images/shop/ic_search_icon.png';

type Props = {

};

function SearchBar({ navigation }: Props) {
  const onSearchPress = () => {
    navigation.push('SearchScreen');
  };
  return (
    <TouchableOpacity style={styles.container} onPress={onSearchPress}>
      <Img style={styles.search_icon} source={searchIcon} />
      <Text style={styles.search_placeholder_text}>Tìm kiếm sản phẩm</Text>
    </TouchableOpacity>
  );
}

export default function NavigationBar({ route }: Props) {
  const { navigation } = route;
  return (
    <SearchBar navigation={navigation} />
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 24,
    marginRight: 24,
    marginTop: 25,
    height: Layout.navigationBarHeight,
    backgroundColor: 'white',
    borderRadius: 3,
  },
  search_icon: {
    width: 18,
    height: 20,
    marginLeft: 10
  },
  search_placeholder_text: {
    ...Layout.font.normal,
    color: Colors.placeholderTextColor,
    width: '90%',
    marginLeft: 5,
    marginRight: 5
  },
});

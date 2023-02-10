import React from 'react';
import { StyleSheet, View } from 'react-native';
import Colors from '../../constants/Colors';
import SearchBar from '../../components/SearchBar';
import ImageButton from '../../components/ImageButton';
import icBack from '../../../assets/images/shop/ic_back.png';

type Props = {};

export default function NavigationBar({
  navigation,
  onSubmitSearch,
  onBlur,
  onFocus,
  textDidChange
}: Props) {
  const backHitSlop = {
    top: 10,
    left: 10,
    right: 10,
    bottom: 10
  };
  const onBack = () => {
    navigation.goBack();
  };
  return (
    <View style={styles.nav}>
      <ImageButton
        style={styles.back_button}
        source={icBack}
        hitSlop={backHitSlop}
        onPress={onBack}
      />
      <SearchBar
        style={styles.search_bar}
        onSubmitEditing={onSubmitSearch}
        textDidChange={textDidChange}
        onBlur={onBlur}
        onFocus={onFocus}
        autoFocus
      />
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
    backgroundColor: 'white'
  },
  back_button: {
    width: 18,
    height: 15,
    marginRight: 8
  },
  search_bar: {
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    flex: 1,
    backgroundColor: Colors.searchFieldColor
  }
});

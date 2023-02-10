import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import Img from './Img';
import ImageButton from './ImageButton';
import Layout from '../constants/Layout';
import Colors from '../constants/Colors';
import searchIcon from '../../assets/images/shop/ic_search_icon.png';
import clearSearchIcon from '../../assets/images/shop/ic_clear_search.png';

type Props = {
  style?: Object,
  textDidChange: Function,
  autoFocus: Boolean,
  onBlur: Function,
  onFocus: Function,
  onSubmitEditing: Function
};

export default function SearchBar({
  style,
  textDidChange,
  autoFocus,
  onBlur,
  onFocus,
  onSubmitEditing
}: Props) {
  const inputRef = React.useRef(null);
  const [searchBarStyle] = React.useState(StyleSheet.create({
    container: {
      ...styles.container,
      ...style
    }
  }));
  const onClear = React.useCallback(() => {
    inputRef.current.clear();
    if (textDidChange) {
      textDidChange('');
    }
  }, []);
  return (
    <View
      style={searchBarStyle.container}
    >
      <Img style={styles.search_icon} source={searchIcon} />
      <TextInput
        ref={inputRef}
        style={styles.text_input}
        placeholder="Tìm kiếm sản phẩm"
        placeholderTextColor={Colors.placeholderTextColor}
        onBlur={onBlur}
        onFocus={onFocus}
        onSubmitEditing={onSubmitEditing}
        onChangeText={textDidChange}
        returnKeyType="search"
        blurOnSubmit
        autoFocus={autoFocus}
      />
      <ImageButton style={styles.clear_search_icon} source={clearSearchIcon} onPress={onClear} />
    </View>
  );
}

SearchBar.defaultProps = {
  style: {
    marginLeft: 24,
    marginRight: 24,
    marginTop: 45
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 45,
    backgroundColor: 'white',
    borderRadius: 3
  },
  search_icon: {
    width: 18,
    height: 20,
    marginLeft: 10
  },
  clear_search_icon: {
    width: 15,
    height: 15,
    marginRight: 10
  },
  text_input: {
    ...Layout.font.normal,
    color: Colors.placeholderTextColor,
    // width: '80%',
    flex: 1,
    height: 45,
    marginLeft: 5,
    marginRight: 5
  }
});

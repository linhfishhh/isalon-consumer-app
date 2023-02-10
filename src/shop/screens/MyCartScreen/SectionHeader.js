import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';
import ImageButton from '../../components/ImageButton';

type Props = {
  title: String,
  onSelectAll: Function,
};

const checkboxNormal = require('../../../assets/images/shop/ic_radio_off.png');
const checkboxSelected = require('../../../assets/images/shop/ic_radio_on.png');

export default function SectionHeader({ section, onSelectAll }: Props) {
  const [selected, setSelected] = React.useState(false);

  const onCheckBoxClick = () => {
    const s = !selected;
    setSelected(s);
    if (onSelectAll) {
      onSelectAll(s, section);
    }
  };

  return (
    <View style={internalStyles.container}>
      <ImageButton
        style={internalStyles.checkbox}
        source={selected ? checkboxSelected : checkboxNormal}
        onPress={onCheckBoxClick}
      />
      <Text style={internalStyles.desc}>{section.title}</Text>
    </View>
  );
}

const internalStyles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 20,
    marginTop: 5,
  },
  checkbox: {
    width: 20, height: 20,
  },
  desc: {
    ...Layout.font.bold,
    color: Colors.itemTextColor,
    marginLeft: 8,
  },
});

import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';

import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';
import Img from '../Img';

import radioOn from '../../../assets/images/shop/ic_radio_on.png';
import radioOff from '../../../assets/images/shop/ic_radio_off.png';

export default class OptionRow extends React.PureComponent {
  onPress = () => {
    const { selectOption, index } = this.props;
    if (selectOption) {
      selectOption(index);
    }
  }

  render() {
    const { selected, option } = this.props;
    return (
      <TouchableOpacity style={styles.option_row} onPress={this.onPress}>
        <Img style={styles.radio} source={selected === true ? radioOn : radioOff} />
        <Text style={styles.option_text}>{option}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  option_row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 36
  },
  radio: {
    width: 20,
    height: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  option_text: {
    ...Layout.font.bold,
    fontSize: Layout.smallFontSize,
    color: Colors.itemTextColor
  }
});

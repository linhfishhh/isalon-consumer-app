import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View
} from 'react-native';
import Layout from '../constants/Layout';
import Colors from '../constants/Colors';
import Img from './Img';

import icCounterMinus from '../../assets/images/shop/ic_counter_minus.png';
import icCounterPlus from '../../assets/images/shop/ic_counter_plus.png';

type Props = {
  initialValue?: Number,
  minValue?: Number,
  onChange: Function,
  align?: String,
  step?: Number,
};

export default function AmountCounter({
  minValue, initialValue, step, align, onChange
}: Props) {
  const [amount, setAmount] = React.useState(initialValue);

  React.useEffect(() => {
    setAmount(initialValue);
  }, [initialValue]);

  const onDecrementClick = () => {
    let a = amount - step;
    if (a < minValue) {
      a = minValue;
    }
    setAmount(a);
    if (onChange) {
      onChange({
        count: a,
        amount: -step,
      });
    }
  };
  const onIncrementClick = () => {
    const a = amount + step;
    setAmount(a);
    if (onChange) {
      onChange({
        count: a,
        amount: step,
      });
    }
  };
  return (
    <View style={styles.container}>
      {align === 'left' ? <Text style={styles.text}>{amount}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={onDecrementClick}>
        <Img source={icCounterMinus} style={styles.icon} />
      </TouchableOpacity>
      {align === 'center' ? <Text style={styles.text}>{amount}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={onIncrementClick}>
        <Img source={icCounterPlus} style={styles.icon} />
      </TouchableOpacity>
      {align === 'right' ? <Text style={styles.text}>{amount}</Text> : null}
    </View>
  );
}

AmountCounter.defaultProps = {
  minValue: 1,
  initialValue: 1,
  align: 'left',
  step: 1,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  text: {
    ...Layout.font.bold,
    fontSize: Layout.largeFontSize,
    color: Colors.itemTextColor,
    marginLeft: 5,
    marginRight: 5,
  },
  button: {
    width: 30,
    height: 30,
    marginLeft: 2,
    marginRight: 2,
  },
  icon: {
    width: 30, height: 30,
  },
});

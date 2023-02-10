import React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
} from 'react-native';
import _ from 'lodash';
import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';
import SectionTitle from '../../components/SectionTitle';
import { formatDecimal } from '../../utils';

type Props = {

};

export default function PriceRangeGroup({
  title,
  onSelectFilterOption,
  selectedOptions
}: Props) {
  const initialMinValue = _.get(selectedOptions, 'priceFilter.startPrice', -1);
  const initialMaxValue = _.get(selectedOptions, 'priceFilter.endPrice', -1);
  const [minPrice, setMinPrice] = React.useState(initialMinValue);
  const [maxPrice, setMaxPrice] = React.useState(initialMaxValue);

  React.useEffect(() => {
    setMinPrice(initialMinValue);
    setMaxPrice(initialMaxValue);
  }, [initialMinValue, initialMaxValue]);

  const parseStringValue = (text: string) => {
    const digitsOnly = text.match(/\d+/g);

    return digitsOnly
      ? parseInt(digitsOnly.join(''), 10)
      : undefined;
  };

  const onMinPriceChange = (text) => {
    const price = parseStringValue(text) || -1;
    setMinPrice(price);
    onSelectFilterOption('priceFilter.startPrice', price);
  };

  const onMaxPriceChange = (text) => {
    const price = parseStringValue(text) || -1;
    setMaxPrice(price);
    onSelectFilterOption('priceFilter.endPrice', price);
  };

  return (
    <View style={styles.container}>
      <SectionTitle title={title} style={styles.title_style} />
      <View style={styles.price_range_container}>
        <TextInput
          style={styles.text_input}
          value={minPrice >= 0 ? formatDecimal(minPrice) : ''}
          placeholder="Giá tối thiểu"
          multiline={false}
          keyboardType="number-pad"
          onChangeText={onMinPriceChange}
        />
        <Text style={styles.separator}>-</Text>
        <TextInput
          style={styles.text_input}
          value={maxPrice >= 0 ? formatDecimal(maxPrice) : ''}
          placeholder="Giá tối đa"
          multiline={false}
          keyboardType="number-pad"
          onChangeText={onMaxPriceChange}
        />
      </View>
    </View>
  );
}

PriceRangeGroup.defaultProps = {
  title: '',
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  title_style: {
    backgroundColor: 'white',
    marginBottom: 10,
  },
  price_range_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  text_input: {
    ...Layout.font.normal,
    color: Colors.itemTextColor,
    width: 100,
    height: 40,
    backgroundColor: Colors.backgroundColor,
    borderRadius: 3,
    textAlign: 'center',
  },
  separator: {
    marginLeft: 10, marginRight: 10,
  }
});

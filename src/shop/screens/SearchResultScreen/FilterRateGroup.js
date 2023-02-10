import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import _ from 'lodash';
import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';
import SectionTitle from '../../components/SectionTitle';
import RateInput from '../../components/RateInput';
import TextButton from '../../components/TextButton';
import Space from '../../components/Space';

type Props = {

};

export default function FilterRateGroup({
  title,
  onSelectFilterOption,
  selectedOptions
}: Props) {
  const initialValue = _.get(selectedOptions, 'rate', 0);
  const [rate, setRate] = React.useState(initialValue);

  React.useEffect(() => {
    setRate(initialValue);
  }, [initialValue]);

  const onRateChange = (r) => {
    setRate(r);
    onSelectFilterOption('rate', r);
  };

  const onResetRate = () => {
    setRate(0);
    onSelectFilterOption('rate', 0);
  };

  return (
    <View style={styles.container}>
      <SectionTitle title={title} style={styles.title_style} />
      <View style={styles.rate_input}>
        <RateInput
          size={25}
          onChange={onRateChange}
          padding={8}
          defaultValue={rate}
        />
        <Space />
        <TextButton
          style={styles.reset_button}
          titleStyle={styles.reset_button_title}
          title="Đặt lại"
          onPress={onResetRate}
        />
      </View>
    </View>
  );
}

FilterRateGroup.defaultProps = {
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
  rate_input: {
    flexDirection: 'row',
    marginLeft: 20,
    marginRight: 25,
    marginBottom: 10,
  },
  reset_button: {
    width: 60,
    height: 30,
    backgroundColor: Colors.tintColor,
  },
  reset_button_title: {
    ...Layout.font.normal,
    color: 'white',
  }
});

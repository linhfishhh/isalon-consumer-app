import React from 'react';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import { times } from 'lodash';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Props = {
  size: Number,
  padding?: Number,
  onChange: Function,
  defaultValue?: Number,
};

export default function RateInput({
  defaultValue, size, padding, onChange
}: Props) {
  const starStyle = {
    ...styles.star,
    marginLeft: padding / 2,
    marginRight: padding / 2,
  };

  const [rate, setRate] = React.useState(defaultValue);

  React.useEffect(() => {
    setRate(defaultValue);
  }, [defaultValue]);

  const onStarPress = (r) => {
    setRate(r);
    if (onChange) {
      onChange(r);
    }
  };

  return (
    <View style={styles.container}>
      {
        times(5, (index) => (
          <TouchableWithoutFeedback
            style={starStyle}
            key={index}
            onPress={() => onStarPress(index + 1)}
          >
            <Icon
              name="star"
              style={starStyle}
              size={size}
              color={index < rate ? '#fcb315' : '#a6a8ab'}
            />
          </TouchableWithoutFeedback>
        ))
      }
    </View>
  );
}

RateInput.defaultProps = {
  padding: 20,
  defaultValue: 0,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  star: {

  }
});

import React from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import { times } from 'lodash';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Layout from '../constants/Layout';
import Colors from '../constants/Colors';

type Props = {};

export function RateView({ rate, size }: Props) {
  const starStyle = StyleSheet.create({
    star_rate_container: {
      marginLeft: 5,
      marginRight: 5,
      height: size,
      width: 5 * size,
    },
    star: {
      width: size, height: size,
    },
  });
  return (
    <View style={starStyle.star_rate_container}>
      <View style={styles.stars_back}>
        {
          times(5, (index) => (
            <Icon name="star" color="#E4E4E4" style={starStyle.star} key={index} size={size} />
          ))
        }
      </View>
      <View style={{
        ...styles.stars_front,
        width: rate * size
      }}
      >
        {
          times(5, (index) => (
            <Icon name="star" color="#FCB315" style={starStyle.star} key={index} size={size} />
          ))
        }
      </View>
    </View>
  );
}

RateView.defaultProps = {
  size: 10,
};

export default function RateAmountView({
  rate, size, numberOfUsers, rateTextStyle, countStyle
}: Props) {
  const style = StyleSheet.create({
    rate: {
      ...styles.rate_text,
      ...rateTextStyle,
    },
    count: {
      ...styles.rate_count,
      ...countStyle,
    }
  });
  return (
    <View style={styles.container}>
      <Text style={style.rate}>{rate}</Text>
      <RateView rate={rate} size={size} />
      {numberOfUsers !== undefined ? <Text style={style.count}>{`(${numberOfUsers})`}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  stars_back: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'absolute',
    margin: 0
  },
  stars_front: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'absolute',
    marginLeft: 0,
    marginTop: 0,
    marginBottom: 0,
    width: 0,
    overflow: 'hidden'
  },
  star: {
    width: 7,
    height: 7,
    marginLeft: 2,
    marginRight: 2
  },
  rate_text: {
    ...Layout.font.normal,
    color: Colors.sectionTextColor,
    fontSize: Layout.microFontSize,
  },
  rate_count: {
    ...Layout.font.normal,
    color: '#808080',
    fontSize: 6,
  }
});

RateAmountView.defaultProps = {
  rate: 0,
  size: 10,
  rateTextStyle: {
    fontSize: Layout.microFontSize,
  },
  countStyle: {
    fontSize: 6,
  }
};

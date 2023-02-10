import React, { PureComponent } from 'react';

import {
  View,
  StyleSheet,
} from 'react-native';
import { CountDown } from '../../components/countdown/CountDown';

export default class CountdownTimer extends PureComponent {
  render() {
    const { time } = this.props;
    return (
      <View style={styles.container}>
        <CountDown
          until={time}
          timetoShow={('D', 'H', 'M', 'S')}
          // onFinish={() => { this.props.updateTimeOut(true) }}
          size={8}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start'
  }
});

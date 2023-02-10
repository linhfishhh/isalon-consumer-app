import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

export default function EvaluationFeedback() {
  return (
    <View style={styles.container}>
      <View style={styles.row} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

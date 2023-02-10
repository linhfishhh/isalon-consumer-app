import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Layout from '../../constants/Layout';

type Props = {
  enabled?: Boolean,
  style?: Object,
  titleStyle?: Object,
  title: String,
  start?: Object,
  end?: Object,
  colors?: Array,
};

const defaultStartPosition = { x: 0, y: 0 };
const defaultEndPosition = { x: 1, y: 0 };
const defaultGradientLocation = [0, 1];
const defaultGradientColor = ['#f05a28', '#d91c5c'];

export default function GradientButton({
  enabled,
  style,
  titleStyle,
  title,
  onPress,
  start,
  end,
  colors
}: Props) {
  const [buttonStyle] = React.useState({
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...style,
  });
  return (
    <TouchableOpacity
      disabled={!enabled}
      style={[buttonStyle, !enabled && { opacity: 0.5 }]}
      onPress={onPress}
    >
      <LinearGradient
        start={start}
        end={end}
        locations={defaultGradientLocation}
        colors={colors}
        style={styles.linear_gradient}
      >
        <Text style={titleStyle}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

GradientButton.defaultProps = {
  enabled: true,
  style: {
    width: 25, height: 25
  },
  titleStyle: {
    ...Layout.font.normal,
    color: 'white',
  },
  start: defaultStartPosition,
  end: defaultEndPosition,
  colors: defaultGradientColor,
};

const styles = StyleSheet.create({
  linear_gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import React from 'react';
import {
  StyleSheet,
  View,
  Image,
} from 'react-native';
import VectorIconButton from '../Button/VectorIconButton';

type Props = {};

export default function PickedImage({ style, image, onRemove }: Props) {
  const containerStyle = {
    ...styles.container,
    ...style,
  };
  const imageStyle = {
    width: style.width,
    height: style.height,
  };

  const onRemoveImage = () => {
    if (onRemove) {
      onRemove(image);
    }
  };

  return (
    <View style={containerStyle}>
      <Image
        source={{ uri: `data:${image.mime};base64,${image.data}` }}
        style={imageStyle}
      />
      <VectorIconButton
        style={styles.close_button}
        size={20}
        name="close"
        color="#231f20"
        onPress={onRemoveImage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {

  },
  close_button: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 20,
    height: 20,
  }
});

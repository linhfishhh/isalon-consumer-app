import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
} from 'react-native';
import _ from 'lodash';
import ImagePicker from 'react-native-image-crop-picker';
import Img from '../Img';
import PickedImage from './PickedImage';
import Layout from '../../constants/Layout';

import pickerIcon from '../../../assets/images/shop/ic_image_picker.png';

const IMAGE_SIZE = 76;

export default function UploadImagePicker(props) {
  const { onChange, maxFiles } = props;

  const [pickedImages, setPickedImages] = React.useState([]);

  const onCameraButtonClick = () => {
    ImagePicker.openPicker({
      maxFiles,
      mediaType: 'photo',
      multiple: true,
      includeBase64: true,
      forceJpg: true,
      compressImageMaxWidth: 2000,
      compressImageMaxHeight: 2000,
    }).then((images) => {
      const newPickedImages = _.uniqBy([...pickedImages, ...images], 'filename');
      if (onChange) {
        onChange(newPickedImages);
      }
      setPickedImages(newPickedImages);
    }).catch(() => {
      // close picker
    });
  };

  const pickedImagesWrapper = {
    width: pickedImages.length * (IMAGE_SIZE + 10),
    maxWidth: Layout.window.width - IMAGE_SIZE,
  };

  const onRemovePickedImage = (image) => {
    const originalImages = [...pickedImages];
    _.remove(originalImages, (img) => img.data === image.data);
    if (onChange) {
      onChange(originalImages);
    }
    setPickedImages(originalImages);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        disabled={pickedImages.length === maxFiles}
        style={styles.camera_button}
        onPress={onCameraButtonClick}
      >
        <Img style={styles.camera_icon} source={pickerIcon} />
      </TouchableOpacity>
      <View style={pickedImagesWrapper}>
        <ScrollView
          style={styles.picked_mages_container}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {
            pickedImages.map((image, index) => (
              <PickedImage
                image={image}
                style={styles.picked_image}
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                onRemove={onRemovePickedImage}
              />
            ))
          }
        </ScrollView>
      </View>
    </View>
  );
}

UploadImagePicker.defaultProps = {
  maxFiles: 5
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera_button: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera_icon: {
    width: 45, height: 40,
  },
  picked_images_container: {
    maxWidth: Layout.window.width - IMAGE_SIZE,
  },
  picked_image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    marginRight: 10,
    backgroundColor: '#00a69c',
  }
});

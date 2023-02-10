import React from 'react';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import ImageButton from '../ImageButton';
import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';
import ImagePreviewer from '../ImagePreviewer';
import {
  getImageUrl,
  getThumbImageUrl
} from '../../utils';

type Props = {};

function BannerImages(props: Props) {
  const { images } = props;
  const banners = React.useMemo(() => {
    const previewImages = images || [];
    return previewImages.map((img) => ({
      id: img.imageId,
      url: getImageUrl(img.imageId),
      thumbUrl: getThumbImageUrl(img.imageId),
      freeHeight: false
    }));
  }, [images]);
  const [imageIndex, setImageIndex] = React.useState(0);
  const previewerRef = React.useRef(null);

  const onPreviewImage = () => {
    previewerRef.current.show();
  };

  const renderItem = ({ item, index }) => (
    <ImageButton
      style={styles.item}
      key={index}
      source={{ uri: item.url }}
      onPress={onPreviewImage}
    />
  );

  const onSnapToItem = (index) => {
    setImageIndex(index);
  };

  const pagination = () => (
    <Pagination
      dotsLength={banners.length}
      activeDotIndex={imageIndex}
      containerStyle={styles.page_container}
      dotStyle={styles.dot_style}
      inactiveDotColor="white"
      dotColor={Colors.tintColor}
      inactiveDotOpacity={1}
      inactiveDotScale={0.7}
    />
  );

  return (
    <View style={styles.container}>
      <Carousel
        style={styles.content}
        autoplay={false}
        loop={false}
        sliderWidth={itemWidth}
        sliderHeight={itemHeight}
        itemWidth={itemWidth}
        data={banners}
        renderItem={renderItem}
        onSnapToItem={onSnapToItem}
      />
      {pagination()}
      <View style={styles.pagination}>
        <Text style={styles.image_count}>{`${(imageIndex + 1)}/${banners.length}`}</Text>
      </View>
      <ImagePreviewer ref={previewerRef} images={banners} />
    </View>
  );
}

const itemWidth = Layout.window.width < 700 ? Layout.window.width : 700;
const itemHeight = itemWidth;

const styles = StyleSheet.create({
  container: {
    width: Layout.window.width,
    height: itemHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    position: 'absolute',
    margin: 0
  },
  page_container: {
    position: 'absolute',
    bottom: -20,
  },
  dot_style: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: -3,
  },
  pagination: {
    width: 40,
    position: 'absolute',
    left: 25,
    bottom: 20,
    backgroundColor: '#00000066',
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    width: itemWidth,
    height: itemHeight,
  },
  image_count: {
    ...Layout.font.normal,
    fontSize: Layout.fontSize,
    color: 'white',
  }
});

export default React.memo(BannerImages);

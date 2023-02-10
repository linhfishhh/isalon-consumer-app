import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import _ from 'lodash';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';
import { WebImage } from '../../components/Img';
import { getImageUrl } from '../../utils';

type Props = {
  spotlightItem: Object,
  navigation: Object,
};

function Item({ item, navigation }) {
  const onPress = () => {
    navigation.push('WebScreen', {
      uri: item.url,
    });
  };

  return (
    <TouchableOpacity
      style={styles.item_container}
      onPress={onPress}
      activeOpacity={1}
    >
      <WebImage
        style={styles.item}
        source={getImageUrl(_.get(item, 'imageId'))}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );
}

function Banner({ spotlightItem, navigation }: Props) {
  const banners = _.get(spotlightItem, 'banners');
  const [activeDotIndex, setActiveDotIndex] = React.useState(0);

  const renderItem = ({ item, index }) => (
    <Item item={item} key={item.spotlightBannerId || index} navigation={navigation} />
  );

  const onSnapToItem = (index) => {
    setActiveDotIndex(index);
  };

  const pagination = () => (
    <Pagination
      dotsLength={banners.length}
      activeDotIndex={activeDotIndex}
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
        autoplay
        autoplayInterval={5000}
        loop
        sliderWidth={bannerWidth}
        sliderHeight={bannerHeight}
        itemWidth={bannerWidth}
        data={banners}
        renderItem={renderItem}
        onSnapToItem={onSnapToItem}
      />
      {pagination()}
    </View>
  );
}

const bannerWidth = Layout.window.width - 50;
const bannerHeight = bannerWidth / 3;

const styles = StyleSheet.create({
  container: {
    width: bannerWidth,
    height: bannerHeight,
    marginLeft: 25,
    marginRight: 25,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    margin: 0,
    width: bannerWidth,
    height: bannerHeight,
  },
  pagination: {
    position: 'absolute',
    top: 100,
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
  item_container: {
    width: bannerWidth,
    height: bannerHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    width: bannerWidth,
    height: bannerHeight
  },
});

export default React.memo(Banner);

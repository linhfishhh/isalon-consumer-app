import React from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Text
} from 'react-native';
import _ from 'lodash';
import SectionTitle from '../../components/SectionTitle';
import { Layout, Colors, SpotlightTypes } from '../../constants';
import Separator from '../../components/Separator';
import { WebImage } from '../../components/Img';
import { getThumbImageUrl } from '../../utils';

type Props = {
  spotlightItem: Object,
  navigation: Object,
};

class CategoryItem extends React.PureComponent {
  onClick = () => {
    const { onPress, data } = this.props;
    onPress(data);
  }

  render() {
    return (
      <TouchableOpacity style={styles.category_container} onPress={this.onClick}>
        <View style={styles.category_item}>
          <WebImage
            style={styles.category_item_image}
            source={getThumbImageUrl(_.get(this.props, 'data.imageId'))}
          />
        </View>
        <Text style={styles.item_text} numberOfLines={2} ellipsizeMode="tail">{_.get(this.props, 'data.name')}</Text>
      </TouchableOpacity>
    );
  }
}

export default function ProductCategories({ spotlightItem, navigation }: Props) {
  const keyExtractor = (item) => `${item.categoryId}`;

  const onSelectCategory = (category) => {
    navigation.push('SearchResultScreen', {
      title: _.get(category, 'name'),
      category: SpotlightTypes.category,
      id: _.get(category, 'categoryId'),
    });
  };

  const renderItem = ({ item }) => (
    <CategoryItem data={item} onPress={onSelectCategory} />
  );

  const header = () => (
    <View style={styles.header_footer} />
  );
  return (
    <View style={styles.container}>
      <SectionTitle title={spotlightItem.name} />
      <FlatList
        style={styles.category_list}
        data={_.get(spotlightItem, 'category.subCategories')}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        ListHeaderComponent={header}
        ListFooterComponent={header}
      />
      <Separator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: Colors.backgroundColor,
  },
  section_title: {
    marginLeft: 25
  },
  category_list: {

  },
  category_container: {
    flexDirection: 'column',
    width: 70,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 12,
    marginBottom: 20,
  },
  category_item: {
    backgroundColor: 'white',
    width: 50,
    height: 50,
    marginBottom: 5,
    borderRadius: 25,
    overflow: 'hidden',
  },
  category_item_image: {
    width: 50, height: 50,
  },
  header_footer: {
    width: 20
  },
  item_text: {
    ...Layout.font.normal,
    fontSize: Layout.smallFontSize,
    color: Colors.itemTextColor,
    textAlign: 'center'
  }
});

import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import _ from 'lodash';
import SectionTitle from '../../components/SectionTitle';
import TagsView from '../../components/TagsView';
import { VectorIconButton } from '../../components/Button';

type Props = {

};

const downArrowHitslop = {
  top: 10,
  left: 10,
  bottom: 10,
  right: 10,
};

export default function FilterGroup({
  option,
  selectedOptions,
  expandable,
  collapsed,
  onSelectFilterOption
}: Props) {
  const { filterName, objectList } = option;

  const title = React.useMemo(() => {
    switch (filterName) {
      case 'category': return 'Các ngành hàng';
      case 'brand': return 'Thương hiệu';
      case 'price': return 'Giá';
      case 'rate': return 'Xếp hạng';
      case 'uses': return 'Công dụng';
      case 'origin': return 'Xuất xứ';
      default: return '';
    }
  }, [option]);

  const cachedTags = React.useMemo(() => {
    const isCategory = filterName === 'category';
    const categoryIds = _.get(selectedOptions, 'categoryIds', []);
    const brandIds = _.get(selectedOptions, 'brandIds', []);
    if (!_.isEmpty(objectList)) {
      const ret = objectList.map((item) => {
        const opt = _.get(item, 'name');
        if (isCategory) {
          return {
            name: opt,
            selected: categoryIds.includes(item.categoryId),
            tagId: item.categoryId,
          };
        }
        return {
          name: opt,
          selected: brandIds.includes(item.brandId),
          tagId: item.brandId,
        };
      });
      return ret;
    }
    return [];
  }, [option, selectedOptions]);

  const [tags, setTags] = React.useState(cachedTags);

  React.useEffect(() => {
    setTags(cachedTags);
  }, [cachedTags]);

  const [expanded, setExpanded] = React.useState(!collapsed);

  const onExpand = () => {
    setExpanded(!expanded);
  };

  const onSelectTag = (tag) => {
    const existedTag = tags.find((ol) => ol.name === tag.name);
    if (filterName === 'category') {
      // find id
      const tagId = _.get(existedTag, 'tagId');
      onSelectFilterOption('categoryIds', tagId);
    } else if (filterName === 'brand') {
      // find id
      const tagId = _.get(existedTag, 'tagId');
      onSelectFilterOption('brandIds', tagId);
    }
    existedTag.selected = !existedTag.selected;
    setTags([...tags]);
  };

  return (
    <View style={styles.container}>
      <SectionTitle
        title={title}
        style={styles.title_style}
        onPress={onExpand}
      >
        {expandable ? (
          <VectorIconButton
            name={expanded ? 'expand-less' : 'expand-more'}
            size={20}
            color="#999999"
            hitSlop={downArrowHitslop}
            onPress={onExpand}
          />
        ) : null}
      </SectionTitle>
      {expanded ? <TagsView style={styles.tags} tags={tags} onSelectTag={onSelectTag} /> : null}
    </View>
  );
}

FilterGroup.defaultProps = {
  title: '',
  expandable: false,
  collapsed: false,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  title_style: {
    backgroundColor: 'white',
    marginBottom: 10,
  },
  tags: {
    marginLeft: 25,
    marginRight: 20,
    marginBottom: 10,
  }
});

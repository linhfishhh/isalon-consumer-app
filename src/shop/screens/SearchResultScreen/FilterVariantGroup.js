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

export default function FilterVariantGroup({
  option,
  selectedOptions,
  expandable,
  collapsed,
  onSelectFilterOption
}: Props) {
  const { name, variantValues } = option;

  const cachedTags = React.useMemo(() => {
    const variantValueIds = _.get(selectedOptions, 'variantValueIds', []);
    if (!_.isEmpty(variantValues)) {
      const ret = variantValues.map((item) => {
        const opt = _.get(item, 'name');
        return {
          name: opt,
          selected: variantValueIds.includes(item.variantValueId),
          tagId: item.variantValueId
        };
      });
      return ret;
    }
    return [];
  }, [option, selectedOptions]);

  const [tags, setTags] = React.useState(cachedTags);

  const [expanded, setExpanded] = React.useState(!collapsed);

  React.useEffect(() => {
    setTags(cachedTags);
  }, [cachedTags]);

  const onExpand = () => {
    setExpanded(!expanded);
  };

  const onSelectTag = (tag) => {
    // find id
    const existedTag = tags.find((ol) => ol.name === tag.name);
    const tagId = _.get(existedTag, 'tagId');
    onSelectFilterOption('variantValueIds', tagId);
    existedTag.selected = !existedTag.selected;
    setTags([...tags]);
  };

  return (
    <View style={styles.container}>
      <SectionTitle
        title={name}
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

FilterVariantGroup.defaultProps = {
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

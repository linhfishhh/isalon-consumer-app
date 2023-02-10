import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import TextButton from './TextButton';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';

type Props = {
  style: Object,
  tags: Array,
  onSelectTag: Function,
};

export default function TagsView({
  style,
  tags,
  onSelectTag
}: Props) {
  function Tag({ tag }) {
    const onClick = React.useCallback(() => {
      onSelectTag(tag);
    }, []);
    return (
      <TextButton
        style={tag.selected ? styles.tag_selected : styles.tag}
        title={tag.name}
        titleStyle={tag.selected ? styles.tag_title_selected : styles.tag_title}
        onPress={onClick}
      />
    );
  }
  return (
    <View style={[styles.container, style]}>
      {
        tags.map((tag, index) => (
          <Tag
            tag={tag}
            // eslint-disable-next-line react/no-array-index-key
            key={tag.tagId || index}
          />
        ))
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e5e5e5',
    margin: 2,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  tag_selected: {
    height: 24,
    borderRadius: 12,
    backgroundColor: '#39b54a',
    margin: 2,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  tag_title: {
    ...Layout.font.normal,
    fontSize: Layout.smallFontSize,
    color: Colors.itemTextColor
  },
  tag_title_selected: {
    ...Layout.font.normal,
    fontSize: Layout.smallFontSize,
    color: 'white'
  }
});

import React from 'react';
import {
  StyleSheet,
  FlatList,
  View,
} from 'react-native';
import FAQItem from './FAQItem';

type Props = {
  messages: Array,
  onLoadmore: Function,
};

export default function FAQContent({ messages, onLoadmore }: Props) {
  const keyExtractor = (item, index) => item + index;

  const renderItem = ({ item, index }) => (
    <FAQItem item={item} isLast={messages.length === index + 1} />
  );

  const header = () => <View style={internalStyles.header_footer} />;

  return (
    <FlatList
      style={internalStyles.content}
      data={messages}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ListFooterComponent={header}
      onEndReached={onLoadmore}
      onEndReachedThreshold={0.1}
    />
  );
}

const internalStyles = StyleSheet.create({
  content: {
    backgroundColor: 'white',
    flex: 1,
  },
  header_footer: {
    height: 20,
  }
});

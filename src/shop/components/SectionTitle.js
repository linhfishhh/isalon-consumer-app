import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Layout from '../constants/Layout';
import Colors from '../constants/Colors';
import Space from './Space';

type Props = {
  title: String,
  subTitle: String,
  children: Object,
  style: Object
};

export default function SectionTitle({
  title, subTitle, children, style, onPress
}: Props) {
  return (
    <View
      style={{
        ...styles.container,
        ...style
      }}
      onPress={onPress}
      activeOpacity={1}
    >
      <View style={styles.title_container}>
        <Text style={styles.title}>{title}</Text>
        {subTitle ? <Text style={styles.sub_title}>{subTitle}</Text> : null}
      </View>
      <Space />
      <View style={styles.accessories}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.backgroundColor
  },
  title_container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: 25,
    marginRight: 5,
    marginTop: 16,
  },
  title: {
    ...Layout.font.bold,
    maxWidth: Layout.window.width - 50,
    fontSize: Layout.sectionFontSize,
    color: Colors.sectionTextColor,
  },
  sub_title: {
    ...Layout.font.normal,
    fontSize: Layout.smallFontSize,
    color: Colors.subSectionTextColor,
    // marginLeft: 25,
  },
  accessories: {
    marginRight: 25,
    marginTop: 8
  }
});

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View
} from 'react-native';
import Layout from '../constants/Layout';
import Colors from '../constants/Colors';
import Img from './Img';
import Space from './Space';

import icDot from '../../assets/images/shop/ic_dot.png';

type Props = {
  bulletStyle?: Object,
  accessoryStyle?: Object,
  title: String,
  subTitle: String,
  bulletSource?: Object,
  accessorySource: Object,
};

function UnorderedListItemContent({
  bulletStyle,
  accessoryStyle,
  title,
  subTitle,
  bulletSource,
  accessorySource
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.bullet_container}>
        <Img
          style={{
            ...styles.bullet,
            ...bulletStyle
          }}
          source={bulletSource}
        />
      </View>
      <View style={styles.text_container}>
        <Text
          style={styles.title}
          // numberOfLines={2}
          ellipsizeMode="tail"
        >
          {title}
        </Text>
        {subTitle ? <Text style={styles.sub_title} ellipsizeMode="tail">{subTitle}</Text> : null}
      </View>
      <Space />
      {
        accessorySource ? <Img style={accessoryStyle} source={accessorySource} /> : null
      }
    </View>
  );
}

type UnorderedListItemProps = {
  bulletStyle?: Object,
  accessoryStyle?: Object,
  title: String,
  subTitle: String,
  bulletSource?: Object,
  accessorySource: Object,
  touchable?: Boolean
}

export default function UnorderedListItem({
  style,
  bulletStyle,
  accessoryStyle,
  title,
  subTitle,
  bulletSource,
  accessorySource,
  touchable,
  onPress,
}: UnorderedListItemProps) {
  if (touchable) {
    return (
      <TouchableOpacity style={style} onPress={onPress}>
        <UnorderedListItemContent
          bulletStyle={bulletStyle}
          accessoryStyle={accessoryStyle}
          title={title}
          subTitle={subTitle}
          bulletSource={bulletSource}
          accessorySource={accessorySource}
        />
      </TouchableOpacity>
    );
  }
  return (
    <View style={style}>
      <UnorderedListItemContent
        bulletStyle={bulletStyle}
        accessoryStyle={accessoryStyle}
        title={title}
        subTitle={subTitle}
        bulletSource={bulletSource}
        accessorySource={accessorySource}
      />
    </View>
  );
}

UnorderedListItemContent.defaultProps = {
  bulletStyle: {
    width: 3,
    height: 3,
    marginTop: 8
  },
  accessoryStyle: {
    width: 6,
    height: 10,
  },
  bulletSource: icDot,
};

UnorderedListItem.defaultProps = {
  bulletStyle: {
    width: 3,
    height: 3,
    marginTop: 8
  },
  accessoryStyle: {
    width: 6,
    height: 10,
  },
  bulletSource: icDot,
  touchable: false,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  bullet_container: {
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  bullet: {
    marginTop: 4
  },
  text_container: {
    flexDirection: 'column'
  },
  title: {
    ...Layout.font.normal,
    fontSize: 13,
    color: Colors.itemTextColor,
    marginLeft: 10,
  },
  sub_title: {
    ...Layout.font.normal,
    fontSize: Layout.smallFontSize,
    color: Colors.subSectionTextColor,
    marginLeft: 10,
  }
});

import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  StatusBar,
} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ImageViewer from 'react-native-image-zoom-viewer';
import FastImage from 'react-native-fast-image';
import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';
import Space from '../Space';
import MainContainer from '../MainContainer';
import Img from '../Img';

import icThumbSelected from '../../../assets/images/shop/ic_thumb_selected.png';

const closeButtonHitslop = {
  top: 5,
  left: 5,
  bottom: 5,
  right: 5,
};

export default class ImagePreviewer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      currentImageIndex: 0,
    };
  }

  show = () => {
    this.setState({ isVisible: true });
  }

  onRequestClose = () => {
    this.setState({ isVisible: false });
  }

  renderHeader = () => {
    const { title } = this.props;
    return (
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Space />
        <TouchableOpacity
          style={styles.close_button}
          onPress={this.onRequestClose}
          hitSlop={closeButtonHitslop}
        >
          <Icon name="close" color="#a6a8ab" size={20} />
        </TouchableOpacity>
      </View>
    );
  }

  onThumPress = (index) => {
    this.setState({
      currentImageIndex: index,
    });
  }

  renderFooter = () => {
    const { images } = this.props;
    const { currentImageIndex } = this.state;
    return (
      <View style={styles.footer}>
        <ScrollView
          style={styles.footer}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {
            images.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={styles.thumb_container}
                onPress={() => this.onThumPress(index)}
              >
                <FastImage
                  style={styles.thumb}
                  source={{ uri: item.thumbUrl }}
                  resizeMode={FastImage.resizeMode.contain}
                />
                {
                  currentImageIndex === index
                    ? <Img style={styles.thumb} source={icThumbSelected} /> : null
                }
              </TouchableOpacity>
            ))
          }
        </ScrollView>
      </View>
    );
  }

  renderImage = (props) => (
    <FastImage
      style={styles.image}
      source={props.source}
      resizeMode={FastImage.resizeMode.contain}
    />
  )


  onChange = (index) => {
    this.setState({
      currentImageIndex: index,
    });
  }

  render() {
    const { images } = this.props;
    const { isVisible, currentImageIndex } = this.state;
    return (
      <Modal
        onBackdropPress={this.onRequestClose}
        onRequestClose={this.onRequestClose}
        style={styles.modal_style}
        isVisible={isVisible}
      >
        <StatusBar
          translucent
          backgroundColor="black"
          barStyle="light-content"
        />
        <MainContainer
          hasNavigationBackground={false}
          style={styles.main_container}
        >
          <ImageViewer
            style={styles.viewer}
            imageUrls={images}
            index={currentImageIndex}
            onSwipeDown={this.onRequestClose}
            enableSwipeDown
            renderHeader={this.renderHeader}
            renderImage={this.renderImage}
            onChange={this.onChange}
          />
          {this.renderFooter()}
        </MainContainer>
      </Modal>
    );
  }
}

ImagePreviewer.defaultProps = {
  animationIn: 'slideInUp',
  animationOut: 'slideOutDown',
  isVisible: false,
  title: '',
};

const styles = StyleSheet.create({
  modal_style: {
    flex: 1,
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  main_container: {
    backgroundColor: 'black',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 25,
    marginRight: 10,
    marginTop: 10,
  },
  footer: {
    height: 100,
    width: Layout.window.width,
    backgroundColor: 'black',
  },
  title: {
    ...Layout.font.bold,
    color: Colors.itemTextColor,
  },
  close_button: {
    width: 20,
    height: 20,
  },
  viewer: {
    width: Layout.window.width,
    // height: Layout.window.height,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  thumb_container: {
    width: 74,
    height: 74,
    backgroundColor: 'white',
    borderRadius: 4,
    marginTop: 13,
    marginLeft: 7,
    marginRight: 7,
    overflow: 'hidden'
  },
  thumb: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 74,
    height: 74,
  }
});

import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  StatusBar,
  ScrollView
} from 'react-native';
import { getInset } from 'react-native-safe-area-view';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import { Layout, Colors } from '../../../constants';
import Space from '../../../components/Space';
import ProductItem from '../../../components/ProductItem';
import Separator from '../../../components/Separator';

const bottomMargin = getInset('bottom', false);

const closeButtonHitslop = {
  top: 5,
  left: 5,
  bottom: 5,
  right: 5,
};

const maxWidth = Layout.window.width > 700 ? 700 : Layout.window.width;
const productHeight = 180;
const containerMargin = 150;

export default class AddToCartDialog extends React.PureComponent {
  constructor(props) {
    super(props);
    const { products } = this.props;
    const productCount = Math.min(products.length, 2);
    this.state = {
      isVisible: false,
      contentStyle: {
        ...styles.contentStyle,
        height: productHeight * productCount + containerMargin,
      },
      productContainerStyle: {
        width: maxWidth,
        height: productHeight * productCount,
      }
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { products } = nextProps;
    const productCount = Math.min(products.length, 2);
    return {
      isVisible: prevState.isVisible || false,
      contentStyle: {
        ...styles.contentStyle,
        height: productHeight * productCount + containerMargin + bottomMargin,
      },
      productContainerStyle: {
        width: maxWidth,
        height: productHeight * productCount,
      }
    };
  }

  show = () => {
    this.setState({ isVisible: true });
  }

  handleBackPress = () => {
    const { isVisible } = this.state;
    if (isVisible) {
      this.onCloseModal();
      return true;
    }
    return false;
  }

  onCloseModal = () => {
    this.setState({ isVisible: false });
  }

  onViewCart = () => {
    const { navigation } = this.props;
    this.onCloseModal();
    navigation.push('MyCartScreen');
  }

  render() {
    const { isVisible, contentStyle, productContainerStyle } = this.state;
    const { products } = this.props;
    return (
      <Modal
        onBackButtonPress={this.handleBackPress}
        onBackdropPress={this.onCloseModal}
        style={styles.modal_style}
        isVisible={isVisible}
        // backdropColor: black
        // backdropOpacity: 0.7
      >
        <StatusBar
          translucent
          backgroundColor="#000000B2"
          barStyle="light-content"
        />
        <View style={contentStyle}>
          <View style={styles.thumb} />
          <View style={styles.content}>
            <View style={styles.header}>
              <SimpleLineIcon name="check" color={Colors.cyanColor} size={20} />
              <Text style={styles.title}>Sản phẩm đã được thêm vào giỏ hàng</Text>
              <Space />
              <TouchableOpacity
                style={styles.close_button}
                onPress={this.onCloseModal}
                hitSlop={closeButtonHitslop}
              >
                <Icon name="close" color="#a6a8ab" size={20} />
              </TouchableOpacity>
            </View>
            <ScrollView style={productContainerStyle}>
              {
                products.map((product, index) => (
                  <ProductItem
                    key={product.productId || index}
                    style={styles.product_style}
                    product={product}
                    horizontal
                  />
                ))
              }
            </ScrollView>
            <Separator height={1} />
            <TouchableOpacity style={styles.buy_button} onPress={this.onViewCart}>
              <Text style={styles.buy_text}>Xem giỏ hàng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

AddToCartDialog.defaultProps = {
  animationIn: 'slideInUp',
  animationOut: 'slideOutDown',
  title: '',
};

const styles = StyleSheet.create({
  modal_style: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 25,
    margin: 10,
  },
  title: {
    ...Layout.font.normal,
    color: Colors.cyanColor,
    marginLeft: 10,
  },
  close_button: {
    width: 20,
    height: 20,
  },
  success_checkmark: {
    width: 20,
    height: 20,
  },
  thumb: {
    width: 60,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.backgroundColor,
    alignSelf: 'center',
  },
  content: {
    marginTop: 10,
    backgroundColor: Colors.backgroundColor,
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  product_style: {
    width: maxWidth - 50,
    height: 170,
    marginLeft: 25,
    marginBottom: 10,
  },
  buy_button: {
    backgroundColor: '#ff5c39',
    borderRadius: 3,
    height: 40,
    width: maxWidth - 40,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    marginBottom: 10 + bottomMargin,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buy_text: {
    ...Layout.font.bold,
    color: 'white'
  },
  contentStyle: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    width: maxWidth,
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
  }
});

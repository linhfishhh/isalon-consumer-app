import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  StatusBar
} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';
import Space from '../Space';

const closeButtonHitslop = {
  top: 5,
  left: 5,
  bottom: 5,
  right: 5,
};

export default class DefaultModal extends React.PureComponent {
  handleBackPress = () => {
    const { isVisible, onClose } = this.props;
    if (isVisible) {
      onClose();
      return true;
    }
    return false;
  }

  onCloseModal = () => {
    const { onClose } = this.props;
    if (onClose) {
      onClose();
    }
  }

  render() {
    const { title, children, onModalHide } = this.props;
    return (
      <Modal
        onBackButtonPress={this.handleBackPress}
        onBackdropPress={this.onCloseModal}
        style={styles.modal_style}
        onModalHide={onModalHide}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...this.props}
      >
        <StatusBar
          translucent
          backgroundColor="#000000B2"
          barStyle="light-content"
        />
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Space />
            <TouchableOpacity
              style={styles.close_button}
              onPress={this.onCloseModal}
              hitSlop={closeButtonHitslop}
            >
              <Icon name="close" color="#a6a8ab" size={20} />
            </TouchableOpacity>
          </View>
          {children}
        </View>
      </Modal>
    );
  }
}

DefaultModal.defaultProps = {
  animationIn: 'slideInUp',
  animationOut: 'slideOutDown',
  isVisible: false,
  title: '',
};

const styles = StyleSheet.create({
  modal_style: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: Colors.backgroundColor,
    width: '100%',
    height: '80%',
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 30,
    margin: 10,
  },
  title: {
    ...Layout.font.bold,
    fontSize: Layout.titleFontSize,
    color: Colors.itemTextColor,
    marginLeft: 15,
  },
  close_button: {
    width: 20,
    height: 20,
  }
});

import React from 'react';
import {
  Animated,
  Easing,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { getInset } from 'react-native-safe-area-view';
import Modal from 'react-native-modal';
import { Layout, CommonStyles } from '../../constants';

const STATES = {
  HIDDEN: 'HIDDEN',
  ANIMATING: 'ANIMATING',
  SHOWN: 'SHOWN',
};

const ANIMATION_DURATION = 300;
const EASING = Easing.bezier(0.4, 0, 0.2, 1);
const SCREEN_INDENT_TOP = 115 + getInset('top', false);

class DropDownMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuState: STATES.HIDDEN,
      menuWidth: Layout.window.width,
      menuSizeAnimation: new Animated.ValueXY({ x: Layout.window.width, y: 0 }),
      opacityAnimation: new Animated.Value(0),
    };
  }

  // Start menu animation
  onMenuLayout = (e) => {
    const { menuState, menuSizeAnimation, opacityAnimation } = this.state;
    if (menuState === STATES.ANIMATING) {
      return;
    }

    const { width, height } = e.nativeEvent.layout;

    this.setState(
      {
        menuState: STATES.ANIMATING,
        menuWidth: width,
      },
      () => {
        Animated.parallel([
          Animated.timing(menuSizeAnimation, {
            toValue: { x: width, y: height },
            duration: ANIMATION_DURATION,
            easing: EASING,
          }),
          Animated.timing(opacityAnimation, {
            toValue: 1,
            duration: ANIMATION_DURATION,
            easing: EASING,
          }),
        ]).start();
      },
    );
  };

  onDismiss = () => {
    const { onHidden } = this.props;
    if (onHidden) {
      onHidden();
    }
  };

  show = () => {
    this.setState({
      menuState: STATES.SHOWN,
    });
  };

  hide = () => {
    const { opacityAnimation, menuWidth, onHidden } = this.state;
    Animated.timing(opacityAnimation, {
      toValue: 0,
      duration: ANIMATION_DURATION,
      easing: EASING,
    }).start(() => {
      // Reset state
      this.setState(
        {
          menuState: STATES.HIDDEN,
          menuSizeAnimation: new Animated.ValueXY({ x: menuWidth, y: 0 }),
          opacityAnimation: new Animated.Value(0),
        },
        () => {
          if (onHidden) {
            onHidden();
          }

          // Invoke onHidden callback if defined
          if (Platform.OS !== 'ios' && onHidden) {
            onHidden();
          }
        },
      );
    });
  };

  handleBackPress = () => {
    const { menuState } = this.state;
    if (menuState === STATES.SHOWN) {
      this.hide();
      return true;
    }
    return false;
  }

  render() {
    const {
      menuSizeAnimation,
      opacityAnimation,
    } = this.state;
    const menuSize = {
      width: menuSizeAnimation.x,
      height: menuSizeAnimation.y,
    };

    const shadowMenuContainerStyle = {
      opacity: opacityAnimation,
      left: 0,
      top: SCREEN_INDENT_TOP,
    };

    const { menuState } = this.state;
    const animationStarted = menuState === STATES.ANIMATING;
    const modalVisible = menuState === STATES.SHOWN || animationStarted;

    const { style, children } = this.props;

    return (
      <Modal
        style={styles.modal_style}
        visible={modalVisible}
        onRequestClose={this.hide}
        supportedOrientations={[
          'portrait',
          'portrait-upside-down',
          'landscape',
          'landscape-left',
          'landscape-right',
        ]}
        transparent
        onDismiss={this.onDismiss}
        onBackdropPress={this.hide}
        onBackButtonPress={this.handleBackPress}
      >
        <TouchableWithoutFeedback
          onPress={this.hide}
          accessible={false}
          style={styles.content}
        >
          <View style={styles.content}>
            <Animated.View
              onLayout={this.onMenuLayout}
              style={[
                styles.shadowMenuContainer,
                shadowMenuContainerStyle,
                style,
              ]}
            >
              <Animated.View
                style={[styles.menuContainer, animationStarted && menuSize]}
              >
                {children}
              </Animated.View>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modal_style: {
    margin: 0,
    // justifyContent: 'center',
    // alignItems: 'center'
  },
  safe_area: {
    flex: 1,
    flexDirection: 'column',
  },
  content: {
    flex: 1,
  },
  shadowMenuContainer: {
    position: 'absolute',
    backgroundColor: 'blue',
    borderRadius: 4,
    opacity: 0,
    ...CommonStyles.navigation_shadow
  },
  menuContainer: {
    overflow: 'hidden',
  },
});

export default DropDownMenu;

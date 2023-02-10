import React, { Component } from 'react';
import { Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Colors from '../styles/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import GlobalStyles from '../styles/GlobalStyles';

export default class WAButton extends Component<Props> {
  static defaultProps = {
    activeOpacity: 0.8,
    iconLeft: true,
    iconFloat: false,
    enabled: true
  };
  static propTypes = {
    text: PropTypes.oneOfType([PropTypes.string]),
    textStyle: Text.propTypes.style,
    icon: PropTypes.string,
    iconStyle: Icon.propTypes.style,
    iconLeft: PropTypes.bool,
    iconFloat: PropTypes.bool,
    enabled: PropTypes.bool
  };
  constructor(props) {
    super(props);
  }
  render() {
    let items = [];
    let c = 0;
    if (this.props.text) {
      items.push(
        <Text key={c} style={[Styles.buttonText, this.props.textStyle]}>
          {this.props.text}
        </Text>
      );
      c++;
    }
    if (this.props.icon) {
      let btnIconStyle = [Styles.buttonIcon, this.props.iconStyle];
      if (this.props.iconLeft) {
        if (this.props.iconFloat) {
          btnIconStyle.push(Styles.buttonIconFloatLeft);
        } else {
          btnIconStyle.push(Styles.buttonIconLeft);
        }
        items.unshift(
          <Icon key={c} style={btnIconStyle} name={this.props.icon} />
        );
      } else {
        if (this.props.iconFloat) {
          btnIconStyle.push(Styles.buttonIconFloatRight);
        } else {
          btnIconStyle.push(Styles.buttonIconRight);
        }
        items.push(
          <Icon key={c} style={btnIconStyle} name={this.props.icon} />
        );
      }
      c++;
    }
    return (
      <TouchableOpacity
        onPress={this.props.onPress}
        style={[Styles.button, this.props.style]}
        activeOpacity={this.props.activeOpacity}
        disabled={!this.props.enabled}
      >
        {items}
      </TouchableOpacity>
    );
  }
}

const Styles = StyleSheet.create({
  button: {
    height: 60,
    backgroundColor: Colors.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingRight: 15,
    paddingLeft: 15,
    borderRadius: 60,
    width: '100%',
    position: 'relative'
  },
  buttonText: {
    color: Colors.LIGHT,
    fontSize: 17,
    fontFamily: GlobalStyles.FONT_NAME
  },
  buttonIcon: {
    color: Colors.LIGHT,
    fontSize: 25
  },
  buttonIconLeft: {
    marginRight: 10
  },
  buttonIconRight: {
    marginLeft: 10
  },
  buttonIconFloatLeft: {
    position: 'absolute',
    left: 25
  },
  buttonIconFloatRight: {
    position: 'absolute',
    right: 25
  }
});

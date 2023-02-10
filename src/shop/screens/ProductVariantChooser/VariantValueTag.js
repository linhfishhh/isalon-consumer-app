import React from 'react';
import TwoStateButton from '../../components/TwoStateButton';
import styles from './styles';

export default class VariantValueTag extends React.PureComponent {
  onClick = () => {
    const { variant, variantValue, onPress } = this.props;
    onPress(variant, variantValue);
  }

  render() {
    const { selected, variantValue } = this.props;
    return (
      <TwoStateButton
        style={styles.capacity_button}
        textStyle={styles.capacity_text}
        selected={selected}
        title={variantValue.name}
        onPress={this.onClick}
      />
    );
  }
}

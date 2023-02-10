import React from 'react';
import {
  StyleSheet,
  FlatList,
} from 'react-native';
import { connect } from 'react-redux';
import DefaultModal from '../../components/DefaultModal';
import VoucherItem from './VoucherItem';
import {
  getAllPublicGiftCodes as getAllPublicGiftCodesAction,
} from '../../redux/cart/actions';

class VoucherScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
    };
  }

  componentDidMount() {
    const { getAllPublicGiftCodes } = this.props;
    getAllPublicGiftCodes();
  }

  setModalRef = (ref) => {
    this.modalRef = ref;
  }

  show = () => {
    this.setState({
      isModalVisible: true,
    });
  }

  onClose = () => {
    this.setState({
      isModalVisible: false,
    });
  }

  keyExtractor = (item, index) => item + index

  onSelectVoucher = (voucher) => {
    const { didSelectVoucher } = this.props;
    didSelectVoucher(voucher);
    this.setState({
      isModalVisible: false,
    });
  }

  renderItem = ({ item }) => (
    <VoucherItem item={item} onPress={this.onSelectVoucher} />
  )

  render() {
    const { isModalVisible } = this.state;
    const { title, giftCodes } = this.props;
    return (
      <DefaultModal
        ref={this.setModalRef}
        isVisible={isModalVisible}
        onClose={this.onClose}
        title={title}
      >
        <FlatList
          style={styles.list}
          data={giftCodes}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          showsVerticalScrollIndicator={false}
        />
      </DefaultModal>
    );
  }
}

const styles = StyleSheet.create({
  list: {

  }
});

export default connect(
  (state) => ({
    giftCodes: state.shopCart.giftCodes,
  }),
  {
    getAllPublicGiftCodes: getAllPublicGiftCodesAction,
  },
  null,
  { withRef: true }
)(VoucherScreen);

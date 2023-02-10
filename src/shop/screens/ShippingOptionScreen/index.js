import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
} from 'react-native';
import DefaultModal from '../../components/DefaultModal';
import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';
import TagName from '../../components/TagName';

export default class ShippingOptionScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    const { shipDate } = props;
    this.state = {
      isModalVisible: false,
      list: [
        {
          title: 'Giao hàng tiêu chuẩn, 1-3 ngày',
          desc: 'Miễn phí vận chuyển cho đơn hàng từ 99k hoặc trong khu vực nội thành Hà Nội',
          opt: 'Miễn phí',
        },
        {
          title: 'Ngoài ra đối với các đơn hàng nhỏ lẻ hoặc các tỉnh thành không được hỗ trợ free sẽ được tính chi phí dựa trên tổng kích thước/ khối lượng sản phẩm bạn đã mua từ nhà bán hàng',
        },
        {
          title: `Dự kiến giao hàng ${shipDate}`,
        },
        {
          title: 'Dịch vụ giao hàng',
          desc: 'Thanh toán khi nhận hàng. (Không được thu phụ phí khác)'
        }
      ]
    };
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

  keyExtractor = (item, index) => item + index;

  renderItem = ({ item }) => (
    <View style={styles.item}>
      {item.opt ? <TagName style={styles.item_opt} title={item.opt} /> : null}
      <View style={styles.desc}>
        <Text style={styles.item_title}>{item.title}</Text>
        {item.desc ? <Text style={styles.item_desc}>{item.desc}</Text> : null}
      </View>
    </View>
  );

  separator = () => (
    <View style={styles.separator} />
  );

  render() {
    const { isModalVisible, list } = this.state;
    const { title } = this.props;
    return (
      <DefaultModal
        ref={this.setModalRef}
        isVisible={isModalVisible}
        onClose={this.onClose}
        title={title}
      >
        <FlatList
          style={styles.list}
          data={list}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          ItemSeparatorComponent={this.separator}
        />
      </DefaultModal>
    );
  }
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: 'white',
  },
  separator: {
    height: 1,
    marginLeft: 25,
    backgroundColor: Colors.separatorColor,
  },
  item: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: 50,
    paddingTop: 8,
    paddingBottom: 8,
    marginRight: 25,
    marginLeft: 25,
  },
  desc: {
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    marginRight: 20,
    flex: 1,
  },
  item_title: {
    ...Layout.font.normal,
    color: Colors.itemTextColor,
  },
  item_desc: {
    ...Layout.font.normal,
    fontSize: Layout.smallFontSize,
    color: Colors.subSectionTextColor,
  },
  item_opt: {
    ...Layout.font.normal,
    color: Colors.itemTextColor,
    textAlign: 'right',
  },
});

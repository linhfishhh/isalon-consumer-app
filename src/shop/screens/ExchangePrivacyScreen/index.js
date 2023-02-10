import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DefaultModal from '../../components/DefaultModal';
import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';
import TagName from '../../components/TagName';

export default class ExchangePrivacy extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      list: [
        {
          icon: 'shield-check',
          title: '7 ngày đổi trả cho Nhà bán hàng',
          desc: 'Không được đổi trả với lý do "không vừa ý"',
          opt: 'Miễn phí',
        },
        {
          title: 'Đổi trả trực tiếp đến NBH trong vòng 7 ngày: Khách hàng và NBH phải trực tiếp nói chuyện và cùng nhau đi đến quyết định hoàn hàng. Khi NBH đồng ý với yêu cầu hoàn hàng, khách hàng nên thực hiện việc gửi hàng về để NBH kiểm tra chất lượng, trước khi ra quyết định hoàn tiền',
        },
        {
          icon: 'shield-check',
          title: 'Bằng tem bảo hành 12 tháng',
        },
        {
          title: 'Nhận đổi trả hàng trong 7 ngày nếu lỗi do nhà sản xuất. Quy định đổi trả còn tem niêm phong và thẻ bảo hành'
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
        <View style={styles.item_title_container}>
          {item.icon ? (
            <Icon name={item.icon} color={Colors.itemTextColor} size={15} style={styles.icon} />
          ) : null}
          <Text style={styles.item_title}>{item.title}</Text>
        </View>
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
  item_title_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  icon: {
    width: 15,
    height: 15,
    marginRight: 10,
    marginTop: 3,
    marginBottom: 3,
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

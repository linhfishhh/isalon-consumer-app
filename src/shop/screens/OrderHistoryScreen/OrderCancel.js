import React, { useState } from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import DefaultModal from '../../components/DefaultModal';
import OptionRow from './OptionRow';
import Layout from '../../constants/Layout';
import WAAlert from '../../../components/WAAlert';
import CommonStyles from '../../constants/CommonStyles';

export default function OrderCancel(props) {
  const {
    title,
    open,
    onClose,
    onAgree,
  } = props;

  const reasons = ['Thời gian giao hàng quá lâu', 'Trùng đơn hàng', 'Thay đổi địa chỉ giao hàng', 'Thay đổi ý'];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [cancelDialog, setCancelDialog] = useState(false);

  const keyExtractor = (item, index) => item + index;

  const renderItem = ({ item, index }) => (
    <OptionRow
      index={index}
      selected={selectedIndex === index}
      option={item}
      selectOption={setSelectedIndex}
    />
  );

  const handleAgreeCancelOrder = () => {
    onAgree(reasons[selectedIndex]);
    setCancelDialog(false);
  };

  const handleCloseCancelOrder = () => {
    setCancelDialog(false);
  };

  return (
    <DefaultModal
      isVisible={open}
      onClose={onClose}
      title={title}
    >
      <FlatList
        style={styles.list}
        data={reasons}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
      <SafeAreaView style={styles.safe_content}>
        <View style={styles.agree_container}>
          <TouchableOpacity style={styles.agree_button} onPress={() => setCancelDialog(true)}>
            <Text style={styles.agree_text}>Huỷ</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <WAAlert
        show={cancelDialog}
        title="iSalon"
        question="Bạn có chắc chắn muốn huỷ đơn hàng này không? :("
        titleFirst
        yes={handleAgreeCancelOrder}
        no={handleCloseCancelOrder}
        yesTitle="Đồng ý"
        noTitle="Đóng"
      />
    </DefaultModal>
  );
}

const styles = StyleSheet.create({
  safe_content: {
    ...CommonStyles.padding_top_for_safearea
  },
  list: {

  },
  agree_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 25,
    paddingRight: 25,
    height: 66,
    backgroundColor: 'white'
  },
  agree_button: {
    backgroundColor: '#ff5c39',
    borderRadius: 3,
    width: 102,
    height: 40,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  agree_text: {
    ...Layout.font.bold,
    fontSize: 15,
    color: 'white'
  },
});

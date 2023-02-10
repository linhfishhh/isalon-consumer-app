import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import useStateWithCallback from 'use-state-with-callback';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';
import Space from '../../components/Space';
import Img from '../../components/Img';
import Separator from '../../components/Separator';
import UnorderedListItem from '../../components/UnorderedListItem';
import icWarning from '../../../assets/images/shop/ic_warning.png';
import checkboxNormal from '../../../assets/images/shop/ic_radio_off.png';
import checkboxSelected from '../../../assets/images/shop/ic_radio_on.png';

type Props = {
};

const inputVatGuides = [
  'Hoá đơn các sản phẩm sẽ được isalon xuất kèm với sản phẩm khi giao hoặc xuất sau 7 ngày từ thời điểm mua hàng bằng hoá đơn điện tử',
  'iSalon từ chối xử lý các yêu cầu phát sinh trong việc kê khai thuế đối với những hoá đơn từ 20 triệu đồng trở lên thanh toán bằng tiền mặt',
];

export default function RequestVat(props: Props) {
  const [selected, setSelected] = useStateWithCallback(false, (s) => {
    props.onChange({
      includeBill: s,
    });
  });

  const onCompanyNameChange = React.useCallback((name) => {
    props.onChange({
      billName: name,
    });
  }, []);

  const onTaxCodeChange = React.useCallback((code) => {
    props.onChange({
      billTaxNumber: code,
    });
  }, []);

  const onCompanyAddressChange = React.useCallback((addr) => {
    props.onChange({
      billAddress: addr,
    });
  }, []);


  const onSelectRequestVAT = () => {
    setSelected(!selected);
  };

  return (
    <View style={internalStyles.container}>
      <TouchableOpacity
        style={internalStyles.title_container}
        onPress={onSelectRequestVAT}
      >
        <Img
          style={internalStyles.checkbox}
          source={selected ? checkboxSelected : checkboxNormal}
        />
        <Text style={internalStyles.name}>Yêu cầu hóa đơn</Text>
        <Space />
        <Icon
          name={selected ? 'expand-less' : 'expand-more'}
          size={20}
          color="#999999"
        />
      </TouchableOpacity>
      {selected ? (
        <View style={internalStyles.content}>
          <Text style={internalStyles.sub_title}>
            Vui lòng nhập tất cả các thông tin của bạn vào khung bên dưới
          </Text>
          <TextInput
            style={internalStyles.text_input}
            placeholder="Tên công ty"
            multiline={false}
            onChangeText={onCompanyNameChange}
          />
          <Separator height={1} />
          <TextInput
            style={internalStyles.text_input}
            placeholder="Mã số thuế"
            multiline={false}
            onChangeText={onTaxCodeChange}
            keyboardType="numeric"
          />
          <Separator height={1} />
          <TextInput
            style={internalStyles.text_input}
            placeholder="Địa chỉ công ty"
            multiline={false}
            onChangeText={onCompanyAddressChange}
          />
          <Separator height={1} />
          {
          inputVatGuides.map((item, index) => (
            <UnorderedListItem
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              style={internalStyles.detail_info}
              bulletStyle={internalStyles.bullet_style}
              title={item}
              bulletSource={icWarning}
            />
          ))
        }
        </View>
      ) : null}
    </View>
  );
}

const internalStyles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 10,
    paddingBottom: 10,
  },
  title_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  name: {
    ...Layout.font.bold,
    fontSize: Layout.sectionFontSize,
    color: Colors.itemTextColor,
    marginLeft: 10,
  },
  sub_title: {
    ...Layout.font.normal,
    fontSize: Layout.smallFontSize,
    color: Colors.subSectionTextColor,
    width: Layout.window.width - 80,
  },
  checkbox: {
    width: 20, height: 20,
  },
  content: {
    flexDirection: 'column',
    marginLeft: 30
  },
  text_input: {
    ...Layout.font.normal,
    fontSize: Layout.fontSize,
    color: Colors.itemTextColor,
    height: 40,
  },
  detail_info: {
    width: Layout.window.width - 90,
    marginTop: 10,
  },
  bullet_style: {
    width: 16,
    height: 16,
    marginTop: 4
  }
});

import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import styles from './styles';
import SectionTitle from '../../components/SectionTitle';
import UnorderedListItem from '../../components/UnorderedListItem';
import Separator from '../../components/Separator';
import ExchangePrivacyScreen from '../ExchangePrivacyScreen';
import icTick from '../../../assets/images/shop/ic_tick_mark.png';
import icRight from '../../../assets/images/shop/ic_right_arrow_accessory.png';

type Props = {
  style: Object,
};

export default function CustomerRights({ style }: Props) {
  const exchangeRef = React.useRef(null);
  const onShowServices = () => {
    exchangeRef.current.show();
  };

  const [rights] = React.useState([
    {
      title: 'Hoàn tiền 111% khi phát hiện hàng giả',
    },
    {
      title: 'Cam kết hàng chính hãng 100%',
    },
    {
      title: '7 ngày đổi trả cho Nhà bán hàng',
      subTitle: 'Không được đổi trả với lý do "không vừa ý"',
      hasDetail: true,
      onPress: onShowServices,
    },
    {
      title: 'Không áp dụng chính sách bảo hành',
    }
  ]);

  return (
    <View style={{
      ...styles.customer_rights,
      ...style
    }}
    >
      <SectionTitle title="Quyền lợi khách hàng" style={internalStyles.title} />
      {
        rights.map((right, index) => (
          <UnorderedListItem
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            style={internalStyles.customer_right_item}
            bulletStyle={internalStyles.bullet_style}
            title={right.title}
            subTitle={right.subTitle}
            bulletSource={icTick}
            accessorySource={right.hasDetail ? icRight : undefined}
            touchable={right.hasDetail}
            onPress={right.onPress}
          />
        ))
      }
      <Separator />
      <ExchangePrivacyScreen ref={exchangeRef} title="Dịch vụ" />
    </View>
  );
}

const internalStyles = StyleSheet.create({
  title: {
    backgroundColor: 'white',
    marginBottom: 6,
  },
  bullet_style: {
    width: 16,
    height: 16,
    marginTop: 4
  },
  customer_right_item: {
    marginLeft: 25,
    marginRight: 25,
    marginBottom: 10,
  }
});

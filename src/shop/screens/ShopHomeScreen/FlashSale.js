import React from 'react';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';
import moment from 'moment';
import CountdownTimer from '../../components/CountdownTimer';
import Img from '../../components/Img';
import Layout from '../../constants/Layout';
import ViewAllButton from '../../components/ViewAllButton';
import icFlashDeal from '../../../assets/images/shop/ic_flashdeal.png';

type Props = {
  onViewAll: Function,
  expiredAt: String,
};

function FlashSale(props: Props) {
  const { onViewAll, expiredAt } = props;
  // const startAt = moment(data.startAt, 'YYYY-MM-DD HH:mm::ss');
  const remainTime = React.useMemo(() => {
    const now = moment();
    const expiredAtDate = moment(expiredAt, 'YYYY-MM-DD HH:mm:ss');

    let countDownTime = Math.round(expiredAtDate.diff(now) / 1000);
    if (countDownTime < 0) {
      countDownTime = 0;
    }
    return countDownTime;
  }, [expiredAt]);

  return (
    <View style={styles.container}>
      <View style={styles.countdown_timer}>
        <Img style={styles.flash_deal_icon} source={icFlashDeal} />
        <Text style={styles.text}>Flash Sale</Text>
        <CountdownTimer time={remainTime} />
      </View>
      <ViewAllButton onPress={onViewAll} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginLeft: 25,
    marginRight: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  countdown_timer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  flash_deal_icon: {
    width: 13,
    height: 25
  },
  text: {
    ...Layout.font.bold,
    fontSize: Layout.sectionFontSize,
    marginLeft: 10,
    marginRight: 10,
    color: 'black'
  }
});

export default React.memo(FlashSale);

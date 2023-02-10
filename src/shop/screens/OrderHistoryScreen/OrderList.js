import React, {
  memo, useEffect, useState, useMemo
} from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, FlatList } from 'react-native';
import Shimmer from 'react-native-shimmer-placeholder';

import Colors from '../../../styles/Colors';

import OrderItem from './OrderItem';
import OrderEmpty from './OrderEmpty';

function OrderList(props) {
  const {
    dataKey,
    orderStatus,
    data,
    getOrderHistory,
    navigation,
    updateTabIndex,
    onCancel
  } = props;

  const { loading, orderList, paging } = data;

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getOrderHistory(dataKey, orderStatus, false, 0);
  }, []);

  useEffect(() => {
    if (!loading) {
      setRefreshing(false);
    }
  }, [loading]);

  const onRefresh = () => {
    setRefreshing(true);
    getOrderHistory(dataKey, orderStatus, true, 0);
  };

  const onLoadmore = () => {
    if (!paging.last) {
      getOrderHistory(dataKey, orderStatus, false, paging.pageable.pageNumber + 1);
    }
  };

  const placeholderItems = useMemo(() => {
    const rs = [];
    for (let i = 1; i <= 3; i += 1) {
      rs.push(
        <View key={`loading-item-${i}`} style={Styles.itemPhd}>
          <Shimmer style={Styles.titleWrapperPhd} autoRun colorShimmer={Colors.SHIMMER_COLOR} />
          <View style={Styles.subTitleWrapperPhd}>
            <View style={Styles.orderDatePhd}>
              <Shimmer style={Styles.dateTextPhd} autoRun colorShimmer={Colors.SHIMMER_COLOR} />
              <Shimmer style={Styles.dateTextPhd} autoRun colorShimmer={Colors.SHIMMER_COLOR} />
            </View>
            <Shimmer style={Styles.orderStatusPhd} autoRun colorShimmer={Colors.SHIMMER_COLOR} />
          </View>
          <View style={Styles.productListPhd}>
            <View style={Styles.productItemPhd}>
              <Shimmer style={Styles.productImagePhd} autoRun colorShimmer={Colors.SHIMMER_COLOR} />
              <View style={Styles.productInfoPhd}>
                <Shimmer style={Styles.namePhd} autoRun colorShimmer={Colors.SHIMMER_COLOR} />
                <Shimmer style={Styles.namePhd} autoRun colorShimmer={Colors.SHIMMER_COLOR} />
                <Shimmer style={Styles.namePhd} autoRun colorShimmer={Colors.SHIMMER_COLOR} />
                <Shimmer style={Styles.namePhd} autoRun colorShimmer={Colors.SHIMMER_COLOR} />
              </View>
            </View>
          </View>
          <View style={Styles.orderTotalPhd}>
            <Shimmer style={Styles.shippingStatusPhd} autoRun colorShimmer={Colors.SHIMMER_COLOR} />
            <Shimmer style={Styles.totalPhd} autoRun colorShimmer={Colors.SHIMMER_COLOR} />
          </View>
        </View>
      );
    }
    return rs;
  }, []);

  const renderItem = ({ item }) => (
    <OrderItem
      navigation={navigation}
      data={item}
      onCancel={onCancel}
    />
  );

  const renderEmptyPage = () => (!loading && !orderList.length ? (
    <OrderEmpty
      orderStatus={dataKey}
      navigation={navigation}
      updateTabIndex={updateTabIndex}
    />
  ) : (
    <></>
  ));

  return (
    <View>
      {loading && !refreshing ? placeholderItems : (
        <FlatList
          contentContainerStyle={{ flexGrow: 1 }}
          onEndReached={() => onLoadmore()}
          onEndReachedThreshold={0.1}
          keyExtractor={(item, index) => `${index}`}
          data={orderList}
          ListEmptyComponent={renderEmptyPage}
          renderItem={renderItem}
          onRefresh={onRefresh}
          refreshing={refreshing}
        />
      )}
    </View>
  );
}

OrderList.defaultProps = {
  data: {
    loading: true,
    orderList: [],
    paging: {}
  }
};

OrderList.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object,
};

export default memo(OrderList);

const Styles = StyleSheet.create({
  itemPhd: {
    paddingTop: 20,
    paddingBottom: 45,
    borderBottomColor: Colors.SILVER_LIGHT,
    borderBottomWidth: 5,
    paddingLeft: 30,
    paddingRight: 30
  },
  titleWrapperPhd: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    backgroundColor: Colors.SILVER_LIGHT,
    height: 15
  },
  subTitleWrapperPhd: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  orderDatePhd: {
    flex: 3,
    marginRight: 10
  },
  dateTextPhd: {
    backgroundColor: Colors.SILVER_LIGHT,
    height: 10,
    marginTop: 3
  },
  orderStatusPhd: {
    flex: 1,
    backgroundColor: Colors.SILVER_LIGHT,
    height: 10
  },
  productListPhd: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  productItemPhd: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  productImagePhd: {
    width: 100,
    height: 130,
    borderRadius: 4,
    borderColor: Colors.GRAYS,
    borderWidth: 1,
    backgroundColor: Colors.SILVER_LIGHT
  },
  productInfoPhd: {
    flexDirection: 'column',
    alignItems: 'stretch',
    marginLeft: 15,
    marginTop: 10,
    flexGrow: 1
  },
  namePhd: {
    width: '100%',
    marginTop: 3,
    height: 10,
    backgroundColor: Colors.SILVER_LIGHT
  },
  orderTotalPhd: {
    position: 'absolute',
    alignItems: 'stretch',
    bottom: 20,
    right: 50,
    width: 180
  },
  shippingStatusPhd: {
    backgroundColor: Colors.SILVER_LIGHT,
    height: 10,
    flexBasis: 50
  },
  totalPhd: {
    backgroundColor: Colors.SILVER_LIGHT,
    marginTop: 3,
    height: 10
  }
});

import React from 'react';
import {
  View,
} from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';
import { SwipeListView } from 'react-native-swipe-list-view';
import Spinner from 'react-native-loading-spinner-overlay';
import { DotIndicator } from 'react-native-indicators';
import NavigationBar from './NavigationBar';
import composeNavigation from '../../helpers/composeNavigation';
import Colors from '../../constants/Colors';
import styles from './styles';
import DeliverAddress from './DeliverAddress';
import MakePayment from './MakePayment';
import CartProductItem from './CartProductItem';
import ComboProductItem from './ComboProductItem';
import Separator from '../../components/Separator';
import WAAlert from '../../../components/WAAlert';
import RowMenu from './RowMenu';
import {
  getCart as getCartAction,
  updateErrors as updateErrorsAction,
  deleteCartItems as deleteCartItemsAction,
} from '../../redux/cart/actions';
import EmptyCart from './EmptyCart';

type Props = {};

function MyCartScreen(props: Props) {
  const {
    navigation,
    getCart,
    cart,
    fetching,
    updating,
    updateErrors,
    errors,
    deleteCartItems
  } = props;
  // useWhyDidYouUpdate('MyCartScreen', props);

  const [loadding, setLoading] = React.useState(true);

  React.useEffect(() => {
    getCart();
  }, []);

  React.useEffect(() => {
    if (!fetching) {
      setLoading(false);
    }
  }, [fetching]);

  const isEmptyCart = () => _.isEmpty(cart) || _.isEmpty(_.get(cart, 'cartItems'));

  const onDeleteCartItem = (cartItem) => {
    deleteCartItems(cartItem.cartItemId);
  };

  const keyExtractor = (item) => `${item.cartItemId}`;

  const renderItem = (rowData) => (rowData.item.comboInfo
    ? (
      <ComboProductItem
        navigation={navigation}
        combo={rowData.item}
      />
    )
    : (
      <CartProductItem
        navigation={navigation}
        cartItem={rowData.item}
      />
    ));

  const renderHiddenItem = (rowData, rowMap) => (
    <RowMenu rowData={rowData} rowMap={rowMap} onDelete={onDeleteCartItem} />
  );

  const renderItemSeparator = () => (
    <Separator height={1} />
  );

  const renderSectionSeparator = () => (
    <Separator height={1} />
  );

  const clearErrors = () => {
    updateErrors(undefined);
  };

  const onRefresh = () => {
    getCart();
  };

  const sections = _.get(cart, 'cartItems') || [];

  return (
    <View style={styles.container}>
      <Spinner
        visible={fetching || updating}
        overlayColor="#00000000"
        customIndicator={<DotIndicator color={Colors.tintColor} size={10} count={3} />}
      />
      {!loadding && (
        <>
          {!isEmptyCart() && <DeliverAddress navigation={navigation} />}
          {isEmptyCart() ? <EmptyCart navigation={navigation} />
            : (
              <SwipeListView
                useSectionList
                sections={sections}
                renderItem={renderItem}
                renderHiddenItem={renderHiddenItem}
                keyExtractor={keyExtractor}
                disableRightSwipe
                leftOpenValue={75}
                rightOpenValue={-110}
                // renderSectionHeader={renderSectionHeader}
                ItemSeparatorComponent={renderItemSeparator}
                SectionSeparatorComponent={renderSectionSeparator}
                onRefresh={onRefresh}
                refreshing={fetching && !isEmptyCart()}
              />
            )}
          {!isEmptyCart() && (
            <>
              <Separator height={1} />
              <MakePayment cart={cart} navigation={navigation} />
            </>
          )}
        </>
      )}
      <WAAlert
        show={!_.isEmpty(errors)}
        title="iSalon"
        question={_.get(_.head(errors), 'message')}
        titleFirst
        yes={clearErrors}
        no={false}
        yesTitle="Đóng"
      />
    </View>
  );
}

export default connect(
  (state) => ({
    cart: state.shopCart.cart,
    loadding: state.shopCart.loadding,
    fetching: state.shopCart.fetching,
    updating: state.shopCart.updating,
    errors: state.shopCart.errors,
  }),
  {
    getCart: getCartAction,
    updateErrors: updateErrorsAction,
    deleteCartItems: deleteCartItemsAction,
  }
)(composeNavigation(NavigationBar)(MyCartScreen));

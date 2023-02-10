import {
  StyleSheet
} from 'react-native';
import Layout from '../../../constants/Layout';
import Colors from '../../../constants/Colors';

export const ITEMS_VISIBLE = 5;
export const w = (Layout.window.width - 50 - (ITEMS_VISIBLE - 1) * 8) / ITEMS_VISIBLE;
export const h = w + 30;

const styles = StyleSheet.create({
  title_container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 15
  },
  title: {
    ...Layout.font.medium,
    fontSize: Layout.sectionFontSize,
    color: Colors.sectionTextColor,
    marginLeft: 25,
  },
  value: {
    ...Layout.font.bold,
    color: Colors.newPriceTextColor,
    marginLeft: 25,
  },
  right_arrow: {
    marginRight: 25,
    width: 8,
    height: 14,
  },
  list_container: {
    paddingTop: 8,
    marginLeft: 17,
    marginRight: 25,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  item_container: {
    width: w,
    height: h,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 8,
  },
  item_cover: {
    width: w,
    height: w,
    borderColor: '#d0d2d3',
    borderWidth: 1,
    borderRadius: w / 2,
    marginTop: 8,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  checkmark: {
    width: 20,
    height: 20,
    position: 'absolute',
    top: 8,
    right: 0,
  },
  item: {
    width: w - 10,
    height: w - 10,
    borderRadius: w / 2,
  },
  item_name: {
    ...Layout.font.normal,
    fontSize: Layout.smallFontSize,
    textAlign: 'center',
    color: Colors.imageCountColor
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: w,
    height: w,
    borderRadius: w / 2,
    marginTop: 8,
    backgroundColor: '#231f20BF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  remain_amount_text: {
    ...Layout.font.bold,
    fontSize: Layout.largeFontSize,
    color: 'white',
  }
});

export default styles;

import {
  StyleSheet,
} from 'react-native';

import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
  },
  list: {
    backgroundColor: 'white',
  },
  overview_container: {
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    paddingTop: 0,
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 180,
    backgroundColor: Colors.backgroundColor,
  },
  cover_container: {
    backgroundColor: 'white',
    width: 120,
    height: 160,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#d0d2d3',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sample_img: {
    width: 100,
    height: 140,
  },
  overview_desc: {
    flexDirection: 'column',
    width: Layout.window.width - 150,
    marginLeft: 10,
  },
  discount_holder: {
    width: 42,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    fontSize: Layout.smallFontSize,
  },
  price_holder: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  old_price: {
    ...Layout.font.medium,
    fontSize: Layout.fontSize,
    color: Colors.oldPriceTextColor,
    textAlign: 'left',
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid'
  },
  new_price: {
    ...Layout.font.bold,
    fontSize: Layout.largeFontSize,
    color: Colors.newPriceTextColor,
    textAlign: 'left',
  },
  selected_variant: {
    ...Layout.font.normal,
    fontSize: Layout.fontSize,
    color: Colors.itemTextColor,
    textAlign: 'left',
  },
  tags_container: {
    flexDirection: 'column',
  },
  variant_group_container: {
    backgroundColor: 'white',
    flexDirection: 'column',
    paddingTop: 10,
  },
  section_title: {
    ...Layout.font.bold,
    color: Colors.itemTextColor,
    paddingLeft: 20,
    paddingRight: 20,
  },
  variant_group_content: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
  },
  capacity_button: {
    width: 60,
    height: 24,
    borderColor: Colors.newPriceTextColor,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
  },
  capacity_text: {
    ...Layout.font.normal,
    fontSize: Layout.smallFontSize,
    color: Colors.newPriceTextColor,
  },
  amount_container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingRight: 20,
    backgroundColor: 'white',
  },
  column_wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
    backgroundColor: 'white',
  },
  empty_list: {
    ...Layout.font.normal,
    fontSize: Layout.largeFontSize,
    color: '#dddddd',
    textAlign: 'center',
    width: Math.min(Layout.window.width - 100, 500),
    marginTop: 20,
    marginBottom: 20,
    alignSelf: 'center',
  },
});

export default styles;

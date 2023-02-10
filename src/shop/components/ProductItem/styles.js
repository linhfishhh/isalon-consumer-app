import {
  StyleSheet,
} from 'react-native';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

const styles = StyleSheet.create({
  brand_name: {
    ...Layout.font.medium,
    fontSize: Layout.smallFontSize,
    color: Colors.brandNameTextColor,
    textAlign: 'left',
  },
  short_desc: {
    ...Layout.font.medium,
    fontSize: Layout.smallFontSize,
    color: Colors.productShortDescTextColor,
    textAlign: 'left',
    marginBottom: 8,
  },
  free_ship: {
    display: 'none',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  free_ship_icon: {
    width: 28,
    height: 13
  },
  free_ship_location: {
    ...Layout.font.normal,
    fontSize: Layout.microFontSize,
    color: '#929497',
    marginLeft: 10
  }
});

export default styles;

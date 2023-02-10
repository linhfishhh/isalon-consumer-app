import React from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Text,
} from 'react-native';
import NavigationBar from './NavigationBar';
import composeNavigation from '../../helpers/composeNavigation';
import { Layout, Colors, CommonStyles } from '../../constants';
import ProductItem from '../../components/ProductItem';
import TextButton from '../../components/TextButton';
import Space from '../../components/Space';

type Props = {
  navigation: Object,
};

function ProductComboScreen({ navigation }: Props) {
  const [products] = React.useState([
    {
      id: 1,
      brand: 'LAKME',
      desc: 'Xịt dưỡng bóng không giữ nếp Lakme K.Style Polish',
      oldPrice: 890,
      newPrice: 780,
      rate: 4.5
    },
    {
      id: 2,
      brand: 'LAKME',
      desc: 'Combo chăm sóc và bảo vệ tóc Lakme',
      oldPrice: 890,
      newPrice: 780,
      rate: 4.5
    },
    {
      id: 3,
      brand: 'LAKME',
      desc: 'Combo chăm sóc và bảo vệ tóc Lakme',
      oldPrice: 890,
      newPrice: 780,
      rate: 4.5
    },
    {
      id: 4,
      brand: 'LAKME',
      desc: 'Xịt dưỡng bóng không giữ nếp Lakme K.Style Polish',
      oldPrice: 890,
      newPrice: 780,
      rate: 4.5
    },
    {
      id: 5,
      brand: 'LAKME',
      desc: 'Combo chăm sóc và bảo vệ tóc Lakme',
      oldPrice: 890,
      newPrice: 780,
      rate: 4.5
    },
    {
      id: 6,
      brand: 'LAKME',
      desc: 'Combo chăm sóc và bảo vệ tóc Lakme',
      oldPrice: 890,
      newPrice: 780,
      rate: 4.5
    },
  ]);

  const keyExtractor = (item, index) => item + index;

  const renderProductItem = ({ item }) => (
    <ProductItem
      product={item}
      style={styles.product_item_style}
      horizontal={false}
      navigation={navigation}
    />
  );

  const openComboDetail = () => {
    const htmlContent = `<h2>What is Lorem Ipsum?</h2>
<p><strong>Lorem Ipsum</strong> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
</div><div>
<h2>Why do we use it?</h2>
<p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>
</div><br /><div>
<h2>Where does it come from?</h2>
<p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.</p><p>The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.</p>
</div><div>
<h2>Where can I get some?</h2>
<p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.</p>`;
    navigation.navigate('HtmlViewScreen', { title: 'Chi tiết Mua 5 sản phẩm được khuyến mãi 15% cho toàn bộ nhãn hàng Lakme', content: htmlContent });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header_container}>
        <Text style={styles.info_text} numberOfLines={2}>
          Mua 5 sản phẩm được khuyến mãi 15% cho toàn bộ nhãn hàng Lakme
        </Text>
        <Space />
        <TextButton
          title="Chi tiết"
          style={styles.detail_button}
          titleStyle={styles.detail_button_title}
          onPress={openComboDetail}
        />
      </View>
      <FlatList
        style={styles.list}
        data={products}
        keyExtractor={keyExtractor}
        renderItem={renderProductItem}
        showsHorizontalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={styles.column_wrapper}
      />
    </View>
  );
}

const maxScreenWidth = Layout.window.width > 700 ? 700 : Layout.window.width;

const w = maxScreenWidth / 2 - 25;
const h = ((w * 4) / 3) + 70;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    flexDirection: 'column'
  },
  list: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  header_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 44,
    backgroundColor: 'white',
    ...CommonStyles.navigation_shadow
  },
  section_title: {
    alignSelf: 'flex-start',
  },
  column_wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 4,
  },
  product_item_style: {
    width: w,
    height: h,
    marginLeft: 0,
  },
  info_text: {
    ...Layout.font.normal,
    fontSize: Layout.smallFontSize,
    color: Colors.itemTextColor,
    marginLeft: 25,
    width: Layout.window.width - 100,
  },
  detail_button: {
    marginLeft: 8,
    marginRight: 20,
  },
  detail_button_title: {
    ...Layout.font.normal,
    fontSize: Layout.smallFontSize,
    color: Colors.tintColor,
  }
});

export default composeNavigation(NavigationBar)(ProductComboScreen);

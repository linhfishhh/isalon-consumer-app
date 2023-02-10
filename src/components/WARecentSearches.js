import React, { PureComponent } from 'react';
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import CardView from 'react-native-cardview'

export default class WARecentSearches extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
  
    };
  }

  renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        hitSlop={{ top: 0, bottom: 3, left: 3, right: 3 }}
        onPress={() => { this._goToSalon(item.salon_id); }}>
        <CardView
          style={Styles.cardView}
          cardElevation={7}
          cardMaxElevation={10}
          cornerRadius={7}>
          <Image style={Styles.cat} source={{ uri: item.image }} />
          <Text numberOfLines={1} style={Styles.tileCard}>{item.name}</Text>
        </CardView>
      </TouchableOpacity>
    )
  }

  _keyExtractor = (item, index) => {
    return item.id + '';
  };

  _goToSalon = (salonId) => {
    this.props.navigation.navigate('home_salon', { id: salonId })
  };

  render() {
    return (
      (this.props.listRecent === undefined || this.props.listRecent.length == 0) ?
        <View></View>
        :
        <View style={Styles.content}>
          <Text style={Styles.title}>Tìm kiếm gần đây</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            style={Styles.container}
            data={this.props.listRecent}
            renderItem={this.renderItem}
            keyExtractor={this._keyExtractor}
          />
        </View>
    );
  }
}
const Styles = StyleSheet.create({
  content: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  cardView: {
    flex: 1,
    flexDirection: 'column',
    marginRight: 20,
    width : 130,
    marginTop: 5,
    marginBottom: 10
  },
  tileCard: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 14,
    marginTop: 5,
    color: Colors.TEXT_DARK,
    justifyContent: 'center',
    alignItems : 'center',
    textAlign : 'center',
    marginLeft : 5,
    marginRight : 5,
    marginBottom: 20,
  },
  container: {
    marginTop: 10,
    flex: 1,
  },
  title: {
    fontFamily: GlobalStyles.FONT_NAME,
    color: Colors.TEXT_DARK,
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: 16,
    paddingLeft: 0,
    paddingTop: 5,
  },
  cat: {
    borderTopLeftRadius: 5,
    width: 130,
    height: 100,
    // resizeMode: 'cover',
  }
})
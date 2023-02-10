import React, { Component } from 'react';
import {
  Text,
  TouchableOpacity,
  Image,
  View,
  StyleSheet,
  ImageBackground,
  Keyboard, FlatList, ScrollView
} from 'react-native';
import PropTypes from 'prop-types';
import Colors from "../../styles/Colors";
import Icon from 'react-native-vector-icons/FontAwesome'
import GlobalStyles from "../../styles/GlobalStyles";
import { connect } from 'react-redux';
import numeral from 'numeral';
import { PulseIndicator } from "react-native-indicators";
import { getRecentSearch, addRecentSearch } from "../../redux/recent/actions";
import { NoSalons } from '../../components/WASearchTabResult';

class SearchHintResult extends Component<Props> {
  static defaultProps = {
    show: false,
    keyboardHeight: 0
  };
  static propTypes = {
    show: PropTypes.bool,
    keyboardHeight: PropTypes.number
  };
  constructor(props) {
    super(props);
    this.state = {
    };
  };

  _renderItemCat = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this._onCatPress(item);
        }}
        style={Styles.cat}>
        <ImageBackground
          source={{
            uri: item.cover
          }}
          style={Styles.catImage}
        />
        <Text
          style={Styles.catText}
        >{item.name}</Text>
      </TouchableOpacity>
    );
  };

  _keyExtractorCat = (item, index) => {
    return item.id + '';
  };

  _renderItemService = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.onNavigation();
          this.props.navigation.navigate('home_service', {
            id: item.id
          })
        }}
        style={Styles.service}>
        <View style={Styles.serviceTop}>
          <Text style={Styles.serviceName} numberOfLines={1} ellipsizeMode={'tail'}>{item.name}</Text>
          <Text style={Styles.serviceSalonName} numberOfLines={1} ellipsizeMode={'tail'}>{item.salon.name}</Text>
        </View>
        <View style={Styles.serviceBottom}>
          <Text style={Styles.servicePrice}>
            {
              item.ranged ? 'Từ ' : ''
            }
            {numeral(item.price_from).format('0,0') + 'đ'}
          </Text>
          <Text style={Styles.serviceSalonMeta}>
            {item.salon.location_name + ' - ' + numeral(item.salon.distance / 1000).format('0.0')} Km
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  _keyExtractorService = (item, index) => {
    return item.id + '';
  };

  _renderItemSalon = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.onNavigation();
          this.props.addRecentSearch(item.id)
          this.props.navigation.navigate('home_salon', {
            id: item.id
          })
        }}
        style={Styles.service}>
        <View style={Styles.serviceTop}>
          <Text style={[Styles.salonName]} numberOfLines={1} ellipsizeMode={'tail'}>{item.name}</Text>
          <Text style={[Styles.salonRating, { color: 'green' }]}>{numeral(item.rating).format('0.0')}</Text>
        </View>
        <View style={Styles.serviceBottom}>
          <Text style={Styles.servicePrice}>
            Từ {numeral(item.price_from).format('0,0') + 'đ'}
          </Text>
          <Text style={Styles.serviceSalonMeta}>
            {item.location_name + ' - ' + numeral(item.distance / 1000).format('0.0')} Km
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  _keyExtractorSalon = (item, index) => {
    return item.id + '';
  };

  _onCatPress = (cat) => {
    this.props.onApplyCatFilter(cat.id);
  };

  render() {
    if (!this.props.show) {
      return null;
    }

    const hasResult = this.props.search_hint.cats.length > 0 || this.props.search_hint.services.length > 0 || this.props.search_hint.salons.length > 0;

    return (
      <View
        keyboardShouldPersistTaps={'always'}
        style={[Styles.container, { bottom: this.props.keyboardHeight }]}>
        {
          this.props.search_hint.fetching ?
            <PulseIndicator color={Colors.PRIMARY} size={40} />
            :
            <ScrollView
              keyboardShouldPersistTaps={'always'}
            >
              {hasResult ? null : <NoSalons />}
              {
                this.props.search_hint.cats.length > 0 ?
                  <View>
                    <View style={Styles.header}>
                      <Text style={Styles.headerText}>Danh mục</Text>
                    </View>
                    <View style={Styles.cats}>
                      <FlatList
                        keyboardShouldPersistTaps={'always'}
                        style={Styles.catList}
                        horizontal={true}
                        data={this.props.search_hint.cats}
                        //extraData={this.props.search_hint}
                        keyExtractor={this._keyExtractorCat}
                        renderItem={this._renderItemCat}
                      />
                    </View>
                  </View>
                  : undefined
              }
              {
                this.props.search_hint.services.length > 0 ?
                  <View>
                    <View style={Styles.header}>
                      <Text style={Styles.headerText}>Dịch vụ tại salon</Text>
                    </View>
                    <View style={Styles.services}>
                      <FlatList
                        keyboardShouldPersistTaps={'always'}
                        style={Styles.serviceList}
                        data={this.props.search_hint.services}
                        //extraData={this.props.search_hint}
                        keyExtractor={this._keyExtractorService}
                        renderItem={this._renderItemService}
                      />
                    </View>
                  </View>
                  : undefined
              }
              {
                this.props.search_hint.salons.length > 0 ?
                  <View>
                    <View style={Styles.header}>
                      <Text style={Styles.headerText}>Salon gợi ý</Text>
                    </View>
                    <View style={Styles.salons}>
                      <FlatList
                        keyboardShouldPersistTaps={'always'}
                        style={Styles.serviceList}
                        data={this.props.search_hint.salons}
                        //extraData={this.props.search_hint}
                        keyExtractor={this._keyExtractorSalon}
                        renderItem={this._renderItemSalon}
                      />
                    </View>
                  </View>
                  : undefined
              }
            </ScrollView>
        }
      </View>
    );
  };
}

export default connect(
  state => {
    return {
      search_hint: state.search_hint,

    }
  },
  {
    addRecentSearch,
  }
)(SearchHintResult);

const Styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 60,
    zIndex: 100,
    backgroundColor: 'white'
  },
  header: {
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: Colors.SILVER_LIGHT
  },
  headerText: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 13,
    color: Colors.TEXT_DARK
  },
  cats: {
    backgroundColor: 'white',
    height: 40
  },
  cat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10
  },
  catImage: {
    height: 26,
    width: 26,
    backgroundColor: Colors.SILVER_LIGHT,
    borderRadius: 13,
    marginRight: 5
  },
  catText: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 12,
    color: Colors.TEXT_DARK
  },
  services: {
    //maxHeight: 125,
    //flex: 1
  },
  service: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    borderBottomColor: Colors.SILVER_LIGHT,
    borderBottomWidth: 1
  },
  serviceTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2
  },
  serviceName: {
    flex: 1,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 12,
    color: Colors.TEXT_DARK,
  },
  salonName: {
    flex: 1,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 12,
    color: Colors.TEXT_DARK,
  },
  serviceSalonName: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 12,
    color: Colors.TEXT_DARK,
    //fontWeight: 'bold',
    flex: 1,
    textAlign: 'right'
  },
  salonRating: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5
  },
  salons: {
    //maxHeight: 125,
    //flex: 1
  },
  serviceBottom: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  servicePrice: {
    flex: 1,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
  },
  serviceSalonMeta: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 11,
    color: Colors.SILVER_DARK,
  },
  serviceList: {
    flex: 1,
  }
});

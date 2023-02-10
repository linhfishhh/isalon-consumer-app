import React, {PureComponent} from 'react';
import {FlatList, ImageBackground, StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native';
import Colors from "../styles/Colors";
import Icon from 'react-native-vector-icons/MaterialIcons'
import GlobalStyles from "../styles/GlobalStyles";
import DotIndicator from "react-native-indicators/src/components/dot-indicator";
import numeral from 'numeral';
import { debounce } from 'lodash';
import {BallIndicator, MaterialIndicator, PulseIndicator} from "react-native-indicators";

//Progress bar 
class LoadingMoreIndicator extends PureComponent{
  render(){
    return (
      this.props.show?
        <View style={Styles.loadingZone}>
          <PulseIndicator color={Colors.PRIMARY} size={40}/>
        </View>
        :<View/>
    );
  }
}

//Mới mhất - Search 
export default class WASearchTabResult extends PureComponent<Props> {
  constructor(props) {
    super(props);
    //this._loadMore = debounce(this._loadMore, 500);
    this.state = {
      //items: items
    };
  };

  _keyExtractor = (item, index) => {
    return index + '';
  };

  _renderItem = ({item}) => {
    return (
      <Salon navigation={this.props.navigation} data={item}/>
    );
  };

  _loadMore = () => {
    if(!this.props.mutiple_page){
      return;
    }
    if(this.props.data.loading || this.props.data.loading_more){
      return;
    }
    if(this.props.onLoadMore){
      this.props.onLoadMore();
    }
  };

  _extendRadius = () => {
    this.props.extendRadiusAction();
  };

  _renderFooter = () => {
    if(this.props.forMap){
      return (
        this.props.showExtendRadiusAction?
          <View style={Styles.extendRadius}>
            <Text style={Styles.extendRadiusQuestion}>Bạn muốn mở rộng bán kính tìm kiếm để xem thêm nhiều salon hơn không?</Text>
            <TouchableOpacity
              onPress={this._extendRadius}
              style={Styles.extendRadiusBtn}>
              <Text style={Styles.extendRadiusBtnText}>Mở rộng</Text>
            </TouchableOpacity>
          </View>
          :<View/>
      )
    }else {
      return <LoadingMoreIndicator show={!this.props.data.result.is_last_page}/>
    }
  };

  render() {
    return (
      this.props.data.loading ?
        <DotIndicator count={3} size={10} color={Colors.PRIMARY}/>
        :
        <View style={{flex: 1}}>
        <FlatList
          ListEmptyComponent={<NoSalons/>}
          onEndReached={this._loadMore}
          onEndReachedThreshold={0.5}
          data={this.props.data.result.items}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          ListFooterComponent={this._renderFooter()}
        />
        </View>
    );
  };
}

//FlatList - Nếu 0 phần tử --> render layout này
export class NoSalons extends PureComponent{
    render(){
        return (
          <View style={Styles.noSalon}>
            <Icon style={Styles.noSalonIcon} name={'sentiment-dissatisfied'}/>
            <Text style={Styles.noSalonTitle}>Không tìm thấy kết quả</Text>
            <Text style={Styles.noSalonText}>Rất tiếc, chúng tôi không tìm thấy salon nào tương ứng với yêu cầu của bạn.</Text>
          </View>
        );
    }
}

//FlatList - Có phần tử --> Class cell render Item 
export class Salon extends PureComponent {
  render() {
    let item = this.props.data;
    let distance = this.props.data.distance;
    let distance_text = '';
    if(distance>0){
      if(distance<1000){
        distance_text = Math.floor(distance) + 'm';
      }
      else{
        distance_text = numeral(distance/1000.0).format('0,000.0')+'Km';
      }
    }
    return (
      <View style={Styles.item}>
        <View style={Styles.itemMain}>
          {
            item.verified ?
              <View style={Styles.itemVerified}>
                <Icon style={Styles.itemVerifiedItem} name={'check'}/>
              </View>
              : undefined
          }
          <TouchableOpacity
            onPress={()=>{
              this.props.navigation.navigate('home_salon', {
                id: item.id
              })
            }}
            style={Styles.itemLeft}>
            <ImageBackground source={{uri: item.cover}} style={Styles.itemImage}/>
          </TouchableOpacity>

          <View style={Styles.itemRight}>
            <TouchableOpacity
              onPress={()=>{
                this.props.navigation.navigate('home_salon', {
                  id: item.id
                })
              }}
              hitSlop={{top: 10, bottom: 10, left: 0, right: 0}} style={Styles.itemLine}>
              <Text style={Styles.itemName} numberOfLines={1}>{item.name}</Text>
              <Text style={Styles.itemRating}>{numeral(item.rating).format('0.0')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={()=>{
                Alert.alert('iSalon', item.address);
              }}
              hitSlop={{top: 5, bottom: 5, left: 0, right: 0}} style={Styles.itemAddress}>
              <Icon style={Styles.itemAddressIcon} name={'place'}/>
              <Text style={Styles.itemAddressText} numberOfLines={1}>{item.address}</Text>
            </TouchableOpacity>

            <View style={Styles.itemLast}>
              <View style={Styles.itemLastLeft}>
                <View style={Styles.itemPrice}>
                  <Icon style={Styles.itemPriceIcon} name={'monetization-on'}/>
                  <Text
                    style={Styles.itemPriceText}>Từ {numeral(Math.round(item.price_from / 1000) * 1000).format('0,000')}đ</Text>
                </View>
                {
                  item.sale_off_up_to?
                    <View style={Styles.itemSale}>
                      <Icon style={[Styles.itemPriceIcon, Styles.itemPriceIconSale]}
                            name={'new-releases'}/>
                      <Text style={[Styles.itemPriceText, Styles.itemPriceTextSale]}>Giảm
                        đến {item.sale_off_up_to}%</Text>
                    </View>
                    :undefined
                }
              </View>
              <View style={Styles.itemLastRight}>
                <View style={[Styles.itemPrice, Styles.itemPriceRight]}>
                  <Icon style={[Styles.itemPriceIcon, Styles.itemPriceIconRight]} name={'comment'}/>
                  <Text
                    style={[Styles.itemPriceText, Styles.itemPriceTextRight]}>{item.rating_count}</Text>
                </View>
                <View style={[Styles.itemPrice, Styles.itemPriceRight]}>
                  <Icon style={[Styles.itemPriceIcon, Styles.itemPriceIconRight]} name={'near-me'}/>
                  <Text
                    style={[Styles.itemPriceText, Styles.itemPriceTextRight]}>
                    {
                      distance_text ? distance_text : '???'
                    }
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <SalonService navigation={this.props.navigation} items={item.services}/>
      </View>
    );
  }
}

export class SalonService extends PureComponent {
  constructor(props) {
    super(props);
  }

  _keyExtractor = (item, index) => {
    return index + '';
  };

  _renderItem = ({item}) => {
    let service = item;
    return (
      <TouchableOpacity
        onPress={()=>{
          this.props.navigation.navigate("home_service", {
            id: item.id
          });
        }}
        style={[Styles.itemService, {backgroundColor: item.color}]}>
        <Text style={[Styles.itemServiceName, {color: item.text_color}]}>{service.name} . </Text>
        <View style={Styles.itemServicePrice}>
          <Text style={[Styles.itemServicePriceText, {color: item.text_color}]}>
            {
              service.final_price_to !== service.final_price_from?
                'Từ '
                :''
            }
            {numeral(service.final_price_from).format('0,000')}đ
            {service.sale_off_up_to ? ' (-' + service.sale_off_up_to + '%)' : ''}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <FlatList
        showsHorizontalScrollIndicator={false}
        style={Styles.services}
        horizontal={true}
        data={this.props.items}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
      />)
  }
}

const Styles = StyleSheet.create({
  loadingZone: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  item: {
    padding: 10,
    borderBottomColor: Colors.SILVER_LIGHT,
    borderBottomWidth: 1,
  },
  itemMain: {
    flexDirection: 'row',
  },
  itemRight: {
    flex: 1
  },
  itemImage: {
    height: 60,
    width: 80,
    backgroundColor: Colors.SILVER_LIGHT,
    marginRight: 10,
  },
  itemName: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 14,
    //fontWeight: 'bold',
    color: Colors.TEXT_DARK,
    flex: 1,
    marginBottom: 8
  },
  itemLine: {
    flexDirection: 'row',
    //alignItems: 'center'
  },
  itemRating: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 14,
    color: '#3ab02e',
    fontWeight: 'bold'
  },
  itemAddress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  itemAddressText: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 12,
    //fontWeight: '200',
    color: Colors.SILVER_DARK,
    flex: 1
  },
  itemAddressIcon: {
    color: Colors.SILVER_DARK,
  },
  itemLast: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemLastLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemLastRight: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10
  },
  itemSale: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemPriceIcon: {
    fontSize: 14,
    color: Colors.PRIMARY,
    marginRight: 2
  },
  itemPriceText: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 12,
    //fontWeight: '200',
    color: Colors.PRIMARY,
  },
  itemPriceRight: {
    marginRight: 0,
    marginLeft: 5,
  },
  itemPriceIconRight: {
    color: Colors.SILVER_DARK,
    //fontSize: 12
  },
  itemPriceTextRight: {
    color: Colors.SILVER_DARK,
    //fontSize: 10
  },
  itemOpen: {
    position: 'absolute',
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#3ab02e',
    borderWidth: 2,
    borderColor: Colors.LIGHT,
    left: -2,
    top: -2
  },
  itemVerified: {
    position: 'absolute',
    height: 14,
    width: 14,
    borderRadius: 7,
    backgroundColor: '#3ab02e',
    borderWidth: 1,
    borderColor: Colors.LIGHT,
    left: -3,
    top: -3,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1
  },
  itemVerifiedItem: {
    fontSize: 12,
    color: Colors.LIGHT
  },
  services: {
    marginTop: 10,
  },
  itemService: {
    flexDirection: 'row',
    height: 20,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: Colors.SILVER_LIGHT,
    borderRadius: 10,
    marginRight: 5,
    alignItems: 'center'
  },
  itemServiceName: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 12,
    color: Colors.TEXT_LINK,
  },
  itemServicePrice: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemServicePriceText: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 12,
    color: Colors.TEXT_LINK,
  },
  itemServicePriceOldText: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 12,
  },
  noSalon: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
    paddingLeft: 50,
    paddingRight: 50
  },
  noSalonIcon: {
    fontSize: 50,
    color: Colors.SILVER_LIGHT
  },
  noSalonTitle: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 14,
    color: Colors.PRIMARY,
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  noSalonText: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 12,
    color: Colors.SILVER_DARK,
    textAlign: 'center',
    width: 300
  },
  extendRadius: {
    backgroundColor: Colors.PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    padding: 10
  },
  extendRadiusQuestion: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 12,
    color: Colors.LIGHT,
    flex: 1
  },
  extendRadiusBtn: {
    marginLeft: 15,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: Colors.LIGHT,
    borderRadius: 3,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 12,
    color: Colors.PRIMARY,
  }
});

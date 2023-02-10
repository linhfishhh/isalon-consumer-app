import React, { Component, PureComponent } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class WAServices extends Component<Props> {
  static defaultProps = {
    cats: undefined,
    search: undefined,
    action: undefined,
  };

  constructor(props) {
    super(props);
    this.state = {

    };
  };

  componentWillMount = () => {
    this.setState({
    })
  }

  render() {
    return (
      <View>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Text style={Styles.title}>Danh Sách Dịch Vụ</Text>
          <Text >Xem tất cả</Text>
        </View>

        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}>
          {
            this.props.cats.map((cat, index) => {
              let active = this.props.search.filters.cat.indexOf(cat.id) > -1;
              return (
                <TouchableOpacity
                  hitSlop={{ top: 15, bottom: 15, left: 5, right: 5 }}
                  onPress={() => {
                    // this.props.action
                  }}
                  style={Styles.cat} key={index}>

                  {
                    active ?
                      <View style={Styles.catIcon}>
                        <Icon style={Styles.catIconText} name={'check'} />
                      </View>
                      : undefined
                  }
                  <Image source={{ uri: cat.cover }} style={Styles.catImage} />
                  <Text style={[Styles.catName, active && Styles.catNameActive]}>{cat.name.toUpperCase()}</Text>
                </TouchableOpacity>
              );
            })
          }
        </ScrollView>
      </View>
    );
  }
}

const Styles = StyleSheet.create({
  title: {
    fontSize: 14,
    fontFamily: GlobalStyles.FONT_NAME,
    color: 'black',
    marginLeft: 20,
    fontWeight: 'bold'
  },
  titleAll: {
    fontSize: 13,
    fontFamily: GlobalStyles.FONT_NAME,
    color: 'red',
  },
  catIcon: {
    position: 'absolute',
    left: 40,
    top: 10,
    zIndex: 1,
    backgroundColor: Colors.DARK,
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7
  },
  cat: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: 70,
    flexDirection: 'column',
    backgroundColor: Colors.LIGHT,
    //borderColor: Colors.SILVER_LIGHT,
    // borderWidth: 1,
    borderRadius: 2,
    paddingTop: 10,
    paddingBottom: 10
  },
  catIconText: {
    fontSize: 8,
    color: Colors.LIGHT
  },
  catImage: {
    width: 40,
    height: 40,
    // borderRadius: 25,
    resizeMode: 'cover',
    // marginRight: 10
  },
  catName: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 8,
    color: Colors.TEXT_DARK,
    textAlign: 'center',
  },
  catNameActive: {
    color: Colors.PRIMARY
  },
});

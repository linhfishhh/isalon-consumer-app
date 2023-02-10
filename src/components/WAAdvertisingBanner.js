import React, { PureComponent } from 'react';
import Carousel from 'react-native-banner-carousel';
import {
    Text, TouchableOpacity,
    StyleSheet, Image, View, Dimensions
} from 'react-native';
import Colors from "../styles/Colors";
import parse from 'url-parse';
import _ from 'lodash';

const BannerWidth = Dimensions.get('window').width;
const BannerHeight = 130;

class BannerPage extends React.PureComponent {
    onClick = () =>{
        // get param on link
        const link = this.props.item.link;
        if (link) {
            // parse
            const parsed = parse(link, true);
            const query = _.get(parsed, 'query');
            if (query) {
                const cat = query['cat[]'];
                if (cat) {
                    this.props.navigation.push("member_salon_search", {
                        selectedCategory: cat
                    });
                }
            }
        }
    }

    render() {
        return (
            <TouchableOpacity onPress={this.onClick}>
                {
                    (this.props.value === 1) ?
                        <Image style={{ width: BannerWidth, height: BannerHeight, resizeMode: 'cover' }} source={{ uri: this.props.item.image }} />
                        :
                        <Image style={{ width: BannerWidth, height: BannerHeight, resizeMode: 'contain' }} source={{ uri: this.props.item.image }} />
                }
            </TouchableOpacity>
        );
    }
}

export default class WAAdvertisingBanner extends PureComponent {
    static defaultProps = {
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

    renderPage(item, index) {
        return (
            <BannerPage
                value={this.props.value}
                item={item}
                key={index}
                navigation={this.props.navigation}
            />
        );
    }

    render() {
        return (
            <View style={Styles.container}>
                <Carousel
                    autoplay
                    autoplayTimeout={5000}
                    loop
                    index={0}
                    pageSize={BannerWidth}
                >
                    {this.props.listBanners.map((item, index) => this.renderPage(item, index))}
                </Carousel>
            </View>
        );
    }
}

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center'
    },
});

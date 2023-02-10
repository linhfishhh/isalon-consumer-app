import React, {Component} from 'react';
import {
    Alert,
    ScrollView,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList,
    ImageBackground
} from 'react-native';
import PageContainer from "../components/PageContainer";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import WAButton from "../components/WAButton";
import WALoading from "../components/WALoading";
import NewUserFormStyles from "../styles/NewUserFormStyles";
import {connect} from 'react-redux';
import Utils from '../configs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {DotIndicator} from 'react-native-indicators';
import Svg, {Circle, G, Polygon} from "react-native-svg";
import numeral from 'numeral';
import WAStars from "../components/WAStars";
import WALightBox from "../components/WALightBox";
import BallIndicator from "react-native-indicators/src/components/ball-indicator";

type Props = {};
class SalonReviewScreen extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            fetching: false,
            showLightBox: false,
            lightBoxItems: [],
            id: this.props.navigation.getParam('id'),
            data: {
                likeCount: 30,
                orderCount: 15,
                rating: 4.5,
                goodRatingThisWeek: 10,
                ratingCount: 100,
                ratingDetails: [
                    0,
                    15,
                    30,
                    50,
                    5
                ],
                items: [],
                isLast: false,
                total: 0,
                next: 1
            },
        }
    }

    _showLightBox = (items) => {
        this.setState({
            showLightBox: true,
            lightBoxItems: items
        });
    };

    _loadData = async(start = true) => {
        if(this.state.fetching){
            return;
        }
        if(this.state.data.isLast){
            return;
        }
        this.setState({
            loading: start,
            fetching: true,
        });
        try {
            let rq = await Utils.getAxios(this.props.account.token).post('salon/'+this.state.id+'/reviews/alt', {
                page: this.state.data.next
            });
            let data = rq.data;
            this.setState({
                data: {
                    ...data,
                    items: this.state.data.items.concat(data.items),
                },
                loading: false,
                fetching: false,
            });
        }
        catch (e) {
            this.setState({
                loading: false,
                fetching: false,
            });
        }
    };

    componentDidMount(){
        this._loadData();
    }

    _renderStarBar = (star, current, total) => {
        let stars = [];
        for(let i =1; i<=star; i++){
            stars.push(
               <Icon key={'star'+i} style={Styles.starBarStar} name={'star'} />
            )
        }
        return <View style={Styles.starBar} key={'star-'+star}>
            <View style={Styles.starBarStars}>
                {stars}
            </View>
            <View style={Styles.starBarProgress}>
                <View style={[Styles.starBarProgressCurrent, {width: (current*100/total)+'%'}]}>

                </View>
            </View>
        </View>
    };

    _renderReview = ({item}) => {
        return (
            <View style={Styles.item}>
                <View style={Styles.itemTop}>
                    <Text style={Styles.itemTitle}>
                        "{item.title}"
                    </Text>
                    <Text numberOfLines={1} style={Styles.itemAuthor}>
                        {item.name}
                    </Text>
                </View>
                <View style={Styles.itemSecond}>
                    <View style={Styles.itemRating}>
                        <WAStars set={'3'} rating={item.rating}/>
                    </View>
                    <Text style={Styles.itemDate}>
                        {item.date}
                    </Text>
                </View>
                <Text style={Styles.itemContent}>
                    {item.content}
                </Text>
                {
                    item.images.length>0?
                        <TouchableOpacity
                            onPress={()=>{
                                this._showLightBox( item.images.map((slide) => {
                                    return {
                                        url: slide.image,
                                        freeHeight: true
                                    }
                                }));
                            }}
                            style={Styles.images}>
                            {
                                item.images.map((image, iIndex) => {
                                    return (
                                        <ImageBackground style={[Styles.image, item.images.length === 1?Styles.image1:item.images.length===2?Styles.image2:Styles.image3]} key={'review-image'+iIndex}
                                                         source={{uri: image.thumb}}
                                        />
                                    );
                                })
                            }
                        </TouchableOpacity>
                        :undefined
                }
            </View>
        );
    };

    render() {
        return (
            <PageContainer
                darkTheme={true}
                contentWrapperStyle={[GlobalStyles.pageWrapper, NewUserFormStyles.pageWrapper, {paddingLeft: 0, paddingRight: 0}]}
                navigation={this.props.navigation}
                backgroundColor={Colors.LIGHT}
                layoutPadding={20}
                headerTitle={'Nhận xét đánh giá'}
            >
                {
                    this.state.loading?
                        <DotIndicator size={10} color={Colors.PRIMARY} count={3}/>
                        :
                        <ScrollView style={{flex: 1}}>
                            <WALightBox navigation={this.props.navigation} onClose={()=>{this.setState({showLightBox: false})}} show={this.state.showLightBox}
                                        items={this.state.lightBoxItems}    />
                            <View style={{flex: 1}}>
                                <View style={Styles.titleBlock}>
                                    <Svg
                                        width={45}
                                        height={75}
                                    >
                                        <G>
                                            <Polygon points="22.4 0 0 0 0 17.42 22.4 34.84 44.8 17.42 44.8 0 22.4 0" fill="#d1b369"/>
                                            <Circle cx="22.4" cy="57.24" r="15.55" fill="#d1b369"/>
                                        </G>
                                    </Svg>
                                    <Text style={Styles.titleBlockText}>
                                        Salon nhận được {this.state.data.goodRatingThisWeek} đánh giá tích cực tuần này
                                    </Text>
                                </View>
                                <View style={Styles.headBlock}>
                                    <View style={Styles.headBlockTop}>
                                        <View style={Styles.headBlockTopLeft}>
                                            <View style={Styles.rating}>
                                                <Text style={Styles.ratingNumber}>{this.state.data.rating}</Text>
                                                <Text style={Styles.ratingLimit}>/5</Text>
                                            </View>
                                        </View>
                                        <View style={Styles.headBlockTopRight}>
                                            {
                                                this.state.data.ratingDetails.map((item, index) => {
                                                    return this._renderStarBar(5 - index, item, this.state.data.ratingCount);
                                                })
                                            }
                                        </View>
                                    </View>
                                    <View style={Styles.headBlockBottom}>
                                        <View style={Styles.headBlockBottomLeft}>
                                            <Text style={Styles.headBlockBottomText}>
                                                Có {this.state.data.ratingCount} đánh giá
                                            </Text>
                                        </View>
                                        <View style={Styles.headBlockBottomCenter}>
                                            <Text style={Styles.headBlockBottomText}>{this.state.data.likeCount} lượt thích</Text>
                                        </View>
                                        <View style={Styles.headBlockBottomRight}>
                                            <Text style={Styles.headBlockBottomText}>{this.state.data.orderCount} đơn hàng</Text>
                                        </View>
                                    </View>
                                </View>
                                {
                                    this.state.data.items.length>0?
                                    <FlatList
                                        style={Styles.items}
                                        data={this.state.data.items}
                                        keyExtractor={(item, index) => {return 'item'+index}}
                                        renderItem={this._renderReview}
                                        extraData={this.state}
                                        ListFooterComponent={
                                            <View style={Styles.reviewsBottom}>
                                                {
                                                    !this.state.data.isLast?
                                                        !this.state.fetching?
                                                            <TouchableOpacity
                                                                onPress={()=>{this._loadData(false)}}
                                                                style={Styles.loadMoreReviews}>
                                                                <Text style={Styles.loadMoreReviewsText}>Xem nhiều hơn</Text>
                                                            </TouchableOpacity>
                                                            :<BallIndicator size={50} color={Colors.PRIMARY}/>
                                                        :undefined
                                                }
                                            </View>
                                        }
                                    />
                                    :undefined
                                }
                            </View>
                        </ScrollView>
                }
            </PageContainer>
        )
    }
}

export default connect(
    state => {
        return {
            account: state.account
        }
    },
    {
    }
)(SalonReviewScreen);

const Styles = StyleSheet.create({
    rating: {
        flexDirection: 'row',
        //alignItems: 'flex-end'
    },
    ratingNumber: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 60,
        color: Colors.TEXT_DARK,
        fontWeight: 'bold'
    },
    ratingLimit: {
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.SILVER_DARK,
        fontSize: 25,
        marginTop: 30,
        marginLeft: 5
    },

    headBlock: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 20,
        paddingBottom: 20,
        borderTopColor: Colors.SILVER_LIGHT,
        borderTopWidth: 1,
    },
    headBlockTop: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    headBlockTopRight: {
        marginLeft: 5,
        flex: 1
    },
    starBar: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    starBarStars: {
        flexDirection: 'row',
        width: 60,
        justifyContent: 'flex-end',
        marginRight: 5,
    },
    starBarStar: {
        fontSize: 10,
        marginTop: 1,
        marginBottom: 1,
        color: '#26AAA5'
    },
    starBarProgress: {
      backgroundColor: Colors.SILVER_LIGHT,
        flex: 1,
        height: 5
    },
    starBarProgressCurrent: {
        height: 5,
        backgroundColor: '#26AAA5',
    },
    headBlockBottom: {
        flexDirection: 'row',
        marginTop: 15
    },
    headBlockBottomLeft: {
        flex: 1,
    },
    headBlockBottomCenter: {
        flex: 1,
        alignItems: 'center'
    },
    headBlockBottomRight: {
        flex: 1,
        alignItems: 'flex-end'
    },
    headBlockBottomText: {
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.SILVER_DARK,
        fontSize: 12,
    },
    titleBlock: {
        padding: 20,
        borderTopColor: Colors.SILVER_LIGHT,
        borderTopWidth: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    titleBlockText: {
        flex: 1,
        marginLeft: 30,
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.TEXT_DARK,
        fontSize: 18,
        fontWeight: 'bold'
    },
    items: {
        paddingLeft: 20,
        paddingRight: 20
    },
    itemTop: {
      flexDirection: 'row'
    },
    item: {
        backgroundColor: '#F2F2F2',
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 15,
        paddingBottom: 50,
        marginBottom: 15,
        marginTop: 15,
        borderRadius: 5
    },
    itemTitle: {
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.PRIMARY,
        fontSize: 16,
        fontWeight: 'bold'
    },
    itemAuthor: {
        flex: 1,
        textAlign: 'right',
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.TEXT_DARK,
        fontSize: 13,
    },
    itemSecond: {
        marginTop: 15,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center'
    },
    itemDate: {
        flex: 1,
        textAlign: 'right',
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.SILVER_DARK,
        fontSize: 13,
    },
    itemContent: {
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.TEXT_DARK,
        fontSize: 15,
        marginBottom: 10
    },
    images: {
        flexDirection: 'row',
        marginTop: 15
    },
    image: {
        flex: 1,
        height: 65,
        backgroundColor: Colors.SILVER_LIGHT,
        marginRight: 10
    },
    image1: {
        height: 180,
    },
    image2: {
        height: 100
    },
    loadMoreReviews: {
        height: 50,
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: Colors.SILVER_LIGHT,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    loadMoreReviewsText: {
        color: Colors.TEXT_LINK,
        fontSize: 14,
        fontFamily: GlobalStyles.FONT_NAME,
        textAlign: 'center'
    },
    reviewsBottom: {
        marginTop: 0,
        marginBottom: 60
    },
});
import React, {Component, PureComponent} from 'react';
import Colors from "../styles/Colors";
import ImageSources from "../styles/ImageSources";
import {
    StatusBar,
    Text,
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    Alert,
    FlatList,
    Platform, ImageBackground,
    Dimensions
} from 'react-native';
import {BallIndicator} from "react-native-indicators";
import GlobalStyles from "../styles/GlobalStyles";
import WAStars from "./WAStars";
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconFA from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';
import {loadSalonReviews, updateSalonReviewLikes, updateServiceReviewLikes} from "../redux/reviews/actions";
import {likeReview} from "../redux/likes/actions";
import WALightBox from "./WALightBox";
import WAAlert from "./WAAlert";

class IReview extends PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            liked: false,
        }
    }
    render(){
        let item = this.props.data;
        return (
            <View style={Styles.review}>
                <View style={Styles.reviewAvatar}>
                    <Image source={{uri: item.avatar}} style={Styles.reviewAvatarImage}/>
                </View>
                <View style={Styles.reviewBody}>
                    <Text style={Styles.reviewAuthor}>{item.name}</Text>
                    <Text style={Styles.reviewDate}>{item.date}</Text>
                    <View style={Styles.reviewRating}>
                        <View style={Styles.reviewStars} >
                            <WAStars starStyle={Styles.reviewStar} set={'3'} rating={item.rating} />
                        </View>
                        <TouchableOpacity
                            onPress={()=>{
                                if(!this.props.account.token){
                                    this.props.requireLogin();
                                    return false;
                                }
                                this.props.likeReview(item.id, (data) => {
                                    if(this.props.type === 'salon'){
                                        this.props.updateSalonReviewLikes(item.id, data.liked, data.count);
                                    }
                                    else{
                                        this.props.updateServiceReviewLikes(item.id, data.liked, data.count);
                                    }
                                })
                            }}
                            style={Styles.reviewLike}>
                            {
                                item.likes>0?
                                    <View style={Styles.reviewLikeCountWrapper}><Text style={Styles.reviewLikeCount}>{item.likes}</Text></View>
                                    :undefined
                            }
                            <IconFA style={[Styles.reviewLikeIcon, item.liked && Styles.reviewLikeIconLiked]} name={'thumbs-up'}/>
                            <Text style={Styles.reviewLikeText}>Hữu ích</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={Styles.reviewTitle}>{'"'}{item.title}{'"'}</Text>
                    <Text style={Styles.reviewContent}>{item.content}</Text>
                    {
                        item.images.length>0?
                            <TouchableOpacity
                                onPress={()=>{
                                    this.props.showLightBox( item.images.map((slide) => {
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
            </View>
        )
    }
}

const Review = connect(
    state => {
        return {
            account: state.account,
            likes: state.likes
        }
    },
    {
        likeReview,
        updateSalonReviewLikes,
        updateServiceReviewLikes
    }
)(IReview);

class IReviews extends PureComponent{
    static defaultProps = {

    };

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            items: [
            ]
        }
    }
    _loadItem = () => {
        this.props.onLoadMore()
    };
    render(){
        let reviewBox = this.props.type==='salon'?this.props.reviewBox:this.props.serviceReviewBox;
        return (
            <View style={Styles.reviews}>
                {
                    reviewBox.items.map((item, index)=>{
                        return (
                            <Review requireLogin={this.props.requireLogin} showLightBox={this.props.showLightBox} type={this.props.type}  key={index} data={item}/>
                        )
                    })
                }
                <View style={Styles.reviewsBottom}>
                    {
                        !reviewBox.isLast?
                            !this.props.reviews.fetching?
                            <TouchableOpacity
                                onPress={this._loadItem}
                                style={Styles.loadMoreReviews}>
                                <Text style={Styles.loadMoreReviewsText}>Xem nhiều hơn</Text>
                            </TouchableOpacity>
                            :<BallIndicator size={50} color={Colors.PRIMARY}/>
                        :undefined
                    }
                </View>
            </View>
        )
    }
}

const Reviews = connect(
    state => {
        return {
            reviews: state.reviews,
            reviewBox: state.reviews.reviewBox,
            serviceReviewBox: state.reviews.serviceReviewBox,
        }
    },
)(IReviews);



class WAReviews extends PureComponent {
    static defaultProps = {
        position: {},
        type : 'salon',
    };

    constructor(props) {
        super(props);
        this.state = {
            showLightBox: false,
            lightBoxItems: [],
            loginAlert: false
        }
    }

    _showLightBox = (items) => {
        this.setState({
            showLightBox: true,
            lightBoxItems: items
        });
    };

    requireLogin = ()=>{
       this.setState({
           loginAlert: true
       });
    };

    render(){
        let reviewBox = this.props.type==='salon'?this.props.reviewBox:this.props.serviceReviewBox;
        return (
            <View style={Styles.blockReview}>
                <WAAlert
                    title={'Đăng nhập'}
                    question={'Vui lòng đăng nhập để sử dụng chức năng này'}
                    titleFirst={true}
                    show={this.state.loginAlert} yesTitle={'Đăng nhập'} noTitle={'Lần sau'} yes={()=>{
                    this.setState({loginAlert: false}, ()=>{
                        this.props.navigation.navigate('new_login');
                    });

                }} no={()=>{
                    this.setState({loginAlert: false});
                }}/>
                <WALightBox navigation={this.props.navigation} onClose={()=>{
                    this.setState({showLightBox: false});
                }} show={this.state.showLightBox}
                        items={this.state.lightBoxItems}    />
                <View style={Styles.blockReviewHead}>
                    <View style={Styles.blockReviewHeadLeft}>
                        <Text numberOfLines={1} style={Styles.blockReviewTitle}>
                            Xếp hạng sao
                        </Text>
                        <Text style={Styles.blockReviewDesc}>
                            {
                                reviewBox.total>0?
                                    'Có '+reviewBox.total+' người đánh giá & nhận xét':
                                    'Chưa có đánh giá & nhận xét nào'
                            }
                        </Text>
                    </View>
                    <View Style={Styles.blockReviewHeadRight}>
                        <TouchableOpacity
                            onPress={()=>{
                                if(!this.props.account.token){
                                    this.requireLogin();
                                    return;
                                }
                                this.props.navigation.navigate(
                                    'select_service_review',
                                    {
                                        salonID: this.props.salon,
                                        serviceID: this.props.service,
                                        onSuccess: () => {
                                            if(this.props.type === 'service'){
                                                this.props.navigation.navigate('home_service');
                                            }
                                            else{
                                                this.props.navigation.navigate('home_salon');
                                            }
                                        }
                                    }
                                );
                            }}
                            style={Styles.writeReview}>
                            <Text style={Styles.writeReviewText}>Viết nhận xét</Text>
                            <Icon name={'edit'} style={Styles.writeReviewIcon} />
                        </TouchableOpacity>
                    </View>
                </View>
                <Reviews requireLogin={this.requireLogin} showLightBox={this._showLightBox} type={this.props.type} onLoadMore={this.props.onLoadMore}/>
            </View>
        )
    }
}

export default connect(
    state => {
        return {
            account: state.account,
            reviews: state.reviews,
            reviewBox: state.reviews.reviewBox,
            serviceReviewBox: state.reviews.serviceReviewBox,
        }
    },
)(WAReviews)

const Styles = StyleSheet.create({
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
    blockReviewHead: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 20,
        paddingBottom: 30,
        borderBottomWidth: 1,
        borderBottomColor: Colors.SILVER_LIGHT,
        flexDirection: 'row',
        alignItems: 'center',
    },
    blockReviewHeadLeft: {
        flex: 1
    },
    blockReviewHeadRight: {

    },
    writeReview: {
      flexDirection: 'row',
        alignItems: 'center'
    },
    writeReviewText: {
        color: Colors.TEXT_DARK,
        fontSize: 12,
        fontFamily: GlobalStyles.FONT_NAME,
    },
    blockReview: {
        borderTopWidth: 5,
        borderTopColor: Colors.SILVER_LIGHT
    },
    writeReviewIcon: {
      marginLeft: 5,
        width: 20,
        height: 20,
        lineHeight: 20,
        backgroundColor: Colors.PRIMARY,
        textAlign: 'center',
        color: Colors.LIGHT,
        borderRadius: 10,
        overflow: 'hidden'
    },
    blockReviewTitle:{
        color: Colors.TEXT_DARK,
        fontSize: 20,
        fontFamily: GlobalStyles.FONT_NAME,
        fontWeight: 'bold',
        marginBottom: 5
    },
    blockReviewDesc: {
        color: Colors.SILVER_DARK,
        fontSize: 13,
        fontFamily: GlobalStyles.FONT_NAME,
    },
    reviews: {

    },
    review: {
        flexDirection: 'row',
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 20,
        paddingRight: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.SILVER_LIGHT

    },
    reviewBody: {
        flex: 1
    },
    reviewAvatar: {
        marginRight: 10
    },
    reviewAvatarImage: {
        width: 30,
        height: 30,
        resizeMode: 'cover',
        borderRadius: 15
    },
    reviewAuthor: {
        color: Colors.TEXT_DARK,
        fontSize: 13,
        fontFamily: GlobalStyles.FONT_NAME,
    },
    reviewDate: {
        color: Colors.SILVER_DARK,
        fontSize: 12,
        fontFamily: GlobalStyles.FONT_NAME,
    },
    reviewRating: {
        flexDirection: 'row'  ,
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 5
    },
    reviewStars: {
        flex: 1
    },
    reviewStar: {
        marginRight: 10
    },
    reviewLike: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: Colors.SILVER,
        borderWidth: 1,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 15
    },
    reviewLikeIcon: {
        color: Colors.SILVER,
        marginRight: 5,
        fontSize: 20
    },
    reviewLikeIconLiked: {
        color: Colors.PRIMARY,
    },
    reviewLikeText: {
        color: Colors.SILVER,
        fontSize: 14,
        fontFamily: GlobalStyles.FONT_NAME
    },
    reviewLikeCountWrapper: {
        paddingRight: 10,
        marginRight: 10,
        borderRightWidth: 1,
        borderRightColor: Colors.SILVER
    },
    reviewLikeCount: {
        color: Colors.SILVER,
        fontSize: 16,
        fontFamily: GlobalStyles.FONT_NAME,
    },
    reviewTitle: {
        color: Colors.PRIMARY,
        fontSize: 17,
        fontFamily: GlobalStyles.FONT_NAME,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10
    },
    reviewContent: {
        color: Colors.TEXT_DARK,
        fontSize: 14,
        fontFamily: GlobalStyles.FONT_NAME,
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
        marginTop: 30,
        marginBottom: 60
    },
});
import React, {PureComponent} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import Svg, {ClipPath, Defs, G, Rect} from "react-native-svg";
import Path from "react-native-svg/elements/Path";

export default class WAStarsCustom extends PureComponent<Props> {
    static defaultProps = {
        style: undefined,
        starStyle: undefined,
        starListStyle: undefined,
        starInfoStyle: undefined,
        starInfoTextStyle: undefined,
        starInfo: '',
        rating: 0.0,
        set: '',
        starImageStyle: undefined
    };
    constructor(props) {
        super(props)
    };
    render() {
        let $score = this.props.rating;
        $score = $score<0?0:$score;
        $score = $score>5?5:$score;
        let $stars = [

        ];
        let $round = Math.floor($score);
        let $remain = $score - $round;
        let $half = $remain >= 0.5 ? 1: 0;

        for (let $i = 1; $i<=$round; $i++) {
            //full
            if(this.props.set === ''){
                $stars.push(
                    <Image style={this.props.starImageStyle} source={require('../assets/images/starf.png')} />
                );
            }
            else if(this.props.set === '2'){
                $stars.push(
                    <Image style={this.props.starImageStyle} source={require('../assets/images/starf2.png')} />
                );
            }
            else if(this.props.set === '3'){
                $stars.push(
                    <Image style={this.props.starImageStyle} source={require('../assets/images/starf3.png')} />
                );
            }
            else if(this.props.set === 'svg1'){
                $stars.push(
                    <Svg
                        width={7}
                        height={7}
                    >
                        <Path d="M3.23,5.45l-1.74.93a.2.2,0,0,1-.29-.21l.33-2A.2.2,0,0,0,1.48,4L.06,2.63a.2.2,0,0,1,.11-.34l2-.29a.2.2,0,0,0,.15-.11L3.15.11a.2.2,0,0,1,.36,0L4.38,1.9A.2.2,0,0,0,4.53,2l2,.29a.2.2,0,0,1,.11.34L5.18,4a.2.2,0,0,0-.06.18l.33,2a.2.2,0,0,1-.29.21L3.42,5.45A.2.2,0,0,0,3.23,5.45Z" fill="#ffb600"/>
                    </Svg>
                )
            }
        }
        if($half){
            //haft
            if(this.props.set === ''){
                $stars.push(
                    <Image style={this.props.starImageStyle} source={require('../assets/images/starh.png')} />
                );
            }
            else if(this.props.set === '2'){
                $stars.push(
                    <Image style={this.props.starImageStyle} source={require('../assets/images/starh2.png')} />
                );
            }
            else if(this.props.set === '3'){
                $stars.push(
                    <Image style={this.props.starImageStyle} source={require('../assets/images/starh3.png')} />
                );
            }
            else if(this.props.set === 'svg1'){
                $stars.push(
                    <Svg
                        width={7}
                        height={7}
                    >

                        <Defs>
                            <ClipPath id="clip-path" transform="translate(-0.95)">
                                <Rect width="4.27" height="6.4" fill="none"/>
                            </ClipPath>
                        </Defs>
                        <G id="Layer_2" data-name="Layer 2">
                            <G id="Layer_1-2" data-name="Layer 1">
                                <G>
                                    <Path d="M4.18,5.45l-1.74.93a.2.2,0,0,1-.29-.21l.33-2A.2.2,0,0,0,2.42,4L1,2.63a.2.2,0,0,1,.11-.34l2-.29a.2.2,0,0,0,.15-.11L4.09.11a.2.2,0,0,1,.36,0L5.33,1.9A.2.2,0,0,0,5.48,2l2,.29a.2.2,0,0,1,.11.34L6.12,4a.2.2,0,0,0-.06.18l.33,2a.2.2,0,0,1-.29.21L4.37,5.45A.2.2,0,0,0,4.18,5.45Z" transform="translate(-0.95)" fill="#e6e6e6" />
                                    <G clipPath="url(#clip-path)">
                                        <Path d="M4.18,5.45l-1.74.93a.2.2,0,0,1-.29-.21l.33-2A.2.2,0,0,0,2.42,4L1,2.63a.2.2,0,0,1,.11-.34l2-.29a.2.2,0,0,0,.15-.11L4.09.11a.2.2,0,0,1,.36,0L5.33,1.9A.2.2,0,0,0,5.48,2l2,.29a.2.2,0,0,1,.11.34L6.12,4a.2.2,0,0,0-.06.18l.33,2a.2.2,0,0,1-.29.21L4.37,5.45A.2.2,0,0,0,4.18,5.45Z" transform="translate(-0.95)" fill="#ffb600"/>
                                    </G>
                                </G>
                            </G>
                        </G>

                    </Svg>
                )
            }

        }
        let $missing = 5 - ($round + $half);
        for (let $i = 1; $i<=$missing; $i++) {
            //no
            if(this.props.set === ''){
                $stars.push(
                    <Image style={this.props.starImageStyle} source={require('../assets/images/stare.png')} />
                );
            }
            else if(this.props.set === '2'){
                $stars.push(
                    <Image style={this.props.starImageStyle} source={require('../assets/images/stare2.png')} />
                );
            }
            else if(this.props.set === '3'){
                $stars.push(
                    <Image style={this.props.starImageStyle} source={require('../assets/images/stare3.png')} />
                );
            }
            else if(this.props.set === 'svg1'){
                $stars.push(
                    <Svg
                        width={7}
                        height={7}
                    >
                        <Path d="M3.23,5.45l-1.74.93a.2.2,0,0,1-.29-.21l.33-2A.2.2,0,0,0,1.48,4L.06,2.63a.2.2,0,0,1,.11-.34l2-.29a.2.2,0,0,0,.15-.11L3.15.11a.2.2,0,0,1,.36,0L4.38,1.9A.2.2,0,0,0,4.53,2l2,.29a.2.2,0,0,1,.11.34L5.18,4a.2.2,0,0,0-.06.18l.33,2a.2.2,0,0,1-.29.21L3.42,5.45A.2.2,0,0,0,3.23,5.45Z" fill="#E6E6E6"/>
                    </Svg>
                )
            }
        }
        return (
            <View style={[Styles.container, this.props.style]}>
                <View style={[Styles.starListStyle, this.props.starListStyle]}>
                    {
                        $stars.map((item, index)=>{
                            return (
                                <View key={index} style={[Styles.starStyle, this.props.starStyle]}>
                                    {item}
                                </View>
                            )
                        })
                    }
                </View>
                {/* <View style={[Styles.starInfoStyle, this.props.starInfoStyle]}>
                    <Text style={[Styles.starInfoTextStyle, this.props.starInfoTextStyle]}>
                        {this.props.starInfo}
                    </Text>
                </View> */}
            </View>
        );
    };
}



const Styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    starListStyle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    starStyle:{
        marginRight: 6
    },
    starInfoTextStyle: {
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.SILVER_DARK,
        fontSize: 10,
    }
});

import React, { PureComponent } from 'react';

import {
    View,
    StyleSheet,
} from 'react-native';
import moment from 'moment';
import CountDown from './CountDown';

export default class WACountDown extends PureComponent {

    static defaultProps = {
    };

    constructor(props) {
        super(props);
        this.state = {
            totalDuration: 0,
        };
    };

    componentWillMount = () => {
        this.setState({
        })
    }

    componentDidMount = () => {
        var that = this;
        var today = new Date();
        var d = 86400 - (today.getHours() * 60 * 60 + today.getMinutes() * 60 + today.getSeconds());
        that.setState({ totalDuration: d });
        //Settign up the duration of countdown in seconds to re-render
    }

    render() {
        return (
            <View style={Styles.flastDeal}>
                <CountDown
                    until={this.state.totalDuration}
                    timetoShow={('H', 'M', 'S')}
                    onFinish={() => { this.props.updateTimeOut(true) }}
                    //onPress={() => alert('hello')}
                    size={8}
                />
            </View>
        );
    }
}

const Styles = StyleSheet.create({
    flastDeal: {
        flex: 1,
        justifyContent: 'flex-start'
    }
}
)
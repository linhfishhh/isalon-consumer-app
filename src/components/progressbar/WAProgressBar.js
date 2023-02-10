import React from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';

import ProgressBarAnimated from '../progressbar/AnimatedProgressBar';

export default class App extends React.Component {

    state = {
        progress: this.props.progress,
        progressWithOnComplete: 0,
        progressCustomized: 0,
    }

    increase = (key, value) => {
        this.setState({
            [key]: this.state[key] + value,
        });
    }

    render() {
        const progressCustomStyles = {
            backgroundColor: 'red',
            borderRadius: 0,
            borderColor: 'orange',
        };
        return (
            <View style={styles.container}>
                <View>
                    <ProgressBarAnimated
                        width={145}
                        value={this.state.progress}
                        backgroundColorOnComplete="#FF5C39"
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: 140,
        flex: 1,
        backgroundColor: '#FFF',
        paddingLeft: 2,
    },
    separator: {
        marginVertical: 30,
        borderWidth: 0.5,
        borderColor: '#DCDCDC',
    },
    progress: {
        color : "#6CC644",
        flex: 1,
    }
});
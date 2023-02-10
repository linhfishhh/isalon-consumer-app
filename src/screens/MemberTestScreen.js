import React, {Component} from 'react';
import {StyleSheet, View,Text} from 'react-native';
import PageContainer from "../components/PageContainer";
import MapView, {PROVIDER_GOOGLE} from "react-native-maps";


export default class MemberTestScreen extends Component {

    render() {
        return (
            <PageContainer>
                <Text
                    style={{
                        fontFamily: 'SVN-Product Sans',
                        marginTop: 150,
                        fontSize: 15,
                        fontWeight: 'bold'
                    }}
                    >
                    Test Custom Font
                </Text>
            </PageContainer>
        );
    }
}

const Styles = StyleSheet.create({
});

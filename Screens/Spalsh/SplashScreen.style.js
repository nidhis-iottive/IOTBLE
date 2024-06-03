import React from 'react'
import { StyleSheet } from "react-native";
import color from '../Colors/Colors';

const styles = StyleSheet.create({
    container : {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    Title: {
        fontSize : 16,
        marginTop: 10,
        fontWeight: '700',
        color: color.Black,
        letterSpacing: 1
    }
})
export default styles;


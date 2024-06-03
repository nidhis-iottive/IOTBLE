import React from 'react'
import { StyleSheet } from "react-native";
import color from '../Colors/Colors';

const styles = StyleSheet.create({
    container : {
        flex: 1,
       backgroundColor : color.White
    },
    image: {
        width: '100%'
    },
    secondView: {
        marginTop: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 25
    },
    title: {
        color: color.titleColor,
        fontSize: 20,
        fontWeight: '700',
    },
    desc : {
        color: color.contentColor,
        marginTop: 10,
        textAlign: 'left',
        letterSpacing: 1,
        fontSize: 13,
    },
    btn: {
        marginTop: 40,
        alignSelf: 'flex-end',
        marginRight: 25
    },
    modalView: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        alignSelf: 'center'
    },
    modalContainer: {
        marginHorizontal: 20,
        backgroundColor : color.modalBackColor,
        padding : 30,
        borderRadius: 22,
        marginTop: '55%'
    },
    modalTitle: {
        textAlign: 'center',
        color: color.Black,
        fontSize: 18,
        fontWeight: '400'
    },
    ble: {
        color: color.Black,
        fontWeight: '700'
    },
    flexView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    buttons: {
        height:43,
        borderRadius: 34,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        width: 215,
        alignSelf: 'center'
    },
    text: {
        color: color.White,
        fontSize: 18,
        fontWeight: '700'
    },
    button2: {
        marginTop: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    dontAllow: {
        color: color.Black
    },
    modalContain: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
export default styles;
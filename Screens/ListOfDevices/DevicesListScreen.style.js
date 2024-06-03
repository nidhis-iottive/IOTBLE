import { StyleSheet } from "react-native";
import color from "../Colors/Colors";

const styles = StyleSheet.create({
    container : {
        flex: 1,
       backgroundColor : color.White

    },
    HeaderView: {
        marginTop: 30,
        justifyContent: 'space-between',
        alignItems:'center',
        flexDirection: 'row',
        marginHorizontal: 25
    },
    title: {
        color: color.Black,
        fontSize: 20,
        fontWeight: '700'
    },
    devices: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 25,
        backgroundColor: color.deviceColor,
        height: 55,
        marginTop: 10,
        borderRadius: 12,
        paddingHorizontal: 10
    },
    connectBTN: {
        backgroundColor : 'blue',
        height: 30,
        justifyContent: 'center',
        alignItems:'center',
        borderRadius: 22,
        width: 90
    },
    modalContain: {
        flex : 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default styles
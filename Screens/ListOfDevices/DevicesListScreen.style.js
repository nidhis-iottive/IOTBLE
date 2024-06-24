import { StyleSheet } from "react-native";
import color from "../Colors/Colors";

const styles = StyleSheet.create({
    container : {
        flex: 1,
       backgroundColor : color.White

    },
    HeaderView: {
        marginTop: 30,
        // justifyContent: 'space-evenly',
        alignItems:'center',
        flexDirection: 'row',
        marginHorizontal: 25
    },
    title: {
        color: color.Black,
        fontSize: 20,
        fontWeight: '700',
        alignSelf: 'center'
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
    },
    button: {
        marginHorizontal: 25,
        marginTop: 20,
        backgroundColor: '#a3abb8',
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        borderRadius: 15
    },
    text: {
        fontSize: 18,
        color: '#fff',
        letterSpacing : 1,
    },
    back : {
        fontSize: 18,
        color: '#000',
    },
    advertiseTxt: {
        fontSize : 18,
        alignSelf: 'center', 
        marginTop: 40,
        color: '#4c62cf',
        fontWeight: '700'
    },
    textInput: {
        height: 45,
        borderRadius: 15,
        backgroundColor: '#fff',
        marginHorizontal: 25,
        shadowColor: '#000',
        elevation: 8,
        marginTop: 10,
        flexDirection: 'row',
        // position: 'absolute',
        width: '70%'
    },
    devicename: {
        marginTop: 15,
        marginHorizontal: 30,
        fontSize: 20, marginTop : 25
    },
    setbtn: {
        marginRight: 25,
        backgroundColor: '#8d9ef2',
        height: 40,
        width: 60,
        justifyContent: 'center',
        alignItems : 'center',
        borderRadius: 10
    },
    dropdown: {
        height: 50,
        backgroundColor: '#a3abb8',
        borderRadius: 12,
        // padding: 12,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
        marginTop: 15,
        marginHorizontal: 25
      },
      item: {
        padding: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      placeholderStyle: {
        fontSize: 14,
        // color: '#000',
        alignSelf: 'center',
      },
      selectedTextStyle: {
        fontSize: 16,
      },
})

export default styles
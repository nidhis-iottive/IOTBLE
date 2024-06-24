import { View, Text, Image } from 'react-native'
import React, { useEffect } from 'react'
import styles from './SplashScreen.style'
import Images from '../Images/Images'

const SplashScreen = ({ navigation }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
          navigation.replace('DevicesListScreen');
        }, 3000); // 3 seconds
    
        return () => clearTimeout(timer); // Cleanup the timer on component unmount
      }, [navigation]);
  return (
    <View style={styles.container}>
      <Image source={Images.logo}/>
      <Text style={styles.Title}>BLE APP</Text>
    </View>
  )
}

export default SplashScreen
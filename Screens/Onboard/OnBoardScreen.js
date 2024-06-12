import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Platform, Alert, Modal } from 'react-native';
import { PERMISSIONS, RESULTS, request, check, openSettings } from 'react-native-permissions';
import { NativeModules, NativeEventEmitter } from 'react-native';
import styles from './OnBoardScreen.style';
import Images from '../Images/Images';
import LinearGradient from 'react-native-linear-gradient';
import color from '../Colors/Colors';
import BLEPeripheral from '../BLEPeripheral';

const { BluetoothStatus } = NativeModules;

const OnBoardScreen = ({ navigation }) => {
  const [check, setCheck] = useState(false);



  const requestBluetoothPermissions = async () => {
    let permissions = [];

    if (Platform.OS === 'android') {
      permissions = [
        PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
        PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE,
      ];
    }

    try {
      let allPermissionsGranted = true;
      for (const permission of permissions) {
        const result = await request(permission);
        if (result !== RESULTS.GRANTED) {
          allPermissionsGranted = false;
          break;
        }
      }

      if (allPermissionsGranted) {
        console.log('All permissions granted');
        navigation.replace('DevicesListScreen');
      } else {
        console.log('Some permissions were not granted');
        Alert.alert(
          'Permissions Required',
          'You need to grant Bluetooth permissions to proceed.',
          [
            {
              text: 'Go to Settings',
              onPress: () => openSettings(),
            },
            {
              text: 'Cancel',
              onPress: () => {},
              style: 'cancel',
            },
          ],
        );
      }
    } catch (error) {
      console.error('Error requesting permissions', error);
    }
  };

  const handleGrantPermission = async () => {
    // await requestBluetoothPermissions();
    navigation.replace('DevicesListScreen');
  };

  return (
    <View style={styles.container}>
      {!check ? (
        <>
          <Image source={Images.onBoardImage} style={styles.image} />
          <View style={styles.secondView}>
            <Text style={styles.title}>Scan & Connect BLE device</Text>
            <Text style={styles.desc}>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
            </Text>
          </View>
          <TouchableOpacity style={styles.btn} onPress={() => setCheck(true)}>
            <Image source={Images.nextBTN} />
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.modalContain}>
          <Modal
            style={styles.modalView}
            animationType="none"
            transparent={true}
            visible={check}
            onRequestClose={() => setCheck(false)}>
            <View style={styles.modalContainer}>
              <>
                <Text style={styles.modalTitle}>
                  Allow <Text style={styles.ble}>Bluetooth</Text> to find,
                </Text>
                <Text style={styles.modalTitle}>connect to and, determine the</Text>
                <Text style={styles.modalTitle}>relative position of nearby</Text>
                <Text style={styles.modalTitle}>devices?</Text>
              </>
              <TouchableOpacity onPress={handleGrantPermission}>
                <LinearGradient
                  colors={[color.btnColor1, color.btnColor2]}
                  style={styles.buttons}>
                  <Text style={styles.text}>Allow</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button2} onPress={() => setCheck(false)}>
                <Text style={styles.dontAllow}>Don't Allow</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      )}
    </View>
  );
};

export default OnBoardScreen;

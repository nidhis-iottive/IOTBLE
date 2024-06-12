import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, PermissionsAndroid, Platform } from 'react-native';
import styles from './DevicesListScreen.style';
import Images from '../Images/Images';
import BLEPeripheral from '../BLEPeripheral.js';
import { PERMISSIONS, RESULTS, check, request } from 'react-native-permissions';

const serviceUUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const characteristicUUID = '6e400002-b5a3-f393-e0a9-e50E24dcca9e';

const DevicesListScreen = () => {
  const [scannedDevices, setScannedDevices] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [characteristicValue, setCharacteristicValue] = useState(new Uint8Array([0x00]));
const [getAddress, setAddress] = useState(null)
  useEffect(() => {
    requestBluetoothPermissions();
    BLEPeripheral.getBluetoothAddress((error, address) => {
      if (error) {
        console.error('Error getting Bluetooth address:', error);
      } else {
        console.log('Bluetooth address:', address);
        // Do something with the address...
      }
    });
   
    const initializeBLE = async () => {
      try {
        await BLEPeripheral.initialize();
        console.log('BLE initialized');
        await BLEPeripheral.setName('CAT-S53');
        console.log('Device name set');
        await BLEPeripheral.addService(serviceUUID, true);
        console.log('Service added');
        await BLEPeripheral.addCharacteristicToService(
          serviceUUID,
          characteristicUUID,
          16 | 1, // properties: read and write, notify (0x10 | 0x01)
          8       // permissions: read and write (0x08)
        );
        console.log('Characteristic added');
       
        BLEPeripheral.startScanning()
          .then(res => {
            console.log(res)
          }).catch(error => {
            console.log(error)
          })
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };

    initializeBLE();
  }, []);
  const requestBluetoothPermissions = async () => {
    try {
      // Check and request Bluetooth permissions
      if (Platform.OS === 'android') {
        const permissions = [
          PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
        ];
  
        for (const permission of permissions) {
          const result = await check(permission);
          if (result !== RESULTS.GRANTED) {
            const requestResult = await request(permission);
            if (requestResult !== RESULTS.GRANTED) {
              console.log(`Permission ${permission} denied`);
              // Handle the case where permissions are not granted
            } else {
              console.log(`Permission ${permission} granted`);
            }
          } else {
            console.log(`Permission ${permission} already granted`);
          }
        }
        console.log('All permissions handled');
      }
    } catch (err) {
      console.error('Error requesting Bluetooth permissions:', err);
    }
  };
  // Function to handle read requests
  const handleReadRequest = async (deviceAddress, requestId) => {
    try {
      // Call the method to respond to the read request
      await BLEPeripheral.respondToReadRequest(deviceAddress, requestId, characteristicValue);
      console.log('Read request responded successfully');
    } catch (error) {
      console.error('Error responding to read request:', error);
    }
  };

  // Function to handle write requests
  const handleWriteRequest = async (deviceAddress, requestId, status, value) => {
    try {
      // Call the method to respond to the write request
      await BLEPeripheral.respondToWriteRequest(deviceAddress, requestId, status, value);
      console.log('Write request responded successfully');
    } catch (error) {
      console.error('Error responding to write request:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.HeaderView}>
        <Text style={styles.title}>Nearby Devices</Text>
        <TouchableOpacity onPress={() => setScanning(true)}>
          <Image source={Images.re_scan} />
        </TouchableOpacity>
      </View>
      <View
        style={{
          marginTop: 15,
          marginBottom: 15,
          backgroundColor: '#fff',
        }}>
        <FlatList
          data={scannedDevices}
          keyExtractor={(item) => item.deviceAddress}
          renderItem={({ item }) => (
            console.log('item--', item)
          )}
        />
      </View>
    </View>
  );
};

export default DevicesListScreen;

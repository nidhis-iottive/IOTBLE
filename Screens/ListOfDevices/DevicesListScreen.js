/* eslint-disable prettier/prettier */
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  NativeModules,
  NativeEventEmitter,
  ScrollView,
  Modal,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from './DevicesListScreen.style';
import Images from '../Images/Images';
import BleManager from 'react-native-ble-manager';
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
const DevicesListScreen = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedDevices, setScannedDevices] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [checkType, setCheckType] = useState(0);
  const peripherals = new Map();
  const [connectedDevices, setConnectedDevices] = useState([]);
  const [isBluetoothEnabled, setIsBluetoothEnabled] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [type, setType] = useState(0);
  const [getDeviceId, setDeviceID] = useState(null);
  const [getDeviceName, setDeviceName] = useState(null);
  useEffect(() => {
    BleManager.enableBluetooth()
      .then(() => {
        // Success code
        console.log('The bluetooth is already enabled or the user confirm');
      })
      .catch(error => {
        // Failure code
        console.log('The user refuse to enable bluetooth');
      });
    // initializeBleManager();
    startScan();
    const handleDiscoverPeripheral = peripheral => {
      peripherals.set(peripheral.id, peripheral);
      setScannedDevices(Array.from(peripherals.values()));
    };

    const handleStopScan = () => {
      console.log('Scan stopped');
      setIsScanning(false);
    };

    bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      handleDiscoverPeripheral,
    );
    bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan);
    BleManager.start({showAlert: false}).then(() => {
      console.log('BleManager initialized');
      BleManager.checkState();
    });
    // Check Bluetooth status periodically
    const intervalId = setInterval(() => {
      BleManager.checkState();
      // console.log('check---');
    }, 3000); // Check every 5 seconds
    return () => {
      clearInterval(intervalId);
      bleManagerEmitter.removeAllListeners('BleManagerDiscoverPeripheral');
      bleManagerEmitter.removeAllListeners('BleManagerStopScan');
      bleManagerEmitter.removeAllListeners(
        'BleManagerDidUpdateState',
        handleBluetoothStateChange,
      );
    };
  }, []);
  const handleBluetoothStateChange = state => {
    console.log('Bluetooth state changed:', state);
    if (state === 'on') {
      setIsBluetoothEnabled(true);
      startScanWithDelay(); // Start scanning with a delay
    } else {
      setIsBluetoothEnabled(false);
      setScanning(false);
      setDevices([]);
    }
  };
  const startScan = () => {
    // setType(1);
    console.log('scanning');
    if (!isScanning) {
      console.log(isScanning);
      setScannedDevices([]);
      setIsScanning(true);
      BleManager.scan([], 5, true).catch(err => {
        console.error('Scan error:', err);
        setIsScanning(false);
      });
    }
  };
  const connectToDevice = async device => {
    console.log('check---id', device.id);
    setModalVisible(true);
    try {
      await BleManager.connect(device.id);
      console.log('Connected to', device.id);
      await AsyncStorage.setItem('address', device.id);
      // setScannedDevices(prevDevices =>
      //   prevDevices.filter(d => d.id !== device.id),
      // );
      handleGetConnectedDevices();
      setDeviceID(device.id), setDeviceName(device.name);
      //   navigation.navigate('connectedDevice', {
      //     device: device.id,
      //     name: device.name,
      //     connection: true,
      //     True: 0,
      //   });
    } catch (error) {
      console.error('Connection error', error);
      Alert.alert('Connection error', error.message);
    } finally {
      setModalVisible(false);
    }
  };
  const updateDeviceConnectionStatus = (id, connected) => {
    setScannedDevices(prevDevices =>
      prevDevices.map(device =>
        device.id === id ? {...device, connected} : device,
      ),
    );
  };
  const handleGetConnectedDevices = async () => {
    try {
      const connectedPeripherals = await BleManager.getConnectedPeripherals([]);
      setConnectedDevices(connectedPeripherals);
      console.log('Connected devices:', connectedPeripherals);
      connectedPeripherals.forEach(device =>
        updateDeviceConnectionStatus(device.id, true),
      );
    } catch (error) {
      console.error('Error getting connected devices:', error);
    }
  };
  const pairedDevice = async device => {
    setModalVisible(true);
    try {
      await BleManager.connect(device.id);
      console.log('Connected to paired device', device.name);
      await AsyncStorage.setItem('address', device.id);
      setDeviceID(device.id), setDeviceName(device.name);
      //   navigation.navigate('connectedDevice', {
      //     device: device.id,
      //     name: device.name,
      //     connection: true,
      //     True: 0,
      //   });
    } catch (error) {
      console.error('Connection error', error);
      Alert.alert('Connection error', error.message);
    } finally {
      setModalVisible(false);
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
      {scanning == false ? (
        <ScrollView
          style={{
            marginTop: 15,
            marginBottom: 15,
            backgroundColor: '#fff',
            // height: 250,
          }}>
          {scannedDevices.map((device, index) => (
            <TouchableOpacity
              key={index}
              style={styles.devices}
              onPress={() => pairedDevice(device)}>
              <Text>{device.name ? device.name : 'Unnamed Device'}</Text>
              <TouchableOpacity
                onPress={() => connectToDevice(device)}
                style={styles.connectBTN}>
                {/* <Text>Connect</Text> */}
                <Text>Connect</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <Modal
          style={styles.modalView}
          animationType="none"
          transparent={true}
          visible={scanning}
          onRequestClose={() => setIsScanning(false)}>
          <View style={styles.modalContain}>
            <Image source={require('../Assets/gif.png')} />
          </View>
        </Modal>
      )}
    </View>
  );
};

export default DevicesListScreen;

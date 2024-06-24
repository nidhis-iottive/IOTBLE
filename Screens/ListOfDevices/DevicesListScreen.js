import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  PermissionsAndroid,
  Platform,
  Alert,
  TextInput,
  Button,
} from 'react-native';
import styles from './DevicesListScreen.style';
import Images from '../Images/Images';
import BLEPeripheral from '../BLEPeripheral.js';
import {PERMISSIONS, RESULTS, check, request} from 'react-native-permissions';
import {Dropdown} from 'react-native-element-dropdown';
const serviceUUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const characteristicUUID = '6e400002-b5a3-f393-e0a9-e50E24dcca9e';

// const serviceUUID = '6E400001-B5A3-F393-E0A9-E50E24DCCA9E';
// const characteristicUUID = '6E400002-B5A3-F393-E0A9-E50E24DCCA9E';
const DevicesListScreen = () => {
  const [Check, setCheck] = useState(0);
  const [device, setDevice] = useState('');
  const [advertise, setAdvertise] = useState('');
  const [deviceName, setDeviceName] = useState('Wolley');
  const [characteristicValue, setCharacteristicValue] = useState(
    new Uint8Array([0x00]),
  );
  const [connect, setConnect] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState([]);
  const data = [
    {label: 'Court Block 1', value: '1'},
    {label: 'Court Block 2', value: '2'},
    {label: 'Court Block 3', value: '3'},
    {label: 'Court Block 4', value: '4'},
    {label: 'Court Block 5', value: '5'},
  ];
  const [value, setValue] = useState(null);

  useEffect(() => {
    console.log(Check);
    requestBluetoothPermissions();
    initializeBLE();
    const startAdvertisingListener = BLEPeripheral.addListener(
      'onStartAdvertising',
      event => {
        if (event.status === 'success') {
          Alert.alert('Success', 'Advertising started successfully');
        } else {
          Alert.alert(
            'Error',
            `Advertising failed with error code: ${event.errorCode}`,
          );
        }
      },
    );

    return () => {
      BLEPeripheral.removeListener(startAdvertisingListener);
      setCheck(0);
    };
  }, []);
  const handleDeviceConnection = () => {
    BLEPeripheral.addListener('onDeviceConnected', ({deviceAddress}) => {
      setConnectedDevices(prevDevices => [...prevDevices, deviceAddress]);
    });

    BLEPeripheral.addListener('onDeviceDisconnected', ({deviceAddress}) => {
      setConnectedDevices(prevDevices =>
        prevDevices.filter(addr => addr !== deviceAddress),
      );
    });
  };

  const requestBluetoothPermissions = async () => {
    try {
      // Check and request Bluetooth permissions
      if (Platform.OS === 'android') {
        const permissions = [
          PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
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
  const getConnectedDevices = async () => {
    // connectedDevices([])
    try {
      const addresses = await BLEPeripheral.getConnectedDeviceAddresses();
      setConnectedDevices(addresses);
      setDevice(addresses[0]);
      checkDeviceConnection(JSON.stringify(addresses[0]));
      console.log(
        'Connected device addresses:',
        JSON.stringify(addresses[0]),
        addresses,
      );
    } catch (error) {
      console.error('Failed to get connected device addresses:', error);
    }
  };

    const checkDeviceConnection = async (deviceAddress) => {
      console.log(deviceAddress)
      try {
        const isConnected = await BLEPeripheral.isDeviceConnected(deviceAddress);
        setConnect(isConnected);
        console.log('Device is connected:', isConnected);
      } catch (error) {
        console.error('Device connection check error:', error);
      }
    };
  const startAdvertising = () => {
    setCheck(1);
    // setConnectedDevices([])
    BLEPeripheral.startAdvertising(serviceUUID, 'MyDevice')
      .then(res => {
        console.log('-------',res);
        setAdvertise(res);
      })
      .catch(error => {
        console.error('Error starting advertising:', error);
      });
  };
  const initializeBLE = async () => {
    try {
      const init = await BLEPeripheral.initialize();
      console.log('----',init);

      await BLEPeripheral.setName(deviceName);
      console.log('Device name set MyDevice');
      // await new Promise(resolve => setTimeout(resolve, 5000));
      // await BLEPeripheral.addService(serviceUUID, true);

      // //await BLEPeripheral.addService(characteristicUUID, false)
      // console.log('Service added');

      // const properties =
      //    8;
      // const permissions =
      //    16;
      //    await new Promise(resolve => setTimeout(resolve, 9000));
      // BLEPeripheral.addCharacteristicToService(
      //   serviceUUID,
      //   characteristicUUID,
      //   properties,
      //   permissions,
      //   // BLEPeripheral.PROPERTIES.READ | BLEPeripheral.PROPERTIES.NOTIFY,
      //   // BLEPeripheral.PERMISSIONS.READ | BLEPeripheral.PERMISSIONS.WRITE,
      // ).then(response => {
      //   console.log('--------', response);
      // });

      try {
        const result = await BLEPeripheral.startScanning();
        console.log(result); // Log success message
      } catch (error) {
        console.error('Error starting Bluetooth scanning:', error); // Log error message
      }
    } catch (error) {
      console.error('Initialization error:', error);
    }
    getConnectedDevices();
  };
  // const sendNotificationToDevice = async message => {
  //   try {
  //     // if (device.length === 0) {
  //     //   console.error('No connected devices');
  //     //   return;
  //     // }

  //     // const deviceAddress = connectedDevices[0]; // Assuming you want to notify the first connected device

  //     // console.log('-----',deviceAddress);
  //     // if (!deviceAddress) {
  //     //   console.error('Device is not connected');
  //     //   return;
  //     // }

  //     const result = await BLEPeripheral.sendNotificationToDevices(
  //       serviceUUID,
  //       characteristicUUID,
  //       message,
  //     );
  //     console.log('Notification sent successfully:', result);
  //   } catch (error) {
  //     console.error('Error sending notification:', error);
  //   }
  // };

  const sendNotificationToDevice = async (message) => {
    try {
        const result = await BLEPeripheral.sendNotificationToDevices(serviceUUID, characteristicUUID, message);
        console.log('Notification sent successfully:', result);
    } catch (error) {
        console.error('Error sending notification:', error);
    }
};

  const renderItem = item => {
    // console.log('item>>>>', item);
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => (
          sendNotificationToDevice(item.label),
          setValue(item.label),
          setIsFocus(false)
        )}>
        <Text style={styles.textItem}>{item.label}</Text>
        {item.value === value && <Text>Hlloi</Text>}
      </TouchableOpacity>
    );
  };
  const start = async () => {
    setCheck(1);
    BLEPeripheral.startAdvertising(serviceUUID, 'MyDevice')
      .then(res => {
        console.log('-----', res);
        setAdvertise(res);
      })
      .catch(error => {
        console.error('Error starting advertising:', error);
      });
    // await new Promise(resolve => setTimeout(resolve, 5000));
   const service = await BLEPeripheral.addService(serviceUUID, true);

    //await BLEPeripheral.addService(characteristicUUID, false)
    console.log(service );

    const properties = 8;
    const permissions = 16;
    // await new Promise(resolve => setTimeout(resolve, 9000));
    // BLEPeripheral.addCharacteristicToService(
    //   '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
    //   '6e400002-b5a3-f393-e0a9-e50E24dcca9e',
    //   16 | 1,
    //   8,
    // ); //this is a Characteristic with read and write permissions and notify property
    BLEPeripheral.addCharacteristicToService(
      serviceUUID,
      characteristicUUID,
      16 | 1,
      8,
      // BLEPeripheral.PROPERTIES.READ | BLEPeripheral.PROPERTIES.NOTIFY,
      // BLEPeripheral.PERMISSIONS.READ | BLEPeripheral.PERMISSIONS.WRITE,
    ).then(response => {
      console.log('--------', response);
    });
  };

  return (
    <View style={styles.container}>
      {Check == 0 ? (
        <View style={styles.HeaderView}>
          <Text style={styles.title}>Bluetooth Connection</Text>
        </View>
      ) : Check == 1 ? (
        <>
          <View style={[styles.HeaderView, {justifyContent: 'space-between'}]}>
            <TouchableOpacity
              onPress={() => (setCheck(0), setDeviceName(''))}
              style={{}}>
              <Text style={styles.back}>Back</Text>
            </TouchableOpacity>

            <Text style={styles.title}> Advertising</Text>
            <TouchableOpacity onPress={initializeBLE}>
              <Image source={Images.re_scan} />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.HeaderView}>
          <TouchableOpacity onPress={() => setCheck(0)} style={{flex: 0.5}}>
            <Text style={styles.back}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Machine Control</Text>
        </View>
      )}

      {Check == 0 ? (
        <>
          <TouchableOpacity style={styles.button} onPress={start}>
            <Text style={styles.text}>Start Advertising</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setCheck(2)}>
            <Text style={styles.text}>Machine Control</Text>
          </TouchableOpacity>
        </>
      ) : Check == 1 ? (
        <View>
          <View>
            {/* {advertise !== '' ? (
              <Text style={styles.devicename}>
                Set Your Device name : (Optional)
              </Text>
            ) : null} */}

            {/* <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginRight: 20,
              }}>
              <TextInput
                value={deviceName}
                onChangeText={value => setDeviceName(value)}
                style={styles.textInput}
                placeholder="ex : my device"
              />
              <TouchableOpacity style={styles.setbtn} onPress={changeName}>
                <Text style={styles.text}>Set</Text>
              </TouchableOpacity>
            </View> */}
          </View>
          <Text style={styles.advertiseTxt}>
            Adrvertise started successfully
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => sendNotificationToDevice(serviceUUID, characteristicUUID,'Toggle Calibration Mode')}>
            <Text style={styles.text}>Toggle Calibration Mode</Text>
          </TouchableOpacity>
          <FlatList
            data={connectedDevices}
            keyExtractor={item => item}
            renderItem={({item}) => (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 15,
                  marginHorizontal: 25,
                }}>
                <Text>{item}</Text>
                <TouchableOpacity onPress={() => checkDeviceConnection(item)}>
                  <Text>Connect</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={() => sendMessage(item)}>
                  <Text>send msg</Text>
                </TouchableOpacity> */}
              </View>
            )}
          />
        </View>
      ) : (
        // Machine control view
        <View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => sendNotificationToDevice('Toggle Calibration Mode')}>
            <Text style={styles.text}>Toggle Calibration Mode</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => sendNotificationToDevice('Control Serve Motors')}>
            <Text style={styles.text}>Control Serve Motors</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => sendNotificationToDevice('Select Court BlockSet')}>
            <Text style={styles.text}>Select Court BlockSet</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              sendNotificationToDevice('Set Rally & Recover Mode')
            }>
            <Text style={styles.text}>Set Rally & Recover Mode</Text>
          </TouchableOpacity>
          <Dropdown
            style={[styles.button, isFocus && {borderColor: 'blue'}]}
            placeholderStyle={{color: '#fff'}}
            selectedTextStyle={styles.selectedTextStyle}
            disabled={value === null ? true : false}
            data={data}
            search={false}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={
              value === null ? '                     Select Court Block' : value
            }
            searchPlaceholder="Search..."
            value={value}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setValue(item.value);
              setIsFocus(false);
            }}
            renderItem={renderItem}
          />
        </View>
      )}
    </View>
  );
};

export default DevicesListScreen;

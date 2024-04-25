

import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TextInput,
  Pressable,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import React, { useContext, useState ,useEffect} from 'react';
import Logo from '../assets/images/brcm_logo_big.png';
import { appcolor } from '../constants';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { authContext } from '../context/AuthContextFunction';
import { selectRoleContext } from '../context/SelectRoleContext';
import axios from 'axios';
import API_URL from '../connection/url';
import { Snackbar } from 'react-native-paper';
import avatarImage from "../assets/images/man_avatar.jpg"
import {LogBox} from 'react-native';
export default function Login({ navigation }) {
  const [selectedBtn, setselectedBtn] = useState('Student');
  const { setIsLoggedIn,authData,setAuthData ,logOutMsg,setlogOutMsg } = useContext(authContext);
  const { role, setRole } = useContext(selectRoleContext);
  const [inputData, setinputData] = useState({ email: 'student@gmail.com', pass: 'saurav@123' });
  const [isLoading, setIsLoading] = useState(false);


  //for snackbar
  const [visible, setVisible] = React.useState(false);

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);
 
  useEffect(() => {
    setTimeout(()=>{
      setVisible('false')
    },100)
  }, [logOutMsg])
  
  LogBox.ignoreLogs([
    // Exact message
    'ReactImageView: Image source "null" doesn\'t exist',
  'If you want to use Reanimated 2 then go through our installation steps https://docs.swmansion.com/react-native-reanimated/docs/installation',
   
  ]);
  

  
  const onPress = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/v1/login`, {
        email: inputData.email,
        pass: inputData.pass,
      });
      
      if(response.data.success) {
        setAuthData(response.data);
        const { role: apiRole } = response.data.member;
        setRole({
          Admin: apiRole === 'admin',
          Student: apiRole === 'student',
          Faculty: apiRole === 'faculty',
        });
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      setIsLoggedIn(false);
    if (error.response && error.response.status === 401) {
      onToggleSnackBar();
      setlogOutMsg('Authentication failed. Please check your credentials.');
    }
    } finally {
      setIsLoading(false);
    }
    
    if (selectedBtn == 'Student') {
      setinputData({ email: 'student@gmail.com', pass: 'saurav@123' });
      setRole({ Admin: false, Student: true, Faculty: false });
    } else if (selectedBtn == 'Admin') {
      setinputData({ email: 'admin@gmail.com', pass: 'admin@123' });
      setRole({ Admin: true, Student: false, Faculty: false });
    } else if (selectedBtn == 'Faculty') {
      setinputData({ email: 'faculty@gmail.com', pass: 'faculty@123' });
      setRole({ Admin: false, Student: false, Faculty: true });
    }
  };
  
  return (
   <ScrollView>
     <View style={styles.container}>
      <Image source={Logo} style={styles.logo} defaultSource={avatarImage} />

      <View style={styles.btnWrapper}>
        <View
          style={{
            padding: 5,
            flexDirection: 'row',
            backgroundColor: appcolor,
            paddingHorizontal: 8,
          }}>
          <View
            style={
              selectedBtn == 'Student'
                ? styles.btnWrapperItemSelected
                : styles.btnWrapperItem
            }>
            <Text
              onPress={() => {setselectedBtn('Student')
              setinputData({ email: 'student@gmail.com', pass: 'saurav@123' })
            }}
              style={
                selectedBtn == 'Student'
                  ? styles.btnTextSelected
                  : styles.btnText
              }>
              Student
            </Text>
          </View>
          <View
            style={[
              selectedBtn == 'Faculty'
                ? styles.btnWrapperItemSelected
                : styles.btnWrapperItem,
              { marginHorizontal: 2 },
            ]}>
            <Text
              onPress={() => {setselectedBtn('Faculty')
              setinputData({ email: 'faculty@gmail.com', pass: 'faculty@123' })
            }}
              style={
                selectedBtn == 'Faculty'
                  ? styles.btnTextSelected
                  : styles.btnText
              }>
              Faculty
            </Text>
          </View>
          <View
            style={
              selectedBtn == 'Admin'
                ? styles.btnWrapperItemSelected
                : styles.btnWrapperItem
            }>
            <Text
              onPress={() =>{ setselectedBtn('Admin')
              setinputData({ email: 'admin@gmail.com', pass: 'admin@123' })
            } }
              style={
                selectedBtn == 'Admin' ? styles.btnTextSelected : styles.btnText
              }>
              Admin
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.loginPartWrapper}>
        <Text style={styles.roleTitle}>{selectedBtn} Login</Text>
        <Text style={styles.registerInfo}>Not a member yet ? Register</Text>
        <View style={[styles.inputWrapper, { marginTop: 30 }]}>
          <MaterialIcons name="email" color={appcolor} size={30} />
          <TextInput
            placeholder="Enter Your Email"
            placeholderTextColor={'black'}
            style={styles.textInput}
            value={inputData.email}
            onChangeText={(text) => setinputData({ ...inputData, email: text })}
            cursorColor="black"
          />
        </View>
        <View style={[styles.inputWrapper, { marginTop: 3 }]}>
          <Ionicons name="lock-closed" color={appcolor} size={30} />
          <TextInput
            placeholder="Enter Your Password"
            placeholderTextColor={'black'}
            style={styles.textInput}
            value={inputData.pass}
            onChangeText={(text) => setinputData({ ...inputData, pass: text })}
            cursorColor="black"
          />
        </View>
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color={appcolor} style={styles.loader} />
      ) : (
        <Pressable style={styles.button} onPress={onPress}>
          <Text style={styles.text}>Login</Text>
        </Pressable>
      )}

{logOutMsg.length > 0 && (
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        action={{
          label: 'Close',
          onPress: () => {
            setVisible(false);
            setlogOutMsg('')
          },
        }}
      >
        {logOutMsg}
      </Snackbar>
    )}
    </View>
   </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    // justifyContent: 'center',
    flex: 1,
    // backgroundColor: 'red',
    alignItems: 'center',
    padding: 10
  },
  logo: {
    marginTop: 40,
    height: 200,
    width: 200,
    marginLeft:10
  },
  btnWrapper: {
    flexDirection: 'row',
    // backgroundColor: 'red',
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',

    // flexWrap: 'wrap-reverse',
  },
  btnWrapperItem: {
    backgroundColor: appcolor,
    padding: 5,
    // color: '#000',
    // alignContent: 'center',
  },
  btnWrapperItemSelected: {
    backgroundColor: '#fff',
    padding: 5,
  },

  loginPartWrapper: {
    // backgroundColor: 'green',
    marginTop: 10,
    textAlign: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 20,
  },
  btnTextSelected: {
    color: 'black',
    fontSize: 20,
  },
  roleTitle: {
    color: 'black',
    textAlign: 'center',
    fontSize: 40,
    fontFamily: 'Montserrat-Bold',
  },
  registerInfo: {
    color: 'black',
    textAlign: 'center',
    fontFamily: 'NotoSans_Condensed-Light',
    fontSize: 20,
  },
  inputWrapper: {
    flexDirection: 'row',

    // backgroundColor: 'red',
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  textInput: {
    fontFamily: 'NotoSans_Condensed-Light',
    fontSize: 18,
    padding: 8,
    borderColor: 'black',
    width: '85%',
    backgroundColor: '#ccc',
    marginLeft: 10,
    alignItems: 'center',
    borderRadius: 5,
    color:"black"
  },

  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appcolor,
    padding: 10,
    marginTop: 50,
    width: '95%',
    borderRadius: 10,
  },
  text: {
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    color: 'white',
  },
});

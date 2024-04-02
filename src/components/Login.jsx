import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TextInput,
  Pressable,
} from 'react-native';
import React, {useContext, useState} from 'react';
import Logo from '../assets/images/brcm_logo_big.png';
import {appcolor} from '../constants';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { authContext } from '../context/AuthContextFunction';
import { selectRoleContext } from '../context/SelectRoleContext';


export default function Login({navigation}) {
  const [selectedBtn, setselectedBtn] = useState('Student');
  const {setIsLoggedIn} = useContext(authContext)
  const {role,setRole} = useContext(selectRoleContext)
  
  const onPress = () => {
    // alert('It is working');
    setIsLoggedIn(true)
    if (selectedBtn == 'Student') {
      setRole({Admin:false,Student:true,Faculty:false})
    } else if (selectedBtn == 'Admin') {
      setRole({Admin:true,Student:false,Faculty:false})
    }else if(selectedBtn == 'Faculty'){
      setRole({Admin:false,Student:false,Faculty:true})
    }
  };
  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.logo} />

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
              onPress={() => setselectedBtn('Student')}
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
              {marginHorizontal: 2},
            ]}>
            <Text
              onPress={() => setselectedBtn('Faculty')}
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
              onPress={() => setselectedBtn('Admin')}
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
        <View style={[styles.inputWrapper, {marginTop: 30}]}>
          <MaterialIcons name="email" color={appcolor} size={30} />
          <TextInput
            placeholder="Enter Your Email"
            placeholderTextColor={'black'}
            style={styles.textInput}
          />
        </View>
        <View style={[styles.inputWrapper, {marginTop: 3}]}>
          <Ionicons name="lock-closed" color={appcolor} size={30} />
          <TextInput
            placeholder="Enter Your Password"
            placeholderTextColor={'black'}
            style={styles.textInput}
          />
        </View>
      </View>
      <Pressable style={styles.button} onPress={onPress}>
        <Text style={styles.text}>Login</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // justifyContent: 'center',
    flex: 1,
    // backgroundColor: 'red',
    alignItems: 'center',
    padding:10
  },
  logo: {
    marginTop:40,
    height: 200,
    width: 200,
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
    marginTop:10,
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
    borderRadius:5,
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

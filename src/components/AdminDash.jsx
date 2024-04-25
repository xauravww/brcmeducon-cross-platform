import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authContext } from '../context/AuthContextFunction';
import { appcolor } from '../constants';
import eventsIcon from '../assets/images/1.png';
import galleryIcon from '../assets/images/2.png';
import alumniIcon from '../assets/images/4.png';
import examsIcon from '../assets/images/5.png';
import idCardIcon from '../assets/images/6.png';
import timeTableIcon from '../assets/images/7.png';
import assignmentIcon from '../assets/images/8.png';
import pyqsIcon from '../assets/images/9.png';
import profileIcon from '../assets/images/10.png';
import avatarImage from "../assets/images/man_avatar.jpg"
import { selectRoleContext } from '../context/SelectRoleContext';

export default function AdminDash({ navigation }) {
  const { setIsLoggedIn, authData, setAuthData } = useContext(authContext);
  const { setNavigationState } = useContext(selectRoleContext);
  const [userData, setUserData] = useState(null);


useEffect(() => {
  const focusListener = navigation.addListener('focus', () => {
    setNavigationState('AdminDash');
  });

  // Clean up the listener when the component is unmounted
  return () => {
    if (focusListener) {
      focusListener.remove();
    }
  };
}, [navigation]);


  const storeData = async () => {
    try {
      const jsonValue = JSON.stringify(authData);
      await AsyncStorage.setItem('auth-data', jsonValue);
      setUserData(authData.member);
    } catch (e) {
      console.error("Error saving value:", e);
    }


  if (authData.success) {
    // alert(`${authData.member.role} successfully logged in`);
    storeData();
    };
    
    
  }
  return (
    <View style={styles.container}>
      <View style={{padding:10}}>
      <View style={styles.nameCard}>
        <View>
          <Text style={styles.name}>Hello,</Text>
          <Text style={styles.name}>{ authData.member?.name}</Text>
          <Text style={styles.textMetaDetail}>ID:{ authData.member?.rollno} | ADMIN</Text>
        </View>
        <View>
          <Image source={{uri:authData.member?.imageurl?.url}} style={styles.imgAvatar} defaultSource={avatarImage} />
        </View>
      </View>
      </View>
      <ScrollView>
        <View style={styles.dashContent}>
          <View style={styles.row}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Events',{role:authData.member.role})}>
              <View style={styles.itemWrapper}>
                <Image source={eventsIcon} style={styles.endItemsActive} />
                <Text style={styles.text}>Manage Events</Text>
              </View>
            </TouchableOpacity>
           <TouchableOpacity
           onPress={() => navigation.navigate('IDCard',{role:authData.member.role})}>
           <View>
              <Image source={idCardIcon} style={styles.middleItemActive} />
              <Text style={styles.text}>ID Card</Text>
            </View>
           </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('MembersComponent')}>
              <View style={styles.itemWrapper}>
                <Image source={alumniIcon} style={styles.endItemsActive} />
                <Text style={styles.text}>Manage Members</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
           
           
           
          </View>
        
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 6,
    flex: 1,
  },
  nameCard: {
    width: '100%',
    height: 120,
    justifyContent: 'space-between',
    alignContent: 'center',
    flexDirection: 'row',
    marginTop: 10,
  },
  name: {
    color: 'black',
    fontFamily: 'Montserrat-Bold',
    fontSize: 30,
  },
  text: {
    color: 'black',
    fontFamily: 'NotoSans_Condensed-Regular',
    marginTop: 10,
    fontSize: 15,
    textAlign: 'center',
  },
  textMetaDetail: {
    color: 'black',
    fontFamily: 'NotoSans_Condensed-Regular',
    marginTop: 10,
    fontSize: 15,
  },
  imgAvatar: {
    height: 120,
    width: 120,
    borderRadius: 60,
  },
  dashContent: {
    flex: 1,
    padding: 10
  },
  itemWrapper: {},
  endItems: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: "#ccc",
  },
  endItemsActive: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: appcolor,
  },
  middleItem: {
    height: 120,
    borderRadius: 10,
    width: 120,
    backgroundColor: "#ccc",
  },
  middleItemActive: {
    height: 120,
    borderRadius: 10,
    width: 120,
    backgroundColor: appcolor,
  },
  row: {
    marginTop: 45,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 115,
  },
});

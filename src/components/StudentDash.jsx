import { StyleSheet, Text, View, Image, FlatList, LogBox } from 'react-native';
import React,{useContext,useEffect} from 'react';
import manAvatar from '../assets/images/man_avatar.jpg';
import eventsIcon from '../assets/images/1.png';
import galleryIcon from '../assets/images/2.png';
import resultsIcon from '../assets/images/3.png';
import alumniIcon from '../assets/images/4.png';
import examsIcon from '../assets/images/5.png';
import idCardIcon from '../assets/images/6.png';
import timeTableIcon from '../assets/images/7.png';
import assignmentIcon from '../assets/images/8.png';
import pyqsIcon from '../assets/images/9.png';
import profileIcon from '../assets/images/10.png';
import avatarImage from "../assets/images/man_avatar.jpg"
import { itemData } from '../utils/data';
import { appcolor ,containerColor } from '../constants';
import { ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Alert } from 'react-native';
import { authContext } from '../context/AuthContextFunction';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const Row = ({ children }) => (
  <View style={styles.row}>{children}</View>
);

export default  function StudentDash({ navigation }) {
  const { setIsLoggedIn, authData, setAuthData } = useContext(authContext);

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('auth-data', jsonValue); // Store the updated authData
    } catch (e) {
      console.error("Error saving value:", e);
    }
  };
  

  if (authData.success) {
    storeData(authData); 
  }
  LogBox.ignoreLogs([
    // Exact message
    'ReactImageView: Image source "null" doesn\'t exist',
  'If you want to use Reanimated 2 then go through our installation steps https://docs.swmansion.com/react-native-reanimated/docs/installation',
   
  ]);
  
  return (
    <View style={styles.container}>
     <View style={{padding:10}}>
     <View style={styles.nameCard}>
        <View>
          <Text style={styles.name}>Hello,</Text>
          <Text style={styles.name}>{authData.member?.name || "USER"}</Text>
          <Text style={styles.textMetaDetail}>ID:{authData.member?.rollno || "ROLLNO"} | STUDENT</Text>
        </View>
      <View>
      <Image 
  source={{ uri: authData.member?.imageurl?.url }}
  style={styles.imgAvatar}
  defaultSource={avatarImage}
  onError={() => alert('Image loading failed')}
/>
      </View>
      </View>
     </View>
      <ScrollView>
        <View style={styles.dashContent}>
          {/* <FlatList
          data={itemData}
          numColumns={3}
          renderItem={Item}
          // keyExtractor={item => item.alt}
        /> */}
          <View style={styles.row}>
            <TouchableOpacity
              onPress={() => navigation.navigate('ShowEvents', { userid: '1' })}>
              <View style={styles.itemWrapper}>
                <Image source={eventsIcon} style={styles.endItemsActive} />
                <Text style={styles.text}>Events</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('StudentAttendance')}
            >
              <View style={styles.itemWrapper}>
                <Image source={galleryIcon} style={styles.middleItemActive} />
                <Text style={styles.text}>My Attendances</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>navigation.navigate("TimeTable")}>
            <View style={styles.itemWrapper}>
              <Image source={timeTableIcon} style={styles.endItems} />
              <Text style={styles.text}>Time Table</Text>
            </View>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
           <TouchableOpacity onPress={()=>navigation.navigate('IDCard')}>
           <View>
              <Image source={idCardIcon} style={styles.endItemsActive} />
              <Text style={styles.text}>ID Card</Text>
            </View>
           </TouchableOpacity>
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
    backgroundColor: containerColor,
  },
  nameCard: {
    width: '100%',
    height:120,
    // backgroundColor: 'green',
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
    // backgroundColor: 'blue',
    flex: 1,
    padding:10
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
    // alignItems: 'center',
    // padding:10
  },
  middleItemActive: {
    height: 120,
    borderRadius: 10,
    width: 120,
    backgroundColor: appcolor,
    // alignItems: 'center',
    // padding:10
  },

  row: {
    marginTop: 45,
    flexDirection: 'row',
    // backgroundColor: 'red',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 115,
  },
});

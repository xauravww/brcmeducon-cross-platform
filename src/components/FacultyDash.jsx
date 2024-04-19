import {StyleSheet, Text, View, Image, FlatList} from 'react-native';
import React from 'react';
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
import {itemData} from '../utils/data';
import {appcolor} from '../constants';
import {ScrollView} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const Row = ({children}) => <View style={styles.row}>{children}</View>;
export default function FacultyDash({route}) {
  const navigation = useNavigation();
 
  return (
    <View style={styles.container}>
      <View style={styles.nameCard}>
        <View>
          <Text style={styles.name}>Hello,</Text>
          <Text style={styles.name}>Faculty Ji</Text>
          <Text style={styles.text}>ID:12345 | ADMIN</Text>
        </View>
        <Image source={manAvatar} style={styles.imgAvatar} />
      </View>
      <ScrollView>
        <View style={styles.dashContent}>
          <View style={styles.row}>
            <TouchableOpacity
              onPress={() => navigation.navigate('SendAssignments',{
                role:"FACULTY"
              })}>
              <View style={styles.itemWrapper}>
                <Image source={eventsIcon} style={styles.endItems} />
                <Text style={styles.text}>Send Assignments</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('ManageAttendance',{
                role:"FACULTY"
              })}>
              <View style={styles.itemWrapper}>
                <Image source={eventsIcon} style={styles.middleItemActive} />
                <Text style={styles.text}>Manage Attendance</Text>
              </View>
            </TouchableOpacity>
           
            <View style={styles.itemWrapper}>
              <Image source={resultsIcon} style={styles.endItems} />
              <Text style={styles.text}>Results</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View>
              <Image source={alumniIcon} style={styles.endItems} />
              <Text style={styles.text}>Alumni Meet</Text>
            </View>
            <View>
              <Image source={examsIcon} style={styles.middleItem} />
              <Text style={styles.text}>Exams</Text>
            </View>
            <View>
              <Image source={idCardIcon} style={styles.endItems} />
              <Text style={styles.text}>ID Card</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View>
              <Image source={timeTableIcon} style={styles.endItems} />
              <Text style={styles.text}>Time Table</Text>
            </View>
            <View>
              <Image source={assignmentIcon} style={styles.middleItem} />
              <Text style={styles.text}>Assignment</Text>
            </View>
            <View>
              <Image source={pyqsIcon} style={styles.endItems} />
              <Text style={styles.text}>PYQs</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View>
              <Image source={profileIcon} style={styles.endItems} />
              <Text style={styles.text}>Profile</Text>
            </View>
            <View>
              <Image source={manAvatar} style={styles.middleItem} />
              <Text style={styles.text}>Results</Text>
            </View>
            <View>
              <Image source={manAvatar} style={styles.endItems} />
              <Text style={styles.text}>Results</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    // backgroundColor: 'black',
  },
  nameCard: {
    width: '100%',
    // backgroundColor: 'whites',
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
  imgAvatar: {
    height: '100%',
    borderRadius: 10,
  },
  dashContent: {
    // backgroundColor: 'blue',
    flex: 1,
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

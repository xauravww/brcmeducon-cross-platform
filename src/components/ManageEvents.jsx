import { StyleSheet, Text, View, TextInput, ScrollView, Pressable, TouchableOpacity } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import DatePicker from 'react-native-date-picker'

import React, { useState, useEffect,useContext } from 'react';
import { appcolor } from '../constants';
import Fontisto from 'react-native-vector-icons/Fontisto';
import axios from 'axios';
import { compareAsc, format } from "date-fns";
import LoaderKit from 'react-native-loader-kit'
import API_URL from '../connection/url';
import { selectRoleContext } from '../context/SelectRoleContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authContext } from '../context/AuthContextFunction';
export default function ManageEvents({ route, navigation }) {
  const [loading, setloading] = useState(false)
  const item = route.params
  const roleData = ['Student', 'Teacher', 'All'];
  const holidayData = ['Holiday', 'Event']
  const [selectedLanguage, setSelectedLanguage] = useState();
  const [manageEventsInputs, setmanageEventsInputs] = useState({ name: "", description: "", date: "", time: "", assignTo: "", eventType: "", monthCode: 1, id: "" })
  
  const [date, setDate] = useState(new Date())
  const [open, setOpen] = useState(false)
  const [openTimeModal, setopenTimeModal] = useState(false)
  const [actionType, setactionType] = useState("VIEW")
  const dateStr = new Date();
  const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;


  const { navigationState ,setNavigationState} = useContext(selectRoleContext);
  setNavigationState("ManageEvents")

  const { authData, setAuthData, setIsLoggedIn } = useContext(authContext);

  const handleLogout = async (message) => {
    try {
      await AsyncStorage.removeItem('auth-data');
      setAuthData({});
      setIsLoggedIn(false);
      console.log(message);
    } catch (e) {
      console.error("Error removing value:", e);
    }
  }
  
  useEffect(() => {
    if (item) {
      const { name, description, date, assignTo, eventType, time, id, actionType } = item
      setmanageEventsInputs({ ...manageEventsInputs, name: name, description: description, date: date, time: time, assignTo: assignTo, eventType: eventType, id: id })

      if (actionType) {
        setactionType("EDIT")
      }
     


    }
    

  }, [])

  useEffect(() => {
    const focusListener = navigation.addListener('focus', () => {
      setNavigationState("ManageEvents")
    });
    focusListener()
    return () => {
      if (focusListener) {
        focusListener.remove();
      }
    };
  }, [navigation]);

  

  const handleInputChange = (inputId, value) => {
    setmanageEventsInputs(prevState => ({
      ...prevState,
      [inputId]: value,
    }));
  };

  useEffect(() => {
    console.log("stored: ", manageEventsInputs.date)
    manageEventsInputs.monthCode = date.getMonth() + 1
  }, [manageEventsInputs.date])

  const handleSubmitEvents = () => {
    setloading(true)
    axios.post(`${API_URL}/api/v1/events1`, { name: manageEventsInputs.name, description: manageEventsInputs.description, date: manageEventsInputs.date, time: manageEventsInputs.time, assignTo: manageEventsInputs.assignTo, eventType: manageEventsInputs.eventType, monthCode: manageEventsInputs.monthCode ,token:authData?.token }).then((res) => {
      console.log("statuscode is ",res.status)
      
      if (res.data.success) {
        navigation.pop(1)
      }
    }).catch((err) => {
        if(err.response.status==404){
          handleLogout("Please Login Again ...")
        }
    })

  }

  const handleDeleteEvents = ( )=>{
    setloading(true)
    axios.delete(`${API_URL}/api/v1/events1/delete/${manageEventsInputs.id}`).then((res) => {
      console.log(res.data)
      console.log("statuscode is ",data.status)
      if (res.data.success) {
        navigation.pop(1)
      }
    }).catch((err) => {
      if(err.response.status==404){
        handleLogout("Please Login Again ...")
      }
    })
  }
  const handleEditEvents = ( )=>{
    setloading(true)
    axios.put(`${API_URL}/api/v1/events1/update/${manageEventsInputs.id}`, { name: manageEventsInputs.name, description: manageEventsInputs.description, date: manageEventsInputs.date, time: manageEventsInputs.time, assignTo: manageEventsInputs.assignTo, eventType: manageEventsInputs.eventType, monthCode: manageEventsInputs.monthCode }).then((res) => {
      if (res.data.success) {
        navigation.pop(1)
      }
    }).catch((err) => {
      if(err.response.status==404){
        handleLogout("Please Login Again ...")
      }
    })
  }
  //   return(
  //    <View style={{backgroundColor:"transparent" ,flex:1, alignItems:"center",justifyContent:"center"}}>
  //      <LoaderKit
  //   style={{ width: 100, height: 100 }}
  //   name={'BallScaleMultiple'}
  //   color={appcolor}
  // />
  //    </View>
  //   )

  return (
    <ScrollView style={{ flex: 1, height: '100%', backgroundColor: 'white' }}>

      <View style={[styles.container, { position: "relative" }]}>
        {loading && (
          <View style={{ backgroundColor: "transparent", flex: 1, alignItems: "center", justifyContent: "center", position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 3 }}>
            <LoaderKit
              style={{ width: 200, height: 200 }}
              name={'BallScaleMultiple'}
              color={appcolor}
            />
          </View>
        )}
        <View>
          <Text style={styles.text}>Event Name</Text>
          <TextInput
            placeholder="Add Title"
            placeholderTextColor={'#a3a3a3'}
            style={styles.textInput}
            value={manageEventsInputs.name}
            onChangeText={(text) => handleInputChange("name", text)}
          />
        </View>
        <View style={styles.descriptionWrapper}>
          <Text style={styles.text}>Description (optional)</Text>
          <TextInput
            placeholder="Description"
            placeholderTextColor={'#a3a3a3'}
            style={[styles.textInput, { height: 120, textAlignVertical: 'top' }]}
            value={manageEventsInputs.description}
            onChangeText={(text) => handleInputChange("description", text)}
          />
        </View>
        <View style={{ marginTop: 10 }}>
          <Text style={styles.text}>Date</Text>
          <View style={styles.dateTimePickerWrapperStyle}>
            <TextInput
              placeholder="MM/DD/YYYY"
              placeholderTextColor={'#a3a3a3'}
              style={{ color: "black" }}
              value={manageEventsInputs.date}
              onChangeText={(text) => handleInputChange("date", text)}
            />
            <TouchableOpacity onPress={() => setOpen(true)}>
              <Fontisto name="date" color={'black'} size={25} />
              <DatePicker
                modal
                open={open}
                date={date}
                mode='date'
                minimumDate={new Date(formattedDate)}
                theme='light'
                onConfirm={(date) => {
                  setOpen(false)
                  setDate(date)
                  setmanageEventsInputs({ ...manageEventsInputs, date: date.toLocaleDateString("en-GB").slice(0, 10) })
                }}
                onCancel={() => {
                  setOpen(false)
                }}
              />
            </TouchableOpacity>
          </View>

        </View>
        <View style={{ marginTop: 10 }}>
          <Text style={styles.text}>Time (optional)</Text>
          <View style={styles.dateTimePickerWrapperStyle}>
            <TextInput
              placeholder="09:00 AM"
              placeholderTextColor={'#a3a3a3'}
              style={{ color: "black" }}
              value={manageEventsInputs.time}
              onChangeText={(text) => handleInputChange("time", text)}
            />
            <TouchableOpacity onPress={() => setopenTimeModal(true)}>
              <Fontisto name="clock" color={'black'} size={25} />
              <DatePicker
                modal
                open={openTimeModal}
                date={date}
                mode='time'
                // minimumDate={new Date(formattedDate)}
                theme='light'
                onConfirm={(date) => {
                  setopenTimeModal(false)
                  // setDate(date)
                  setmanageEventsInputs({ ...manageEventsInputs, time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) })
                }}
                onCancel={() => {
                  setopenTimeModal(false)
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            marginTop: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            // width: '100%',
            // borderWidth: 1,
            borderColor: 'red',
          }}>
          <Text style={styles.text}>Assign To</Text>
          <SelectDropdown
            defaultButtonText='Select'
            data={roleData}
            buttonTextStyle={styles.picker}
            buttonStyle={styles.buttonStyle}
            rowTextStyle={{ textAlign: 'right', color: 'black' }}
            rowStyle={{ backgroundColor: '#dbdbdb' }}
            onSelect={(selectedItem, index) => {

              setmanageEventsInputs(prevState => ({
                ...prevState,
                assignTo: selectedItem
              }));
            }}

            defaultValue={manageEventsInputs.assignTo}
            buttonTextAfterSelection={(selectedItem, index) => {
              // text represented after item is selected
              // if data array is an array of objects then return selectedItem.property to render after item is selected
              return selectedItem;
            }}
            rowTextForSelection={(item, index) => {
              // text represented for each item in dropdown
              // if data array is an array of objects then return item.property to represent item in dropdown
              return item;
            }}
          />
        </View>
        <View
          style={{
            marginTop: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            // width: '100%',
            // borderWidth: 1,
            borderColor: 'red',
          }}>
          <Text style={styles.text}>Event Type</Text>
          <SelectDropdown
            defaultButtonText='Select'
            data={holidayData}
            buttonTextStyle={styles.picker}
            buttonStyle={styles.buttonStyle}
            rowTextStyle={{ textAlign: 'right', color: 'black' }}
            rowStyle={{ backgroundColor: '#dbdbdb' }}
            onSelect={(selectedItem, index) => {

              setmanageEventsInputs(prevState => ({
                ...prevState,
                eventType: selectedItem
              }));
            }}
            defaultValue={manageEventsInputs.eventType}
            buttonTextAfterSelection={(selectedItem, index) => {
              // text represented after item is selected
              // if data array is an array of objects then return selectedItem.property to render after item is selected
              return selectedItem;
            }}
            rowTextForSelection={(item, index) => {
              // text represented for each item in dropdown
              // if data array is an array of objects then return item.property to represent item in dropdown
              return item;
            }}
          />
        </View>
       {
        actionType=="VIEW" && (
          <Pressable onPress={handleSubmitEvents} style={{ backgroundColor: !loading ? appcolor : "gray", alignSelf: "center", marginTop: 40, padding: 5, borderRadius: 10 }} disabled={loading ? true : false}>
          <View>
            <Text style={{ color: "white", textAlign: "center", fontSize: 18, paddingHorizontal: 15, paddingVertical: 5 }}>{!loading ? "Submit" : "Please Wait..."}</Text>
          </View>
        </Pressable>
        )
       }
       {
        actionType=="EDIT" && (
         <View style={{alignItems:"center", justifyContent:"space-around",flexDirection:"row"}}>
           <Pressable onPress={handleEditEvents} style={{ backgroundColor: !loading ? appcolor : "gray", alignSelf: "center", marginTop: 40, padding: 5, borderRadius: 10 }} disabled={loading ? true : false}>
          <View>
            <Text style={{ color: "white", textAlign: "center", fontSize: 18, paddingHorizontal: 15, paddingVertical: 5 }}>{!loading ? "Edit" : "Please Wait..."}</Text>
          </View>
        </Pressable>
           <Pressable onPress={handleDeleteEvents} style={{ backgroundColor: !loading ? "red" : "gray", alignSelf: "center", marginTop: 40, padding: 5, borderRadius: 10 }} disabled={loading ? true : false}>
          <View>
            <Text style={{ color: "white", textAlign: "center", fontSize: 18, paddingHorizontal: 15, paddingVertical: 5 }}>{!loading ? "Delete" : "Please Wait..."}</Text>
          </View>
        </Pressable>
         </View>
        )
       }
        
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  text: {
    color: 'black',
    fontSize: 16,
    fontFamily: 'Inter-VariableFont',
    fontWeight: '800',
  },
  textInput: {
    padding: 10,
    backgroundColor: '#ebebeb',
    fontSize: 16,
    borderRadius: 10,
    marginTop: 10,
    fontFamily: 'Inter-VariableFont',
    color: "black"
  },
  descriptionWrapper: {
    marginTop: 20,
  },
  picker: {
    backgroundColor: 'white', // Light gray background
    // color: appcolor,
    fontFamily: 'Inter-VariableFont',
    fontSize: 16,
    // padding: 10,
    // borderRadius: 50,
    borderColor: 'red',
    // borderWidth: 1,
    textAlign: 'right',
    width: '100%',
  },
  buttonStyle: {
    backgroundColor: 'white',
    padding: 0,
    height: 25,
    width: 120,
    paddingHorizontal: 0,
  },
  dateTimePickerWrapperStyle: {
    justifyContent: "space-between", flexDirection: "row", alignItems: "center", paddingHorizontal: 10, backgroundColor: '#ebebeb', borderRadius: 10, marginTop: 10,
  }
});

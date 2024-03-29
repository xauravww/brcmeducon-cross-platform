import { StyleSheet, Text, View, TextInput, ScrollView, Pressable, TouchableOpacity } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import DatePicker from 'react-native-date-picker'

import React, { useState, useEffect } from 'react';
import { appcolor } from '../constants';
import Fontisto from 'react-native-vector-icons/Fontisto';
import axios from 'axios';
import { compareAsc, format } from "date-fns";

export default function ManageEvents({route,navigation}) {
  const item = route.params
  const roleData = ['Student', 'Teacher', 'Admin', 'All'];
  const holidayData = ['Holiday','Event','Both']
  const [selectedLanguage, setSelectedLanguage] = useState();
  const [manageEventsInputs, setmanageEventsInputs] = useState({ name: "", description: "", date: "", time: "", assignTo: "" ,eventType:"" ,monthCode:1})

  const [date, setDate] = useState(new Date())
  const [open, setOpen] = useState(false)
  const [openTimeModal ,setopenTimeModal ]= useState(false)

  const dateStr = new Date();
  const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

  console.log(formattedDate);

  useEffect(()=>{
    if(item){
      const {name,description,date,assignTo,eventType,time} = item
      setmanageEventsInputs({...manageEventsInputs,name:name,description:description,date:date,time:time,assignTo:assignTo,eventType:eventType})
      console.log("Current state values after editing btn pressed")
    console.log(name,description,date,assignTo,eventType,time)
     
    }
    
  },[])

  const handleInputChange = (inputId, value) => {
    setmanageEventsInputs(prevState => ({
      ...prevState,
      [inputId]: value,
    }));
  };

  useEffect(() => {
    manageEventsInputs.monthCode = date.getMonth()+1
  }, [manageEventsInputs.date])

  const handleSubmitEvents = () => {
    console.log(manageEventsInputs)
axios.post('http://sources-pee.gl.at.ply.gg:63207/api/v1/events1',{name:manageEventsInputs.name,description:manageEventsInputs.description,date:date,time:manageEventsInputs.time,assignTo:manageEventsInputs.assignTo,eventType:manageEventsInputs.eventType,monthCode:manageEventsInputs.monthCode}).then((res)=>{
  console.log(res.data)
}).catch((err)=>{
  console.log(err)
})
    
  }
  

  return (
    <ScrollView style={{ flex: 1, height: '100%', backgroundColor: 'white' }}>
      <View style={styles.container}>
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
              onChangeText={(text) => handleInputChange("date", Date.parse(text))}
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
              style={{color:"black"}}
              value={manageEventsInputs.time}
              onChangeText={(text) => handleInputChange("time", text)}
            />
            <TouchableOpacity onPress={()=> setopenTimeModal(true)}>
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
                  setmanageEventsInputs({ ...manageEventsInputs, time:date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) })
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
              console.log(selectedItem, index);
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
              console.log(selectedItem, index);
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
        <Pressable onPress={handleSubmitEvents} style={{ backgroundColor: appcolor, alignSelf: "center", marginTop: 40, padding: 5, borderRadius: 10 }}>
          <View>
            <Text style={{ color: "white", textAlign: "center", fontSize: 22,paddingHorizontal:5 ,paddingVertical:5 }}>Submit</Text>
          </View>
        </Pressable>
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

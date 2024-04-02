import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Card } from 'react-native-paper'
import SelectDropdown from 'react-native-select-dropdown'

export default function SendAssignments() {
  const [assignments, setassignments] = useState([])
  useEffect(() => {
    axios.get('http://sources-pee.gl.at.ply.gg:63207/api/v1/faculty/assignment')
    .then(res => {
      console.log(res.data)
      setassignments(res.data.data)
    }).catch((err)=>{
      console.log(err)
    })
  }, [])
  const emojisWithIcons = [
    {title: 'happy', icon: 'emoticon-happy-outline'},
    {title: 'cool', icon: 'emoticon-cool-outline'},
    {title: 'lol', icon: 'emoticon-lol-outline'},
    {title: 'sad', icon: 'emoticon-sad-outline'},
    {title: 'cry', icon: 'emoticon-cry-outline'},
    {title: 'angry', icon: 'emoticon-angry-outline'},
    {title: 'confused', icon: 'emoticon-confused-outline'},
    {title: 'excited', icon: 'emoticon-excited-outline'},
    {title: 'kiss', icon: 'emoticon-kiss-outline'},
    {title: 'devil', icon: 'emoticon-devil-outline'},
    {title: 'dead', icon: 'emoticon-dead-outline'},
    {title: 'wink', icon: 'emoticon-wink-outline'},
    {title: 'sick', icon: 'emoticon-sick-outline'},
    {title: 'frown', icon: 'emoticon-frown-outline'},
  ];
  return (
    <View>
   
   
      {
         assignments && assignments.map((ass)=>(
          <Card style={{marginHorizontal:25 ,margin:10}}>
          <Card.Content>
          <Text style={{color:"black"}}>{ass.title}</Text>
          </Card.Content>
          </Card>
         ))
}

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
            data={['Holiday', 'Event', 'Both']}
            buttonTextStyle={styles.picker}
            buttonStyle={styles.buttonStyle}
            rowTextStyle={{ textAlign: 'right', color: 'black' }}
            rowStyle={{ backgroundColor: '#dbdbdb' }}
            onSelect={(selectedItem, index) => {

              // setmanageEventsInputs(prevState => ({
              //   ...prevState,
              //   eventType: selectedItem
              // }));
            }}
            defaultValue={"select"}
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
   
    
    </View>
  )
}

const styles = StyleSheet.create({
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
})
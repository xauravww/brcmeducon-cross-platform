

import { Dimensions, StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';


import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { ScrollView } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { Pressable, TouchableWithoutFeedback  } from 'react-native';
import { Avatar, Card } from 'react-native-paper';
import { material } from 'react-native-typography'
import { appcolor } from '../constants';
import { getAllDatesOfMonth, getAllDatesOfYear ,getIndianDate} from './calendar-utils/date'
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

export default function Event({ route, navigation }) {
  const [eventData, seteventData] = useState({})
  const [items, setitems] = useState({})
  const [roleType, setroleType] = useState("STUDENT")

  const { role } = route.params

  const [itemsListStyles, setItemsListStyles] = useState({

  });

  const [pressedItem, setpressedItem] = useState({ display: false, description: "", time: "" })




  const handleItemPress = (item) => {
    console.log(item)
    setpressedItem({ ...pressedItem, display: true, description: item.description, time: item.time, name: item.name })
  }

  const renderItem = (item) => {
    return (

      <Pressable style={[styles.item, { height: "100%", color: item.color, width: item.width, marginTop: 10, borderRadius: 10 }]} onPress={() => handleItemPress(item)}>
        <Card>
          <Card.Content style={{ backgroundColor: item.backgroundColor, borderRadius: 10, height: "100%", color: item.color }}>
            <View style={
              {
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: item.backgroundColor,
                height: "100%",

              }
            } >
              <Text style={{ color: item.color }}>{item.name}</Text>
              {/* <Avatar.Text label="J" /> */}
              {roleType == "ADMIN" && (
                <Icon name='edit' size={20} color={item.color} onPress={() => navigation.navigate("ManageEvents", { ...item, actionType: "EDIT" })} />
              )}
            </View>
          </Card.Content>
        </Card>
      </Pressable>

    )
  }



  const renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}>
        <Text style={{ color: "black" }}></Text>
      </View>
    );
  };


  let itemsList = {};
  
  //TODo fix this excplicit year value
  const datesArray = getAllDatesOfYear(new Date(Date.now()).getFullYear())
  datesArray.forEach((key) => {

    itemsList[key] = []
  })
  function convertDateFormat(inputDate) {
    // Split the input date string by '/'
    const parts = inputDate.split('/');

    // Rearrange the parts to 'yyyy-mm-dd' format
    const yyyy_mm_dd = `${parts[2]}-${parts[1]?.padStart(2, '0')}-${parts[0]?.padStart(2, '0')}`;

    return yyyy_mm_dd;
  }


  useEffect(() => {
    if (role) {
      setroleType(role)
    }
    axios.get(`http://sources-pee.gl.at.ply.gg:63207/api/v1/events1/`)
      .then((data) => {
        const dataArr = data.data.data;
        const updatedItemsList = { ...itemsList };

        dataArr.forEach((itemData) => {
          const { name, description, assignTo, date, eventType, monthCode, time, _id } = itemData;

          const newDate = convertDateFormat(date)
          const newStyles = eventType === 'Holiday' ? {
            container: {
              backgroundColor: '#ff9999'
            },
            text: {
              color: 'white',
              fontWeight: 'bold'
            }
          } : {
            container: {
              backgroundColor: 'white',
              elevation: 2,
              borderWidth: 2,
              borderColor: appcolor,
              alignItems: "center",
              justifyContent: "center"
            },
            text: {
              color: 'blue'
            }
          };

          if (!itemsListStyles[newDate]) {
            setItemsListStyles(prevStyles => ({
              ...prevStyles,
              [newDate]: {
                customStyles: {}
              }
            }));
          }

          setItemsListStyles(prevStyles => ({
            ...prevStyles,
            [newDate]: {
              customStyles: {
                ...(prevStyles[newDate]?.customStyles || {}),
                ...newStyles
              }
            }
          }));


          const newItem = { name, backgroundColor: eventType === 'Holiday' ? "#ff9999" : "#cccccc", width: "80%", color: eventType === 'Holiday' ? "white" : "black", description, assignTo, time, date: date.slice(0, 10), eventType, id: _id };
          updatedItemsList[newDate] = [...updatedItemsList[newDate], newItem];
        });

        setitems(updatedItemsList);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [])

  return (
    <View style={{ flex: 1, backgroundColor: "#ff9999", height: "100%" }}>
{pressedItem.display && (
    <TouchableWithoutFeedback onPress={()=>setpressedItem({display:false})}>
      
  
      <View style={{ backgroundColor: "transparent", position: "absolute", height: "100%", width: "100%" ,zIndex:100 }}>
      <View style={{
        backgroundColor: appcolor,
        width: "70%",
       padding:30,
        top: (Dimensions.get('window').height / 2) - 200,
        left: (Dimensions.get('window').width / 2) - 135,
        zIndex: 100,
        borderRadius:10,
        color:"white"
      }}
      
      >

        <View>
          <Text style={{ color: "white", fontSize: 30 }}>{pressedItem.name}</Text>
          <Text style={{ color: "white", fontSize: 20 }}>About: {pressedItem.description}</Text>
          <Text style={{ color: "white", fontSize: 20 }}>Time: {pressedItem.time}</Text>
        </View>

      </View>

    </View>
    </TouchableWithoutFeedback>
  
)}
      <Agenda
      

        items={items}
       
        loadItemsForMonth={month => {
        }}


        selected={getIndianDate()}

        renderItem={renderItem}

        markingType={'custom'}
        markedDates={itemsListStyles}
     

        onRefresh={() => console.log('refreshing...')}
       refreshing={false}
    
        refreshControl={null}
        renderEmptyDate={renderEmptyDate}
        theme={{
          selectedDayBackgroundColor: appcolor,
          todayTextColor: appcolor,
          agendaDayTextColor: "#ccc",
          agendaDayNumColor: "#ccc",
          agendaTodayColor: appcolor,
          agendaKnobColor: appcolor,
        }}

        rowHasChanged={(r1, r2) => {
          return r1.text !== r2.text;
        }}
        pastScrollRange={2}
        futureScrollRange={2}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    height: "100%",
  
  },
  customDay: {
    marginTop: 32,
    fontSize: 28,
    color: 'green'
  },
  dayItem: {
    marginLeft: 34
  }
});
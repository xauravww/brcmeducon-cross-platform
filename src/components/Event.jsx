

import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useState, useEffect } from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { ScrollView } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { TouchableOpacity } from 'react-native';
import { Avatar, Card } from 'react-native-paper';
import { material } from 'react-native-typography'
import { appcolor } from '../constants';
import { getAllDatesOfMonth, getAllDatesOfYear } from './calendar-utils/date'
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

export default function Event({ route, navigation }) {
  const [eventData, seteventData] = useState({})
  const [items, setitems] = useState({})
  const [roleType, setroleType] = useState("STUDENT")

  const { role } = route.params

  const [itemsListStyles, setItemsListStyles] = useState({
    '2024-03-29': {
      customStyles: {
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
      }
    },
    // ... other date styles
  });


  function getIndianDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so we add 1
    const day = String(today.getDate()).padStart(2, '0');

    const indianDate = `${year}-${month}-${day}`;
    return indianDate;
  }


  const renderItem = (item) => {
    return (

      <Pressable style={[styles.item, { height: "100%", color: item.color, width: item.width, marginTop: 10, borderRadius: 10 }]}>
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
                <Icon name='edit' size={20} color={item.color} onPress={() => navigation.navigate("ManageEvents",item)} />
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

  const holdidayMarkingStyle = {
    container: {
      backgroundColor: 'red', elevation: 5
    },
    text: {
      color: 'white',
      fontWeight: 'bold'
    }
  }
  const eventMarkingStyle = {
    container: {
      backgroundColor: 'white',
      elevation: 2,
      borderWidth: 2,
      borderColor: appcolor,
      alignItems: "center"
      , justifyContent: "center"
    },
    text: {
      color: 'blue'
    }
  }

  const eventAndHolidayMarkingStyle = {
    container: {
      backgroundColor: "white",
      elevation: 2,
      borderWidth: 3,
      borderColor: "red",
      alignItems: "center"
      , justifyContent: "center"
    },
    text: {
      color: 'red',
      fontWeight: 'bold'
    }
  }
  let itemsList = {};  // Declare itemsList here
  // let itemsListStyles = {
  //   '2024-03-29': {
  //     customStyles: {
  //       container: {
  //         backgroundColor: 'white',
  //         elevation: 2,
  //         borderWidth: 2,
  //         borderColor: appcolor,
  //         alignItems: "center",
  //         justifyContent: "center"
  //       },
  //       text: {
  //         color: 'blue'
  //       }
  //     }
  //   },
  //   '2024-03-30': {
  //     customStyles: {
  //       container: {
  //         backgroundColor: 'green',
  //         elevation: 2,
  //         borderWidth: 2,
  //         borderColor: appcolor,
  //         alignItems: "center",
  //         justifyContent: "center"
  //       },
  //       text: {
  //         color: 'black'
  //       }
  //     }
  //   },
  //   '2024-03-31': {
  //     customStyles: {
  //       container: {
  //         backgroundColor: 'yellow',
  //         elevation: 2,
  //         borderWidth: 2,
  //         borderColor: appcolor,
  //         alignItems: "center",
  //         justifyContent: "center"
  //       },
  //       text: {
  //         color: 'red'
  //       }
  //     }
  //   }
  // };
//TODo fix this excplicit year value
  const datesArray = getAllDatesOfYear(new Date(Date.now()).getFullYear())
  datesArray.forEach((key) => {

    itemsList[key] = []
  })

  useEffect(() => {
    if (role) {
      setroleType(role)
    }
    axios.get(`http://sources-pee.gl.at.ply.gg:63207/api/v1/events1/`)
      .then((data) => {
        const dataArr = data.data.data;
        const updatedItemsList = { ...itemsList };

        dataArr.forEach((itemData) => {
          const { name, description, assignTo, date, eventType, monthCode, time } = itemData;
          const newDate = date.toString().slice(0, 10);
          const newStyles = eventType === 'Holiday' ? {
            container: {
              backgroundColor: 'red'
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
          

          const newItem = { name, backgroundColor: eventType === 'Holiday' ? "red" : "#cccccc", width: "80%", color: eventType === 'Holiday' ? "white" : "black" ,description,assignTo,time,date:date.slice(0,10),eventType};
          updatedItemsList[newDate] = [...updatedItemsList[newDate], newItem];
        });

        setitems(updatedItemsList);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [])

  return (
    <View style={{ flex: 1 }}>

      <Agenda
        // items={{
        //   '2024-03-27': [],
        //   '2024-03-26': [{ name: 'Holi', backgroundColor: "#ff9999", width: "90%", color: "white" }],
        //   '2024-03-29': [{ name: 'item 2 - any js object', height: 1, backgroundColor: "#d9d9d9", width: "90%", color: "#262626" }],
        //   '2024-03-30': [],
        // }}
        // onCalendarToggled={calendaropened=>{
        // if(calendaropened){
        //   axios.get(`http://sources-pee.gl.at.ply.gg:63207/api/v1/events1/`)
        //   .then((data) => {
        //     const dataArr = data.data.data;
        //     const updatedItemsList = { ...itemsList };

        //     dataArr.forEach((itemData) => {
        //       const { name, description, assignTo, date, eventType, monthCode, time } = itemData;
        //       const newDate = date.toString().slice(0, 10);
        //       const newStyles = eventType === 'Holiday' ? {
        //         container: {
        //           backgroundColor: 'red'
        //         },
        //         text: {
        //           color: 'white',
        //           fontWeight: 'bold'
        //         }
        //       } : {
        //         container: {
        //           backgroundColor: 'white',
        //           elevation: 2,
        //           borderWidth: 2,
        //           borderColor: appcolor,
        //           alignItems: "center",
        //           justifyContent: "center"
        //         },
        //         text: {
        //           color: 'blue'
        //         }
        //       };

        //       if (!itemsListStyles[newDate]) {
        //         setItemsListStyles(prevStyles => ({
        //           ...prevStyles,
        //           [newDate]: {
        //             customStyles: {}
        //           }
        //         }));
        //       }

        //       setItemsListStyles(prevStyles => ({
        //         ...prevStyles,
        //         [newDate]: {
        //           customStyles: {
        //             ...prevStyles[newDate]?.customStyles,
        //             ...newStyles
        //           }
        //         }
        //       }));

        //       const newItem = { name, backgroundColor: eventType === 'Holiday' ? "red" : "#cccccc", width: "80%", color: "#333333" };
        //       updatedItemsList[newDate] = [...updatedItemsList[newDate], newItem];
        //     });

        //     setitems(updatedItemsList);
        //   })
        //   .catch((err) => {
        //     console.error(err);
        //   });
        // }
        // }}
        items={items}
        // Callback that gets called when items for a certain month should be loaded (month became visible)
        loadItemsForMonth={month => {
          console.log("month called")
          // const currentDate = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
          // const yearNew = currentDate.split('')[0].split('/')[2];
          // const monthNew = currentDate.split(',')[0].split('/')[0];

          // axios.post(`http://sources-pee.gl.at.ply.gg:63207/api/v1/events1/${month.month}`)
          //   .then((data) => {
          //     const dataArr = data.data.data;
          //     const updatedItemsList = { ...itemsList };

          //     dataArr.forEach((itemData) => {
          //       const { name, description, assignTo, date, eventType, monthCode, time } = itemData;
          //       const newDate = date.toString().slice(0, 10);
          //       const newStyles = eventType === 'Holiday' ? {
          //         container: {
          //           backgroundColor: 'red'
          //         },
          //         text: {
          //           color: 'white',
          //           fontWeight: 'bold'
          //         }
          //       } : {
          //         container: {
          //           backgroundColor: 'white',
          //           elevation: 2,
          //           borderWidth: 2,
          //           borderColor: appcolor,
          //           alignItems: "center",
          //           justifyContent: "center"
          //         },
          //         text: {
          //           color: 'blue'
          //         }
          //       };

          //       if (!itemsListStyles[newDate]) {
          //         setItemsListStyles(prevStyles => ({
          //           ...prevStyles,
          //           [newDate]: {
          //             customStyles: {}
          //           }
          //         }));
          //       }

          //       setItemsListStyles(prevStyles => ({
          //         ...prevStyles,
          //         [newDate]: {
          //           customStyles: {
          //             ...prevStyles[newDate]?.customStyles,
          //             ...newStyles
          //           }
          //         }
          //       }));

          //       const newItem = { name, backgroundColor: eventType === 'Holiday' ? "red" : "#cccccc", width: "80%", color: "#333333" };
          //       updatedItemsList[newDate] = [...updatedItemsList[newDate], newItem];
          //     });

          //     setitems(updatedItemsList);
          //   })
          //   .catch((err) => {
          //     console.error(err);
          //   });
        }}


        selected={getIndianDate()}
        renderItem={renderItem}

        markingType={'custom'}
        markedDates={itemsListStyles}



        refreshing={false}
        renderEmptyDate={renderEmptyDate}
        theme={{

          agendaDayTextColor: "#ccc",
          agendaDayNumColor: "#ccc",
          agendaTodayColor: appcolor,
          agendaKnobColor: appcolor
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
    // marginRight: 10,
    // marginTop: 10,
  },
  emptyDate: {
    // height: 15,
    // flex: 1,
    // paddingTop: 30
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
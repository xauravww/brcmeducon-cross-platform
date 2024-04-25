import React, { useState, useEffect, useContext } from 'react';
import { Dimensions, StyleSheet, Text, View, Pressable, TouchableWithoutFeedback } from 'react-native';
import { Card } from 'react-native-paper';
import { Agenda } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllDatesOfYear, getIndianDate } from './calendar-utils/date';
import { useNavigation } from '@react-navigation/native';
import API_URL from '../connection/url';
import { appcolor } from '../constants';
import { selectRoleContext } from '../context/SelectRoleContext';
import { authContext } from '../context/AuthContextFunction';

const Event = ({ route, navigation }) => {
  const { role } = route.params;
  const [roleType, setroleType] = useState("STUDENT");
  const [items, setItems] = useState({});
  const [itemsListStyles, setItemsListStyles] = useState({});
  const [pressedItem, setPressedItem] = useState({ display: false, description: "", time: "" });
  const { navigationState, setNavigationState } = useContext(selectRoleContext);
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

  async function fetchEvents() {
    if (role) setroleType(role);

    let assignToFilter = "";

    if (authData?.member?.role === "faculty") {
      assignToFilter = "Faculty";
    } else if (authData?.member?.role === "student") {
      assignToFilter = "Student";
    } else if (authData?.member?.role === "admin") {
      assignToFilter = "All";
    }

    axios.get(`${API_URL}/api/v1/events1/`, {
      params: {
        assignTo: assignToFilter
      },
      headers: {
        'Authorization': `Bearer ${authData?.token}`
      }
    })
      .then((data) => {
        const dataArr = data.data.data;
        const updatedItemsList = { ...initialItemsList };
        const newItemsListStyles = {};

        dataArr.forEach((itemData) => {
          const { name, description, assignTo, date, eventType, time, _id } = itemData;

          if ((authData?.member?.role === "faculty" && assignTo === "Faculty") ||
              (authData?.member?.role === "student" && assignTo === "Student") ||
              (authData?.member?.role === "admin" && (assignTo === "Faculty" || assignTo === "Student"))) {

            const newDate = convertDateFormat(date);

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

            newItemsListStyles[newDate] = {
              customStyles: {
                ...itemsListStyles[newDate]?.customStyles,
                ...newStyles
              }
            };

            const newItem = {
              name,
              backgroundColor: eventType === 'Holiday' ? "#ff9999" : "#cccccc",
              width: "80%",
              color: eventType === 'Holiday' ? "white" : "black",
              description,
              assignTo,
              time,
              date: date.slice(0, 10),
              eventType,
              id: _id
            };
            updatedItemsList[newDate] = [...updatedItemsList[newDate], newItem];
          }
        });

        setItems(updatedItemsList);
        setItemsListStyles(newItemsListStyles);
      })
      .catch((err) => {
        console.error(err);
        if (err.response?.status === 404) {
          handleLogout("Please login again");
        }
      });
  }

  useEffect(() => {
    const focusListener = navigation.addListener('focus', () => {
      setNavigationState("Events");
      fetchEvents();
    });

    return () => {
      if (focusListener) {
        focusListener.remove();
      }
    };
  }, [navigation]);

  const handleItemPress = (item) => {
    setPressedItem({ display: true, description: item.description, time: item.time, name: item.name });
  };

  const renderItem = (item) => (
    <Pressable style={[styles.item, { height: "100%", color: item.color, width: item.width, marginTop: 10, borderRadius: 10 }]} onPress={() => handleItemPress(item)}>
      <Card>
        <Card.Content style={{ backgroundColor: item.backgroundColor, borderRadius: 10, height: "100%", color: item.color }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: item.backgroundColor, height: "100%" }}>
            <Text style={{ color: item.color }}>{item.name}</Text>
            {authData.member.role === 'admin' && (
              <Icon name='edit' size={20} color={item.color} onPress={() => navigation.navigate("ManageEvents", { ...item, actionType: "EDIT" })} />
            )}
          </View>
        </Card.Content>
      </Card>
    </Pressable>
  );

  const renderEmptyDate = () => (
    <View style={styles.emptyDate}>
      <Text style={{ color: "black" }}></Text>
    </View>
  );

  const datesArray = getAllDatesOfYear(new Date(Date.now()).getFullYear());
  const initialItemsList = Object.fromEntries(datesArray.map(date => [date, []]));

  const convertDateFormat = (inputDate) => {
    const parts = inputDate.split('/');
    return `${parts[2]}-${parts[1]?.padStart(2, '0')}-${parts[0]?.padStart(2, '0')}`;
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#ff9999", height: "100%" }}>
      {pressedItem.display && (
        <TouchableWithoutFeedback onPress={() => setPressedItem({ display: false })}>
          <View style={{ backgroundColor: "transparent", position: "absolute", height: "100%", width: "100%", zIndex: 100 }}>
            <View style={{
              backgroundColor: appcolor,
              width: "70%",
              padding: 30,
              top: (Dimensions.get('window').height / 2) - 200,
              left: (Dimensions.get('window').width / 2) - 135,
              zIndex: 100,
              borderRadius: 10,
              color: "white"
            }}>
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
        loadItemsForMonth={() => {}}
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
        rowHasChanged={(r1, r2) => r1.text !== r2.text}
        pastScrollRange={2}
        futureScrollRange={2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    height: "100%",
  },
  emptyDate: {
    // Add your styles here
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

export default Event;

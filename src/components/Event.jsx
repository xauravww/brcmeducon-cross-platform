import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import CalendarPicker from 'react-native-calendar-picker';
export default function Event({route, navigation}) {
  const {userid} = route.params;
  const minDate = new Date(); // Today
  const maxDate = new Date(2026, 6, 3);
  // const startDate = selectedStartDate ? selectedStartDate.toString() : '';
  // const endDate = selectedEndDate ? selectedEndDate.toString() : '';
  const today = Date(Date.now().toLocaleString());
  console.log(today);
  const onDateChange = (date, type) => {
    console.log(JSON.stringify(date));
  };
  return (
    <View>
      {/* <Text style={{color: 'red', fontSize: 400}}>{userid}</Text> */}
      <CalendarPicker
        startFromMonday={true}
        allowRangeSelection={true}
        minDate={minDate}
        maxDate={maxDate}
        todayBackgroundColor="#f2e6ff"
        selectedDayColor="#7300e6"
        selectedDayTextColor="#FFFFFF"
        onDateChange={onDateChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({});

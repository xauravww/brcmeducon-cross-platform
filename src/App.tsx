import {StatusBar, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {appcolor, conatainerColor} from './constants';
import TopBar from './components/TopBar';
import StudentDash from './components/StudentDash';
import Router from './route/Router';
export default function App() {
  return (
    <>
      <StatusBar backgroundColor={appcolor} />
      <View style={styles.container}>
        <TopBar />
        <Router />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: conatainerColor,
    // color:"#000"
  },
});

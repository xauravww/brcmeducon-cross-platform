import 'react-native-gesture-handler';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { appcolor, conatainerColor } from './constants';

import Router from './route/Router';
import AuthContextFunction from './context/AuthContextFunction';
import SelectRoleContext from './context/SelectRoleContext';
import SelectorInputsContext from './context/SelectorInputsContext';
export default function App() {
  return (
    <>
      <StatusBar backgroundColor={appcolor} />
      <View style={styles.container}>
        {/* <TopBar /> */}
        <AuthContextFunction>
          <SelectRoleContext>
            <SelectorInputsContext>
            <Router />
            </SelectorInputsContext>
          </SelectRoleContext>
        </AuthContextFunction>
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

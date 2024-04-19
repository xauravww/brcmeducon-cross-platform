import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import StudentDash from '../components/StudentDash'
import Event from '../components/Event'
import StudentAttendance from '../components/StudentAttendance'
const stack = createNativeStackNavigator()
export default function StudentStack() {
  return (
   <stack.Navigator>
    <stack.Screen name='StudentDash' component={StudentDash} ></stack.Screen>
    <stack.Group>
      <stack.Screen name="ShowEvents" component={Event}/>
      <stack.Screen name="StudentAttendance" component={StudentAttendance}/>

    </stack.Group>
   </stack.Navigator>
  )
}

const styles = StyleSheet.create({})
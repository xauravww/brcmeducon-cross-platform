import { StyleSheet, Text, View , Button } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AdminDash from '../components/AdminDash'
import ManageEvents from '../components/ManageEvents'
import Event from '../components/Event'
import { appcolor } from '../constants'
import { useNavigation } from '@react-navigation/native'
import FacultyDash from '../components/FacultyDash'
import SendAssignments from '../components/SendAssignments'
import ManageAttendance from '../components/ManageAttendance'
import CreateAttendanceScreen from '../components/CreateAttendanceScreen'
export default function FacultyStack() {
  const stack = createNativeStackNavigator()
  const navigation = useNavigation()
  return (
   <stack.Navigator>
    <stack.Screen name='FacultyDash'  component={FacultyDash}/> 
    <stack.Group>
    <stack.Screen name='SendAssignments'  component={SendAssignments}  options={{
            title: 'Send Assignmnets',
            headerRight: () => (
              <Button
                onPress={() => navigation.navigate("SendAssignments")}
                title="Add New"
                color={appcolor}
              />
            ),
          }}/> 
    <stack.Screen name='ManageAttendance'  component={ManageAttendance}  options={{
            title: 'Manage Attendance',
            headerRight: () => (
              <Button
                onPress={() => navigation.navigate("CreateAttendanceScreen")}
                title="Add New"
                color={appcolor}
              />
            ),
          }}/>
        
    </stack.Group>
    <stack.Screen name='CreateAttendanceScreen'  component={CreateAttendanceScreen}/>  
   </stack.Navigator>
  )
}

const styles = StyleSheet.create({})
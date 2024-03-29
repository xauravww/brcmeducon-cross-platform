import { StyleSheet, Text, View , Button } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AdminDash from '../components/AdminDash'
import ManageEvents from '../components/ManageEvents'
import Event from '../components/Event'
import { appcolor } from '../constants'
import { useNavigation } from '@react-navigation/native'
export default function AdminStack() {
  const stack = createNativeStackNavigator()
  const navigation = useNavigation()
  return (
   <stack.Navigator>
    <stack.Screen name='AdminDash'  component={AdminDash}/> 
    <stack.Group>
    <stack.Screen name='Events'  component={Event}  options={{
            title: 'Manage Events',
            headerRight: () => (
              <Button
                onPress={() => navigation.navigate("ManageEvents")}
                title="Add New"
                color={appcolor}
              />
            ),
          }}/> 
    <stack.Screen name='ManageEvents'  component={ManageEvents} /> 
    </stack.Group>
    
   </stack.Navigator>
  )
}

const styles = StyleSheet.create({})
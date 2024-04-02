import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import Login from '../components/Login'

const stack = createNativeStackNavigator()
export default function AuthStack() {
  return (
  
    <stack.Navigator initialRouteName='Login'>
<stack.Screen name='Login' component={Login} options={{ headerShown: false }} ></stack.Screen>
    </stack.Navigator>
 
  )
}

const styles = StyleSheet.create({})
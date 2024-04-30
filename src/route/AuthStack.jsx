import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import Login from '../components/Login'
import { authContext } from '../context/AuthContextFunction'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ForgotPassword from '../components/ForgotPassword'

const stack = createNativeStackNavigator()
export default function AuthStack({navigation}) {
  const {authData,setAuthData} = useContext(authContext)

  useEffect(()=>{
    AsyncStorage.removeItem('auth-data')
   setAuthData({})
  },[])

  return (
  
    <stack.Navigator initialRouteName='Login'>
<stack.Screen name='Login' component={Login} options={{ headerShown: false }} ></stack.Screen>
<stack.Screen name='ForgotPassword' component={ForgotPassword} options={{ headerShown: false }} ></stack.Screen>

    </stack.Navigator>
 
  )
}

const styles = StyleSheet.create({})
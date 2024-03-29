import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { selectRoleContext } from '../context/SelectRoleContext'
import StudentStack from './StudentStack'
import { NavigationContainer } from '@react-navigation/native'
import AdminStack from './AdminStack'
import { authContext } from '../context/AuthContextFunction'
import AuthStack from './AuthStack'

export default function Router() {
  const {role,setRole} = useContext(selectRoleContext)
  const {isLoggedIn, setIsLoggedIn} = useContext(authContext)
  if(!isLoggedIn){
    return(
      <NavigationContainer>
        <AuthStack/>
      </NavigationContainer>
    )
  }
 if(role.Student){
  return(
    <NavigationContainer>
      <StudentStack/>
    </NavigationContainer>
  )
 }
 if(role.Admin){
  return(
    <NavigationContainer>
      <AdminStack/>
    </NavigationContainer>
  )
 }
   
}

const styles = StyleSheet.create({})
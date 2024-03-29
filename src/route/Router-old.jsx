import {StyleSheet, Text, View} from 'react-native';
import React, { useContext } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import StudentDash from '../components/StudentDash';
import Event from '../components/Event';
import Login from '../components/Login';
import AdminDash from '../components/AdminDash';
import ManageEvents from '../components/ManageEvents';
import {createDrawerNavigator} from '@react-navigation/drawer';
import { authContext } from '../context/AuthContextFunction';



export function StackNav() {
  const stack = createNativeStackNavigator();
  return (
    <stack.Navigator
      initialRouteName="Login"
      screenOptions={{headerShown: false}}>
      
      <stack.Screen name="Home" component={StudentDash} />
      <stack.Screen name="Event" component={Event} />
      <stack.Screen name="AdminHome" component={AdminDash} />
      <stack.Screen name="ManageEvents" component={ManageEvents} />
    </stack.Navigator>
  );
}

function Drawernav() {
  const Drawer = createDrawerNavigator();
  return (
    <Drawer.Navigator screenOptions={{headerTitleAlign: 'center'}}>
      <Drawer.Screen name="StackNav" component={StackNav} />
    </Drawer.Navigator>
  );
}

function LoginSignUpStack(){
  const stack = createNativeStackNavigator();
 return(
  <stack.Navigator>
  <stack.Screen name="Login" component={Login}/>
    </stack.Navigator>
 )
}

export default function Router() {
  const {isLoggedIn} = useContext(authContext)
 if(isLoggedIn){
  return (
    <NavigationContainer>
      <Drawernav />
    </NavigationContainer>
  )
 }else{
  return(
    <NavigationContainer>
 <LoginSignUpStack/>
</NavigationContainer>
  );
 }
}

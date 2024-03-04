import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import StudentDash from '../components/StudentDash'
import Event from '../components/Event'

const stack = createNativeStackNavigator()
export default function Router() {


  return (
      <NavigationContainer>
          <stack.Navigator >
              <stack.Screen  name='Home' component={StudentDash}/>
              <stack.Screen name='Event' component={Event}/>
        </stack.Navigator>
     </NavigationContainer>
  )
}


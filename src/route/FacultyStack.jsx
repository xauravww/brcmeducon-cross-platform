import React, { useContext ,useEffect} from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { authContext } from '../context/AuthContextFunction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FacultyDash from '../components/FacultyDash';
import SendAssignments from '../components/SendAssignments';
import ManageAttendance from '../components/ManageAttendance';
import CreateAttendanceScreen from '../components/CreateAttendanceScreen';
import { appcolor } from '../constants';
import SelectRoleContext, { selectRoleContext } from '../context/SelectRoleContext';
import IDCard from '../components/IDCard';
import Event from '../components/Event';
import TimeTable from "../components/TimeTable"
const Drawer = createDrawerNavigator();
const stack = createNativeStackNavigator();

const FacultyHomeStack = () => {
  const navigation = useNavigation();
 
  return (
    <stack.Navigator screenOptions={{headerShown:false}}>
      <stack.Screen name='FacultyDash' component={FacultyDash} />
      <stack.Group>
        <stack.Screen name='SendAssignments' component={SendAssignments} options={{
          title: 'Send Assignmnets',
          headerRight: () => (
            <Button
              onPress={() => navigation.navigate("SendAssignments")}
              title="Add New"
              color={appcolor}
            />
          ),
        }} />
        <stack.Screen name='ManageAttendance' component={ManageAttendance} options={{
          title: 'Manage Attendance',
          headerRight: () => (
            <Button
              onPress={() => navigation.navigate("CreateAttendanceScreen")}
              title="Add New"
              color={appcolor}
            />
          ),
        }} />

      </stack.Group>
      <stack.Screen name='CreateAttendanceScreen' component={CreateAttendanceScreen} />
      <stack.Screen name='IDCard' component={IDCard} />
      <stack.Screen name='Events' component={Event} />
      <stack.Screen name='TimeTable' component={TimeTable} />
    </stack.Navigator>
  )
};

export default function FacultyStack() {
  const navigation = useNavigation();
  const { navigationState ,setNavigationState} = useContext(selectRoleContext);
useEffect(() => {
  console.log("faculty navigation.getState()")
  console.log(navigation.getState())

}, [navigation])

  return (
    <Drawer.Navigator initialRouteName={navigationState || 'FacultyHome'}
      drawerContent={({ navigation }) => <CustomDrawerContent navigation={navigation} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#dadada',
          width: 240,
        },
headerTitle:navigationState || 'FacultyHome'
        ,
        headerRight: () => {
          if (navigationState === 'ManageAttendance') {
            return (
              <Button
                onPress={() => navigation.navigate("CreateAttendanceScreen")}
                title={"Add New"}
                color={appcolor}
              />
            );
          } else {
            return null; 
          }
        },
        drawerType: 'slide',
        drawerHideStatusBarOnOpen: true,
        swipeEnabled: true,
        swipeEdgeWidth: 100,
        gestureHandlerProps: {
          onGestureEvent: ({ nativeEvent }) => {
            if (nativeEvent.absoluteX > 100 && nativeEvent.velocityX > 0.5) {
              console.log('Swiped to open drawer');
              navigation.dispatch(DrawerActions.openDrawer());
            } else if (nativeEvent.absoluteX < 50 && nativeEvent.velocityX < -0.5) {
              console.log('Swiped to close drawer');
              navigation.dispatch(DrawerActions.closeDrawer());
            }
          }
        },
        headerStyle: {
          backgroundColor: appcolor, 
         
        },
        headerTitleStyle:{
          color:"#ffffff"
        },
        headerTintColor: "#ffffff", 
      }
    }
    >
      <Drawer.Screen name='FacultyHome' component={FacultyHomeStack} />
    </Drawer.Navigator>
  );
}

function CustomDrawerContent({ navigation }) {
  const { setAuthData, setIsLoggedIn, setlogOutMsg,authData } = useContext(authContext);

  const handleLogout = () => {
    AsyncStorage.clear().then(()=>{
      setIsLoggedIn(false)
      setAuthData({})
    })
  };


  return (
    <View>
     <TouchableOpacity style={{ height: 55,backgroundColor:appcolor,justifyContent:"center",alignItems:"center"}}
 onPress={() => {
  // Navigate using the `navigation` prop that you received
  navigation.navigate('FacultyDash');
}}
>
    <Text style={{color:"white",fontSize:20}}>CLOSE</Text>
</TouchableOpacity>

      <View style={{ backgroundColor: "#ccc", height: "45%" }}>
        <Image
          source={require('../assets/images/brcm_logo_big.png')}
          style={{ height: 200, width: 200, marginLeft: 20 }}
        />
      </View>
      <TouchableOpacity
        onPress={() => {
          setlogOutMsg('You have been logged out');
          handleLogout();
        }}
      >
        <View style={{ backgroundColor: "#ccc", marginTop: 10 }}>
          <Text style={{ color: "black", fontSize: 20, fontFamily: "NotoSans_Condensed-Regular", padding: 10 }}>
            Log Out
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // Add your styles here
});

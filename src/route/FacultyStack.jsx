import React, { useContext } from 'react';
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

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const FacultyHomeStack = () => {
  const navigation = useNavigation();
  
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='FacultyDash' component={FacultyDash} />
      <Stack.Screen name='SendAssignments' component={SendAssignments} />
      <Stack.Screen name='ManageAttendance' component={ManageAttendance} />
      <Stack.Screen name='CreateAttendanceScreen' component={CreateAttendanceScreen} />
    </Stack.Navigator>
  );
};

export default function FacultyStack() {
  const navigation = useNavigation();

  return (
    <Drawer.Navigator initialRouteName='FacultyHome'
      drawerContent={({ navigation }) => <CustomDrawerContent navigation={navigation} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#dadada',
          width: 240,
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
        }
      }}
    >
      <Drawer.Screen name='FacultyHome' component={FacultyHomeStack} />
    </Drawer.Navigator>
  );
}

function CustomDrawerContent({ navigation }) {
  const { setAuthData, setIsLoggedIn, setlogOutMsg } = useContext(authContext);

  const handleLogout = async () => {
    try {
      // Remove auth-data from AsyncStorage
      await AsyncStorage.removeItem('auth-data').then(()=>{
        setAuthData({}); // Clear authData
        setIsLoggedIn(false); // Set isLoggedIn to false
      });
    } catch (e) {
      console.error("Error removing value:", e);
    }
  };

  

  return (
    <View>
      <Button
        title="Close"
        onPress={() => {
          navigation.navigate('FacultyHome');
        }}
      />

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

import React, { useContext } from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import StudentDash from '../components/StudentDash';
import Event from '../components/Event';
import StudentAttendance from '../components/StudentAttendance';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { authContext } from '../context/AuthContextFunction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Login from '../components/Login';
import IDCard from '../components/IDCard';
import { appcolor } from '../constants';
import TimeTable from "../components/TimeTable"
import { selectRoleContext } from '../context/SelectRoleContext';
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => {
  const navigation = useNavigation()
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('drawerItemPress', (e) => {
      // Prevent default behavior
      e.preventDefault();
      console.log(e)
      // Do something manually
      // ...
    });

    return unsubscribe;
  }, [navigation]);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='StudentDash' component={StudentDash} />
      <Stack.Group>
        <Stack.Screen name='ShowEvents' component={Event} />
        <Stack.Screen name='StudentAttendance' component={StudentAttendance} />
        <Stack.Screen name='IDCard' component={IDCard} />
        <Stack.Screen name='TimeTable' component={TimeTable} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default function StudentStack({ }) {
  const navigation = useNavigation()
  const { navigationState ,setNavigationState} = useContext(selectRoleContext);
  return (
    <Drawer.Navigator initialRouteName='Home'
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
            // Custom gesture handling logic
            if (nativeEvent.absoluteX > 100 && nativeEvent.velocityX > 0.5) {
              console.log('Swiped to open drawer');
              console.log(navigation.getCurrentRoute())
              navigation.dispatch(DrawerActions.openDrawer());
            } else if (nativeEvent.absoluteX < 50 && nativeEvent.velocityX < -0.5) {
              console.log('Swiped to close drawer');
              console.log(navigation.getCurrentRoute())
              navigation.dispatch(DrawerActions.closeDrawer());
            }
          }
        },
        headerStyle: {
          backgroundColor: appcolor,

        },
        headerTitleStyle: {
          color: "#ffffff"
        },
        headerTintColor: "#ffffff",
        headerTitle:navigationState || "StudentDash"
      }}
    >
      <Drawer.Screen name='Home' component={HomeStack} />
    </Drawer.Navigator>
  );
}

function CustomDrawerContent({ navigation }) {
  const handleLogout = () => {
    AsyncStorage.clear().then(()=>{
      setIsLoggedIn(false)
      setAuthData({})
    })
  };
  const { authData, setAuthData, setIsLoggedIn, setlogOutMsg } = useContext(authContext)
  return (
    <View>


      <TouchableOpacity style={{ height: 55, backgroundColor: appcolor, justifyContent: "center", alignItems: "center" }}
        onPress={() => {
          // Navigate using the `navigation` prop that you received
          navigation.navigate('Home');
        }}
      >
        <Text style={{ color: "white", fontSize: 20 }}>CLOSE</Text>
      </TouchableOpacity>

      <View style={{ backgroundColor: "#ccc", height: "45%" }}>
        <Image
          source={require('../assets/images/brcm_logo_big.png')}
          style={{ height: 200, width: 200, marginLeft: 20 }}
        />
      </View>
      <TouchableOpacity
        onPress={() => {
          // Navigate using the `navigation` prop that you received

          setlogOutMsg('You have been logged out')
          handleLogout()
          //  navigation.navigate('Home');
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

import React, { useContext } from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { authContext } from '../context/AuthContextFunction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AdminDash from '../components/AdminDash';
import ManageEvents from '../components/ManageEvents';
import Event from '../components/Event';
import MembersComponent from '../components/MembersComponent';
import ManageMembers from '../components/ManageMembers'
import { appcolor } from '../constants';
import { selectRoleContext } from '../context/SelectRoleContext';
import IDCard from '../components/IDCard';

const Drawer = createDrawerNavigator();
const stack = createNativeStackNavigator();

const AdminHomeStack = () => {
  const navigation = useNavigation();
  const { authData } = useContext(authContext);
  return (
    <stack.Navigator screenOptions={{ headerShown: false }}>
      <stack.Screen name='AdminDash' component={AdminDash} />

      <stack.Screen name='Events' component={Event} options={{
        title: 'Manage Events',
        headerRight: () => (
          <Button
            onPress={() => navigation.navigate("ManageEvents", { role: authData.member.role })}
            title="Add New"
            color={appcolor}
          />
        ),
      }} />
      <stack.Screen name='ManageEvents' component={ManageEvents} />
      <stack.Screen name='MembersComponent' component={MembersComponent}
      
        options={{
          title: 'Manage Events',
          headerRight: () => (
            <Button
              onPress={() => navigation.navigate("ManageMembers")}
              title="Add New"
              color={appcolor}
            />
          ),
        }} />

      <stack.Screen name='ManageMembers' component={ManageMembers} />
      <stack.Screen name='IDCard' component={IDCard}/>
    </stack.Navigator>
  );
};

export default function AdminStack() {
  const navigation = useNavigation();
  const { navigationState, setNavigationState } = useContext(selectRoleContext);
  return (
    <Drawer.Navigator initialRouteName={navigationState || 'AdminHome'}
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
        },
        headerTitle: navigationState,
        headerRight: () => {
          if (navigationState === 'Events') {
            return (
              <Button
                onPress={() => navigation.navigate("ManageEvents")}
                title={"Add New"}
                color={appcolor}
              />
            );
          } 
          else if(navigationState=='MembersComponent'){
            return (
              <Button
                onPress={() => navigation.navigate("ManageMembers")}
                title={"Add New"}
                color={appcolor}
              />
            );
          }
          
          else {
            return null;
          }
        },
        headerStyle: {
          backgroundColor: appcolor, 
         
        },
        headerTitleStyle:{
          color:"#ffffff"
        },
        headerTintColor: "#ffffff", 
      }}
    >
      <Drawer.Screen name='AdminHome' component={AdminHomeStack} />
    </Drawer.Navigator>
  );
}

function CustomDrawerContent({ navigation }) {
  const { setAuthData, setIsLoggedIn, setlogOutMsg } = useContext(authContext);

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
  navigation.navigate('AdminDash');
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

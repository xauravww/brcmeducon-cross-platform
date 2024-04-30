import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import StudentStack from './StudentStack';
import AdminStack from './AdminStack';
import AuthStack from './AuthStack';
import FacultyStack from './FacultyStack';
import { selectRoleContext } from '../context/SelectRoleContext';
import { authContext } from '../context/AuthContextFunction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from '../components/SplashScreen';

export default function Router() {
  const { role, setRole } = useContext(selectRoleContext);
  const { isLoggedIn, setIsLoggedIn, setAuthData,authData } = useContext(authContext);
  const [isLoading, setIsLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('auth-data');
        if (value !== null) {
          const parsedData = JSON.parse(value);
          setAuthData(parsedData);
          setRole(() => {
            if (parsedData.member.role == 'admin') return {
              Student: false, Faculty: false, Admin: true
            }
            if (parsedData.member.role == 'student') return {
              Student: true, Faculty: false, Admin: false
            }
            if (parsedData.member.role == 'faculty') return {
              Student: false, Faculty: true, Admin: false
            }
          })
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false); // Set to false if no auth-data is found
          setAuthData({}); // Clear authData
        }
      } catch (e) {
        console.error("Error reading value:", e);
      } finally {
        setIsLoading(false);
        setTimeout(() => {
          setShowSplash(false);
        }, 300);
      }
    };

    getData();
  }, []);



  const childrenItems = () => {
    if (showSplash) {
      return <SplashScreen />
    }



    if (!isLoggedIn) {
      return <AuthStack />;
    }
    if (role.Student) {
      return <StudentStack />;
    }
    if (role.Admin) {
      return <AdminStack />;
    }
    if (role.Faculty) {
      return <FacultyStack />;
    }
  };

  return (
    <NavigationContainer>
      {childrenItems()}
    </NavigationContainer>
  );
}

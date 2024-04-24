import AsyncStorage from "@react-native-async-storage/async-storage";
import { authContext } from "../context/AuthContextFunction";
import { useContext } from "react";



export const handleLogout = async (message) => {
    const {setAuthData,setIsLoggedIn } = useContext(authContext)
    try {
      // Remove auth-data from AsyncStorage
      await AsyncStorage.removeItem('auth-data').then(() => {
        setAuthData({}); // Clear authData
        setIsLoggedIn(false); // Set isLoggedIn to false
        setlogOutMsg(message)
      });
    } catch (e) {
      console.error("Error removing value:", e);
    }}
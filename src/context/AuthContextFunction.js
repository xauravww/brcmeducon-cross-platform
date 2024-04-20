import { createContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authContext = createContext();

export default function AuthContextFunction({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [authData, setAuthData] = useState({});
    const [logOutMsg, setlogOutMsg] = useState('');

    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('auth-data');
            console.log("we get this authdata stored ", value);
            if (value !== null && value !== undefined) {
                // value previously stored
                setIsLoggedIn(true);
                setAuthData(JSON.parse(value)); // Parse the stored string to object
            } else {
                setIsLoggedIn(false); // Set to false if auth-data is null or undefined
                setAuthData({});
            }
        } catch (e) {
            console.error("Error reading value:", e);
        }
    };

    useEffect(() => {
        getData();
    }, []); // Empty dependency array means this effect runs once when the component mounts

    const data = {
        isLoggedIn,
        setIsLoggedIn,
        authData,
        logOutMsg,
        setlogOutMsg,
        setAuthData,
    };

    return (
        <authContext.Provider value={data}>
            {children}
        </authContext.Provider>
    );
}

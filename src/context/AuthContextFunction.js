import { createContext, useState } from "react";

export const authContext = createContext()

export default function AuthContextFunction({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const data = {
        isLoggedIn, setIsLoggedIn
    }
    return(
        <authContext.Provider value={data} >
        {children}
    </authContext.Provider>
    )
    
}
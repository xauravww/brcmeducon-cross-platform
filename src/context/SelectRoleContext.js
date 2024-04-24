import { createContext, useState ,useEffect } from "react"

export const selectRoleContext = createContext()

function SelectRoleContext({children}) {
  useEffect(() => {
  console.log("Chnaged role:",role)
  }, [role])
  
 const [role,setRole]=useState({
  Student:true,Faculty:false,Admin:false
 })
 //to check which screen is opened , so that we can control our header btns
 const [navigationState, setNavigationState] = useState('')
 const data = {
    role,setRole,navigationState,setNavigationState
 }
    return (
  <selectRoleContext.Provider value={data}>
{children}
  </selectRoleContext.Provider>
  )
}

export default SelectRoleContext

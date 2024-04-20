import { createContext, useState ,useEffect } from "react"

export const selectRoleContext = createContext()

function SelectRoleContext({children}) {
  useEffect(() => {
  console.log("Chnaged role:",role)
  }, [role])
  
 const [role,setRole]=useState({
  Student:true,Faculty:false,Admin:false
 })
 const data = {
    role,setRole
 }
    return (
  <selectRoleContext.Provider value={data}>
{children}
  </selectRoleContext.Provider>
  )
}

export default SelectRoleContext

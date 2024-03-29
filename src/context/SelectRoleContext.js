import { createContext, useState } from "react"

export const selectRoleContext = createContext()

function SelectRoleContext({children}) {
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

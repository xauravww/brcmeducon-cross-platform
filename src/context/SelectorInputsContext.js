import { createContext, useState ,useEffect } from "react"

export const selectInputContext = createContext()

export default function SelectorInputsContext({children}) {


  const [branchFilter, setBranchFilter] = useState(null);
  const [semesterFilter, setSemesterFilter] = useState(null);
  const [dateFilter, setDateFilter] = useState(new Date());
  const [subjectFilter, setSubjectFilter] = useState(null);
  const [attendanceChanged, setAttendanceChanged] = useState(false);

 const data = {
    branchFilter, setBranchFilter,semesterFilter, setSemesterFilter,dateFilter, setDateFilter,subjectFilter, setSubjectFilter,attendanceChanged, setAttendanceChanged
 }
    return (
  <selectInputContext.Provider value={data}>
{children}
  </selectInputContext.Provider>
  )
}


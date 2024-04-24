const SUBJECTS_ARR = {
    Sem8: {
      CSE: ['PROJECT-III', 'ML', 'BDA', 'WL&SN'],
      CIVIL: ['EC&V', 'GT', 'SD', 'S&HWM'],
      EE: ['SEM', 'STA', 'SEA'],
      ME: ['IA', 'PME', 'PPE', 'AE', 'QE'],
    },
  };
  
  export const fetchSubjectArr = async (branch, sem) => {
    const subjects = SUBJECTS_ARR[sem]?.[branch];
    return subjects ? [...subjects] : ['No Sub Found'];
  };
  
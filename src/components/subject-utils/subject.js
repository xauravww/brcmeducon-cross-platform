const SUBJECTS_ARR = {
    Sem8: {
      Cse: ['PROJECT-III', 'ML', 'BDA', 'WL&SN'],
      Ce: ['EC&V', 'GT', 'SD', 'S&HWM'],
      Ee: ['SEM', 'STA', 'SEA'],
      Me: ['IA', 'PME', 'PPE', 'AE', 'QE'],
    },
  };
  
  export const fetchSubjectArr = async (branch, sem) => {
    const subjects = SUBJECTS_ARR[sem]?.[branch];
    return subjects ? [...subjects] : ['No Sub Found'];
  };
  
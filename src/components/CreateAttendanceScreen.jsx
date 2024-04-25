import React, { useState, useEffect, useContext } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import { Button, RadioButton, Text, Title, Snackbar } from 'react-native-paper';
import SelectDropdown from 'react-native-select-dropdown';
import axios from 'axios';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-date-picker';
import { appcolor } from '../constants';
import moment from 'moment';
import { fetchSubjectArr } from './subject-utils/subject';
import API_URL from '../connection/url';
import { selectRoleContext } from '../context/SelectRoleContext';
import { selectInputContext } from '../context/SelectorInputsContext';
import { authContext } from '../context/AuthContextFunction';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateAttendanceScreen = ({ route, navigation }) => {
  const {
    date,
    attendanceDataId,
    editAttendance,
    attendanceData,
  } = route.params || {
    editAttendance: false,
  };
  
  const {
    branchFilter,
    setBranchFilter,
    semesterFilter,
    setSemesterFilter,
    dateFilter,
    setDateFilter,
    subjectFilter,
    setSubjectFilter,
    attendanceChanged, setAttendanceChanged
  } = useContext(selectInputContext);

  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState({});
  const [dateState, setDateState] = useState(dateFilter || new Date());
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setNavigationState } = useContext(selectRoleContext);

  const { authData, setAuthData, setIsLoggedIn } = useContext(authContext);

  const handleLogout = async (message) => {
    try {
      await AsyncStorage.removeItem('auth-data');
      setAuthData({});
      setIsLoggedIn(false);
      console.log(message);
    } catch (e) {
      console.error("Error removing value:", e);
    }
  }

  useEffect(() => {
    setNavigationState('CreateAttendance')
  })

  useEffect(() => {
    if (attendanceData) {
      const initialStatus = {};
      attendanceData[0].attendanceData.forEach((member) => {
        initialStatus[member.memberId] = member.status.charAt(0).toUpperCase() + member.status.slice(1);
      });
      setSelectedMembers(initialStatus);
    }
  }, [attendanceData]);

  useEffect(() => {
    const fetchMembers = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/api/v1/admin/members`,{
          headers: {
            'Authorization': `Bearer ${authData?.token}`
          }
        });
        if (response.data.success) {
          const filteredMembers = response.data.users.filter((user) => user.branch === branchFilter && user.semester === semesterFilter);
          const sortedMembers = filteredMembers.sort((a, b) => a.rollno.localeCompare(b.rollno));
          setMembers(sortedMembers);
        }
      } catch (error) {
        console.error('Failed to fetch members:', error);
        if(err.response.status==404){
          handleLogout("Please Login Again ...")
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (branchFilter && semesterFilter) {
      fetchMembers();
    }
  }, [branchFilter, semesterFilter]);

  useEffect(() => {
    if (branchFilter && semesterFilter && subjectFilter && dateFilter && attendanceData) {
      setDateState(new Date(dateFilter));
    }
    setNavigationState('CreateAttendance');
  }, [branchFilter, semesterFilter, subjectFilter, dateFilter]);

  const handleRadioButtonChange = (userId, status) => {
    setSelectedMembers((prevSelected) => ({
      ...prevSelected,
      [userId]: status.charAt(0).toUpperCase() + status.slice(1),
    }));
  };

  const handleMarkAll = (status) => {
    const allMembers = {};
    members.forEach((member) => {
      allMembers[member._id] = status.charAt(0).toUpperCase() + status.slice(1);
    });
    setSelectedMembers(allMembers);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const attendanceDataToSend = members.map((member) => ({
        memberId: member._id,
        name: member.name,
        rollno: member.rollno,
        status: selectedMembers[member._id] === 'Present' ? 'Present' : 'Absent',
        remarks: 'none',
      }));

      if (!subjectFilter) {
        setSnackbarMessage('Subject is required');
        setSnackbarVisible(true);
        setIsLoading(false);
        return;
      }

      const formattedDate = moment(dateFilter).format('YYYY-MM-DD');

      const requestBody = {
        attendanceData: attendanceDataToSend,
        date: formattedDate,
        branch: branchFilter,
        semester: semesterFilter,
        subject: subjectFilter,
        id: attendanceDataId,
        token:authData?.token
      };

      let endpoint = `${API_URL}/api/v1/faculty/attendance`;

      if (editAttendance) {
        endpoint += '/update';
      }

      const requestMethod = editAttendance ? 'put' : 'post';

      const response = await axios({
        method: requestMethod,
        url: endpoint,
        data: requestBody,
      });

      if (response.data.success) {
        setSnackbarMessage('Attendance updated successfully');
        setSnackbarVisible(true);
        setIsLoading(false);
        setAttendanceChanged(true)
        navigation.goBack();
      } else {
        setSnackbarMessage('Failed to update attendance');
        setSnackbarVisible(true);
        setIsLoading(false);
      }
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : 'Failed to update attendance';
      setSnackbarMessage(errorMessage);
      setSnackbarVisible(true);
      setIsLoading(false);
  
      if (error.response && error.response.status === 404) {
        handleLogout("Please Login Again ...");
      }
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${API_URL}/api/v1/faculty/attendance/${attendanceDataId}`,{
        headers: {
          'Authorization': `Bearer ${authData?.token}`
        }
      });

      if (response.data.success) {
        setSnackbarMessage('Attendance deleted successfully');
        setSnackbarVisible(true);
      } else {
        setSnackbarMessage('Failed to delete attendance');
        setSnackbarVisible(true);
      }
    } catch (error) {
      console.error('Error details:', error.response ? error.response.data : error);
      setSnackbarMessage('Failed to delete attendance');
      setSnackbarVisible(true);

      if(err.response.status==404){
        handleLogout("Please Login Again ...")
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>{editAttendance !== undefined && !editAttendance ? 'Create Attendance' : 'Edit Attendance'}</Title>

      <View style={styles.pickerContainer}>
        <MaterialCommunityIcons name="calendar" color={'black'} size={30} />
        <DatePicker
          date={dateFilter || new Date()}
          onDateChange={setDateFilter}
          mode="date"
          style={styles.datePicker}
          theme='light'
        />
      </View>

      <View style={styles.pickerContainer}>
        <Ionicons name="school-outline" color={'black'} size={30} />
        <SelectDropdown
          data={['Sem1', 'Sem2', 'Sem3', 'Sem4', 'Sem5', 'Sem6', 'Sem7', 'Sem8']}
          onSelect={(selectedItem, index) => setSemesterFilter(selectedItem)}
          defaultButtonText={semesterFilter || 'Select Semester'}
          buttonTextAfterSelection={(selectedItem) => selectedItem}
          rowTextForSelection={(item) => item}
          style={styles.picker}
        />
      </View>

      <View style={styles.pickerContainer}>
        <Ionicons name="school-outline" color={'black'} size={30} />
        <SelectDropdown
          data={['CSE', 'CIVIL', 'EE', 'ME']}
          onSelect={(selectedItem, index) => setBranchFilter(selectedItem)}
          defaultButtonText={branchFilter || 'Select Branch'}
          buttonTextAfterSelection={(selectedItem) => selectedItem}
          rowTextForSelection={(item) => item}
          style={styles.picker}
        />
      </View>

      <View style={styles.pickerContainer}>
        <MaterialCommunityIcons name="book" color={'black'} size={30} />
        <SelectDropdown
          data={fetchSubjectArr(branchFilter, semesterFilter)._j}
          onSelect={(selectedItem, index) => setSubjectFilter(selectedItem)}
          defaultButtonText={subjectFilter || 'Select Subject'}
          buttonTextAfterSelection={(selectedItem) => selectedItem}
          rowTextForSelection={(item) => item}
          style={styles.picker}
        />
      </View>

      {isLoading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />
      ) : (
        <View style={styles.membersContainer}>
          {members.map((member) => (
            <View key={member._id} style={styles.memberItem}>
              <Text style={styles.rollNo}>{member.rollno}</Text>
              <Text style={styles.memberName}>{member.name}</Text>
              <View style={styles.radioButtonContainer}>
                <RadioButton
                  value="Present"
                  status={selectedMembers[member._id] === 'Present' ? 'checked' : 'unchecked'}
                  onPress={() => handleRadioButtonChange(member._id, 'Present')}
                />
                <Text>Present</Text>
                <RadioButton
                  value="Absent"
                  status={selectedMembers[member._id] === 'Absent' ? 'checked' : 'unchecked'}
                  onPress={() => handleRadioButtonChange(member._id, 'Absent')}
                />
                <Text>Absent</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.markAllButton} onPress={() => handleMarkAll('Present')}>
          <Text style={styles.buttonText}>Mark All Present</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.markAllButton, { backgroundColor: 'red' }]} onPress={() => handleMarkAll('Absent')}>
          <Text style={styles.buttonText}>Mark All Absent</Text>
        </TouchableOpacity>
      </View>

      {!editAttendance && (
        <TouchableOpacity style={[styles.button,{marginBottom:50}]} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Mark Attendance</Text>
        </TouchableOpacity>
      )}
      {editAttendance && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' ,marginBottom:50 }}>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Edit Attendance</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: 'red' }]} onPress={handleDelete}>
            <Text style={styles.buttonText}>Delete All</Text>
          </TouchableOpacity>
        </View>
      )}

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={Snackbar.DURATION_SHORT}
        style={styles.snackbar}
      >
        {snackbarMessage}
      </Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#dadada',
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
  },
  picker: {
    flex: 1,
    marginLeft: 10,
  },
  datePicker: {
    flex: 1,
  },
  membersContainer: {
    marginTop: 20,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  rollNo: {
    marginRight: 10,
  },
  memberName: {
    flex: 1,
    marginRight: 10,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
  },
  markAllButton: {
    flex: 1,
    marginRight: 10,
    backgroundColor: appcolor,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    height: 50,
  },
  button: {
    marginTop: 20,
    backgroundColor: appcolor,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    height: 50,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal:5
  },
  loader: {
    marginTop: 20,
  },
  snackbar: {
    top: 0, 
    marginBottom:Dimensions.get("window").height/2, 
  },
});

export default CreateAttendanceScreen;

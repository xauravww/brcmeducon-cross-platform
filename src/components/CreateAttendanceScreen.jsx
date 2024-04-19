import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Button, RadioButton, Text, Title, Snackbar } from 'react-native-paper';
import SelectDropdown from 'react-native-select-dropdown';
import axios from 'axios';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-date-picker';
import { appcolor } from '../constants';
import moment from 'moment';
import { fetchSubjectArr } from './subject-utils/subject';
import {API_URL} from "@env"
const CreateAttendanceScreen = ({ route, navigation }) => {
  const {
    branchFilter,
    date,
    subjectFilter,
    semesterFilter,
    attendanceDataId,
    editAttendance,
    attendanceData,
  } = route.params || {
    editAttendance: false
  };

  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState({});
  const [dateState, setDateState] = useState(new Date());
  const [semester, setSemester] = useState('');
  const [branch, setBranch] = useState('');
  const [subject, setSubject] = useState('');
  const [subjectArr, setsubjectArr] = useState([])
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if(attendanceData){
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
        const response = await axios.get(`${API_URL}/api/v1/admin/members`);
        if (response.data.success) {
          const filteredMembers = response.data.users.filter((user) => user.branch === branch && user.semester === semester);
          const sortedMembers = filteredMembers.sort((a, b) => a.rollno.localeCompare(b.rollno));
          setMembers(sortedMembers);
        }
      } catch (error) {
        console.error('Failed to fetch members:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (branch && semester) {
      fetchMembers();
    }
   const arrdata = fetchSubjectArr(branch,semester)
   console.log(branch)
   console.log(semester)
   console.log(arrdata)
   setsubjectArr(arrdata)
  }, [branch, semester]);

  useEffect(() => {
    if (branchFilter && semesterFilter && subjectFilter && date && attendanceData) {
      setBranch(branchFilter);
      setSemester(semesterFilter);
      setSubject(subjectFilter);
      setDateState(new Date(date));
    }
  }, []);

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

      if (!subject) {
        setSnackbarMessage('Subject is required');
        setSnackbarVisible(true);
        setIsLoading(false);
        return;
      }

      const formattedDate = moment(dateState).format('YYYY-MM-DD');

      const requestBody = {
        attendanceData: attendanceDataToSend,
        date: formattedDate,
        branch,
        semester,
        subject,
        id: attendanceDataId,
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

        if (editAttendance) {
          navigation.goBack();
        }
      } else {
        setSnackbarMessage('Failed to update attendance');
        setSnackbarVisible(true);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error details:', error.response ? error.response.data : error);
      setSnackbarMessage('Failed to update attendance');
      setSnackbarVisible(true);
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${API_URL}/api/v1/faculty/attendance/${attendanceDataId}`);

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
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>{editAttendance !== undefined && !editAttendance ? 'Create Attendance' : 'Edit Attendance'}</Title>

      <View style={styles.pickerContainer}>
        <MaterialCommunityIcons name="calendar" color={'black'} size={25} />
        <DatePicker
          date={dateState}
          onDateChange={setDateState}
          mode="date"
          style={styles.datePicker}
          theme='light'
        />
      </View>

      <View style={styles.pickerContainer}>
        <Ionicons name="school-outline" color={'black'} size={25} />
        <SelectDropdown
          data={['Sem1', 'Sem2', 'Sem3', 'Sem4', 'Sem5', 'Sem6', 'Sem7', 'Sem8']}
          onSelect={(selectedItem, index) => setSemester(selectedItem)}
          defaultButtonText={semester || 'Select Semester'}
          buttonTextAfterSelection={(selectedItem) => selectedItem}
          rowTextForSelection={(item) => item}
          style={styles.picker}
        />
      </View>

      <View style={styles.pickerContainer}>
        <Ionicons name="school-outline" color={'black'} size={25} />
        <SelectDropdown
          data={['Cse', 'IT', 'ECE', 'ME']}
          onSelect={(selectedItem, index) => setBranch(selectedItem)}
          defaultButtonText={branch || 'Select Branch'}
          buttonTextAfterSelection={(selectedItem) => selectedItem}
          rowTextForSelection={(item) => item}
          style={styles.picker}
        />
      </View>

      <View style={styles.pickerContainer}>
        <MaterialCommunityIcons name="book" color={'black'} size={25} />
        <SelectDropdown
          data={subjectArr._j}
          onSelect={(selectedItem, index) => setSubject(selectedItem)}
          defaultButtonText={subject || 'Select Subject'}
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
        <Button mode="contained" style={styles.markAllButton} onPress={() => handleMarkAll('Present')}>
          Mark All Present
        </Button>
        <Button mode="contained" style={[styles.markAllButton, { backgroundColor: 'red' }]} onPress={() => handleMarkAll('Absent')}>
          Mark All Absent
        </Button>
      </View>

      {!editAttendance && (
        <Button mode="contained" style={styles.button} onPress={handleSubmit}>
          Mark Attendance
        </Button>
      )}
      {editAttendance && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Button mode="contained" style={styles.button} onPress={handleSubmit}>
            Edit Attendance
          </Button>
          <Button mode="contained" style={[styles.button, { backgroundColor: 'red' }]} onPress={handleDelete}>
            Delete All
          </Button>
        </View>
      )}

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={Snackbar.DURATION_SHORT}
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
  },
  button: {
    marginTop: 20,
    backgroundColor: appcolor,
    marginBottom: 20,
  },
  loader: {
    marginTop: 20,
  },
});

export default CreateAttendanceScreen;

import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, Button, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, List, Divider } from 'react-native-paper';
import axios from 'axios';
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-date-picker';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import moment from 'moment';
import { fetchSubjectArr } from './subject-utils/subject';
import API_URL from '../connection/url';
// styles
const styles = {
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
        width: '70%',
    },
};

const AttendanceScreen = ({ navigation }) => {
    const [date, setDate] = useState(new Date())
    const [refreshing, setRefreshing] = useState(false);
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [branchFilter, setBranchFilter] = useState(null);
    const [semesterFilter, setSemesterFilter] = useState(null);
    const [dateFilter, setDateFilter] = useState(null);
    const [subjectFilter, setSubjectFilter] = useState(null);
    const [subjectArr, setsubjectArr] = useState([])
    const [members, setMembers] = useState([]);
    const [membersAttendanceStatus, setmembersAttendanceStatus] = useState({});
    const [selectedMembers, setSelectedMembers] = useState([]);
    const flatListRef = useRef(null);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchAttendanceData();

        if (flatListRef.current) {
            flatListRef.current.scrollToOffset({ offset: 0, animated: true });
        }

        setRefreshing(false);
    }, []);

    useEffect(() => {
      
        const arrData = fetchSubjectArr(branchFilter,semesterFilter)
        setsubjectArr(arrData)
     
    }, [branchFilter,semesterFilter])
    

    const fetchMembersData = () => {
        axios.get(`${API_URL}/api/v1/admin/members`)
            .then(response => {
                setMembers(response.data.users);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const fetchAttendanceData = () => {
        const formattedDate = moment(date).format('YYYY-MM-DD');
        const bodyData = {
            "date": formattedDate,
            "semester": semesterFilter,
            "branch": branchFilter
        };

        axios.post(`${API_URL}/api/v1/faculty/attendance/unique`, bodyData)
            .then(response => {
                setAttendanceData(response.data.data);
                setLoading(false);

                const existingAttendanceStatus = {};

                response?.data?.data?.forEach((item) => {
                    item.attendanceData.forEach((member) => {
                        existingAttendanceStatus[member._id] = membersAttendanceStatus[member._id] || 'Present';
                    });
                });

                setmembersAttendanceStatus(existingAttendanceStatus);
 

            })
            .catch(error => {
                console.error(error);
            });
    };

    const filteredData = attendanceData.filter(
        item =>
            (!branchFilter || item.branch === branchFilter) &&
            (!semesterFilter || item.semester === semesterFilter) &&
            (!dateFilter || moment(item.date).format('YYYY-MM-DD') === moment(dateFilter).format('YYYY-MM-DD')) &&
            (!subjectFilter || item.subject === subjectFilter)
    );

    const renderItem = ({ item }) => (
        <Card style={{ margin: 10, padding: 10 }}>
            <Card.Content>
                <View style={{ justifyContent: "space-between", flexDirection: "row", alignItems: "center" }}>
                    <Title><Text>{item.subject}</Text></Title>
                    <TouchableOpacity onPress={() => navigation.navigate("CreateAttendanceScreen", { editAttendance: true, branchFilter, semesterFilter, date: date.toISOString(), subjectFilter, attendanceDataId: attendanceData[0]?._id, attendanceData })}>
                        <Icon name="pencil-outline" color="green" size={20} />
                    </TouchableOpacity>
                </View>
                <Paragraph>Date: {new Date(item.date).toDateString()}</Paragraph>
                <Paragraph>Branch: {item.branch}</Paragraph>
                <Paragraph>Semester: {item.semester}</Paragraph>
                <Divider />
                <List.Section>
                    <List.Subheader>Attendance Data</List.Subheader>
                    {item.attendanceData.map((data, index) => (
                        <View key={index} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ color: "black" }}>{`${data.rollno}- ${data.name}`}</Text>
                            {data.status === 'Present' ? (
                                <Icon name="checkmark-circle-outline" color="green" size={20} />
                            ) : (
                                <Icon name="close-circle-outline" color="red" size={20} />
                            )}
                        </View>
                    ))}
                </List.Section>
            </Card.Content>
        </Card>
    );

    useEffect(() => {
        fetchMembersData();
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={['#9Bd35A', '#689F38']}
                    progressBackgroundColor="#fff"
                />
            }
        >
            <View style={styles.pickerContainer}>
                <Icon name="school-outline" color={'black'} size={25} />
                <SelectDropdown
                    data={['Cse', 'Branch', 'OtherBranches']}
                    onSelect={(selectedItem, index) => {
                        setBranchFilter(selectedItem);
                    }}
                    defaultButtonText="Select Branch"
                    style={styles.picker}
                />
            </View>
            <View style={styles.pickerContainer}>
                <Icon name="calendar-outline" color={'black'} size={25} />
                <SelectDropdown
                    data={['Sem1', 'Sem2', 'Sem3', 'Sem4', 'Sem5', 'Sem6', 'Sem7', 'Sem8']}
                    onSelect={(selectedItem, index) => {
                        setSemesterFilter(selectedItem);
                    }}
                    defaultButtonText="Select Semester"
                    style={styles.picker}
                />
            </View>
            <View style={styles.pickerContainer}>
                <Icon name="calendar-outline" color={'black'} size={25} />
                <SelectDropdown
                    data={subjectArr._j}
                    onSelect={(selectedItem, index) => {
                        setSubjectFilter(selectedItem);
                    }}
                    defaultButtonText="Select Subject"
                    style={styles.picker}
                />
            </View>
            <View style={styles.pickerContainer}>
                <Icon name="calendar" color={'black'} size={25} />
                <DatePicker
                    date={date}
                    onDateChange={setDate}
                    mode="date"
                    style={styles.datePicker}
                    theme='light'
                />
            </View>
            <Button title="Fetch Data" onPress={fetchAttendanceData} />
            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Title>Loading...</Title>
                </View>
            ) : (
                <FlatList
                    ref={flatListRef}
                    data={filteredData}
                    renderItem={renderItem}
                    keyExtractor={(item) => item?._id}
                />
            )}
            {!loading && filteredData.length === 0 && (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Title>No Data Found</Title>
                </View>
            )}
        </GestureHandlerRootView>
    );
};

export default AttendanceScreen;

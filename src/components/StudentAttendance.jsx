import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import axios from 'axios';
import SelectDropdown from 'react-native-select-dropdown';
import API_URL from '../connection/url';
const StudentAttendance = () => {
    const [attendanceData, setAttendanceData] = useState({});
    const [markedDates, setMarkedDates] = useState({});
    const [selectedSubject, setSelectedSubject] = useState('ALL');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.post(`${API_URL}/api/v1/faculty/attendance/unique`, {
                date: "2024-04-16",
                semester: "Sem8",
                branch: "Cse"
            });
            if (response.data.success) {
                setAttendanceData(response.data.data[0]);
                markDates(response.data.data[0].attendanceData);
            }
        } catch (error) {
            console.error("Error fetching data:", error.response);
        }
    };

    const markDates = (data) => {
        const marked = {};
        data.forEach(item => {
            const date = item.date;
            if (selectedSubject === 'ALL' || item.subject === selectedSubject) {
                marked[date] = { marked: true, dotColor: item.status === 'Absent' ? 'red' : 'green' };
            }
        });
        setMarkedDates(marked);
    };

    const calculateAttendancePercentage = () => {
        const totalDays = Object.keys(markedDates).length;
        const absentDays = Object.values(markedDates).filter(date => date.dotColor === 'red').length;
        const attendancePercentage = ((totalDays - absentDays) / totalDays) * 100;
        return attendancePercentage.toFixed(2);
    };

    return (
        <View style={styles.container}>
            <SelectDropdown
                data={['ALL', 'PROJECT-III', 'BDA', 'ML']}
                defaultValue={selectedSubject}
                onSelect={(selectedItem, index) => {
                    setSelectedSubject(selectedItem);
                    markDates(attendanceData.attendanceData);
                }}
                buttonStyle={styles.dropdownButton}
                dropdownStyle={styles.dropdown}
                rowStyle={styles.dropdownRow}
                textStyle={styles.dropdownText}
            />
            <Calendar
                markedDates={markedDates}
            />
            <Text style={styles.percentageText}>
                Attendance this month: {calculateAttendancePercentage()}%
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ffffff',
    },
    dropdownButton: {
        backgroundColor: '#e0e0e0',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginBottom: 20,
    },
    dropdown: {
        borderRadius: 8,
        marginTop: 10,
    },
    dropdownRow: {
        padding: 15,
        backgroundColor: '#ffffff',
    },
    dropdownText: {
        fontSize: 18,
    },
    percentageText: {
        fontSize: 20,
        marginTop: 20,
        textAlign: 'center',
        color:"black"
    },
});

export default StudentAttendance;

import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';
import axios from 'axios';
import API_URL from '../connection/url';
import { authContext } from '../context/AuthContextFunction';
import SelectDropdown from 'react-native-select-dropdown';
import { fetchSubjectArr } from './subject-utils/subject';
import { Button, Card, Title, Paragraph } from 'react-native-paper';

export default function StudentAttendance() {
    const [selected, setSelected] = useState({});
    const [markedDates, setMarkedDates] = useState({});
    const [subject, setSubject] = useState('');
    const [loading, setLoading] = useState(true);
    const { authData } = useContext(authContext);
    const [totalPresent, setTotalPresent] = useState(0);
    const [totalAttendance, setTotalAttendance] = useState(0);

    const [bodyData, setbodyData] = useState({
        month: '04',
        year: "2024",
        semester: authData?.member?.semester,
        branch: authData?.member?.branch,
        rollno: authData?.member?.rollno,
        token: authData?.token
    });

    useEffect(() => {
        setLoading(true);

        if (!subject) {
            setLoading(false);
            return;
        }

        axios.post(`${API_URL}/api/v1/student/attendance`, bodyData)
            .then((response) => {
                setSelected(response.data.data);

                const subjectData = response.data.data[subject];

                if (subjectData) {
                    const updatedMarkedDates = {};

                    let presentCount = 0;
                    let attendanceCount = 0;

                    Object.keys(subjectData).forEach(date => {
                        const status = subjectData[date];
                        if (status === 'present') {
                            updatedMarkedDates[date] = { selected: true, selectedColor: 'green', dotColor: 'green' };
                            presentCount++;
                        } else if (status === 'absent') {
                            updatedMarkedDates[date] = { selected: true, selectedColor: 'red', dotColor: 'red' };
                        }
                        attendanceCount++;
                    });

                    setTotalPresent(presentCount);
                    setTotalAttendance(attendanceCount);
                    setMarkedDates(updatedMarkedDates);
                } else {
                    setTotalPresent(0);
                    setTotalAttendance(0);
                    setMarkedDates({});
                }

                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching attendance:", error);
                setLoading(false);
            });
    }, [subject]);

    const percentage = totalAttendance === 0 ? 0 : ((totalPresent / totalAttendance) * 100).toFixed(2);

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Calendar
                style={styles.calendar}
                current={'2024-04-01'}
                onDayPress={day => {
                    console.log('selected day', day);
                }}
                markedDates={markedDates}
                onMonthChange={e => {
                    setbodyData({ ...bodyData, month: e.month, year: e.year });
                    console.log(e);
                }}
            />
            <View style={styles.dropdownContainer}>
                <SelectDropdown
                    data={fetchSubjectArr(authData?.member?.branch, authData?.member?.semester)._j}
                    onSelect={(selectedItem, index) => {
                        console.log(selectedItem, index);
                        setSubject(selectedItem);
                    }}
                    renderButton={(selectedItem, isOpened) => {
                        return (
                            <View style={styles.dropdownButtonStyle}>
                                <Text style={styles.dropdownButtonTxtStyle}>
                                    {(selectedItem && selectedItem.title) || 'Select your subject'}
                                </Text>
                            </View>
                        );
                    }}
                    renderItem={(item, index, isSelected) => {
                        return (
                            <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                                <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
                            </View>
                        );
                    }}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={styles.dropdownMenuStyle}
                    defaultButtonText='Select Subject'
                    buttonStyle={styles.dropdownButtonStyle}
                />
                <Card style={styles.statsCard}>
                    <Card.Content>
                        <Title>Attendance Stats</Title>
                        <Paragraph>Total Present: {totalPresent}</Paragraph>
                        <Paragraph>Total Attendance: {totalAttendance}</Paragraph>
                        <Paragraph>Percentage: {percentage}%</Paragraph>
                    </Card.Content>
                </Card>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor:"#dadada"
    },
    calendar: {
        borderWidth: 1,
        borderColor: 'gray',
        height: 350,
        marginBottom: 20,
    },
    dropdownContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    dropdownButtonStyle: {
        width: 200,
        height: 50,
        backgroundColor: '#E9ECEF',
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
        marginBottom: 20,
    },
    dropdownButtonTxtStyle: {
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
    },
    dropdownMenuStyle: {
        backgroundColor: '#E9ECEF',
        borderRadius: 8,
    },
    dropdownItemStyle: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
    },
    dropdownItemTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
    },
    statsCard: {
        width: '100%',
        marginTop: 20,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState,useContext } from 'react'
import { Calendar } from 'react-native-calendars'
import axios from 'axios';
import API_URL from '../connection/url'
import { authContext } from '../context/AuthContextFunction';

export default function StudentAttendance() {
    const [selected, setSelected] = useState({});
    const [markedDates, setMarkedDates] = useState({});

    const {authData} = useContext(authContext)


    const [bodyData, setbodyData] = useState({month:'04',year:"2024",semester:authData?.member?.semester,branch:authData?.member?.branch,rollno:authData?.member?.rollno,token:authData?.token})
    useEffect(() => {

        console.log("bodyData ",bodyData)
        axios.post(`${API_URL}/api/v1/student/attendance`,bodyData).then((response) => {
            console.log(response.data);
            setSelected(response.data.data);

            // Update markedDates based on the attendance data
            const updatedMarkedDates = {};

            Object.keys(response.data.data).forEach(subject => {
                Object.keys(response.data.data[subject]).forEach(date => {
                    const status = response.data.data[subject][date];
                    if (status === 'present') {
                        updatedMarkedDates[date] = { selected: true, selectedColor: 'green', dotColor: 'green' };
                    } else if (status === 'absent') {
                        updatedMarkedDates[date] = { selected: true, selectedColor: 'red', dotColor: 'red' };
                    }
                });
            });

            setMarkedDates(updatedMarkedDates);
        }).catch(error => {
            console.error("Error fetching attendance:", error);
        });
    }, []);

    return (
        <View>
            <Calendar
                // Customize the appearance of the calendar
                style={{
                    borderWidth: 1,
                    borderColor: 'gray',
                    height: 350
                }}
                // Specify the current date
                current={'2024-04-01'}
                // Callback that gets called when the user selects a day
                onDayPress={day => {
                    console.log('selected day', day);
                }}
                // Mark specific dates as marked based on attendance
                markedDates={markedDates}

                onMonthChange={e => {setbodyData({ ...bodyData, month: e.month ,year:e.year})
            console.log(e)
            }}
                
            />
        </View>
    )
}

const styles = StyleSheet.create({})

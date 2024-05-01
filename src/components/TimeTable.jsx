import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import DatePicker from 'react-native-date-picker';

const TaskTimeline = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timerID = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Update current time every minute

        return () => clearInterval(timerID);
    }, []);

    const tasks = [
        { date: '2024-05-02', time: '13:00', title: 'Meeting with client', description: 'Discuss project details' },
        { date: '2024-05-02', time: '10:10', title: 'Design review', description: 'Review UI/UX designs' },
        { date: '2024-05-02', time: '12:00', title: 'Lunch break', description: 'Take a break and recharge' },
        { date: '2024-05-02', time: '15:00', title: 'Development', description: 'Code implementation' },
        // Add more tasks as needed
    ];

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const generateHoursArray = () => {
        const hours = [];
        const todayTasks = tasks.filter(task => {
            const taskDate = new Date(task.date);
            return (
                taskDate.getFullYear() === selectedDate.getFullYear() &&
                taskDate.getMonth() === selectedDate.getMonth() &&
                taskDate.getDate() === selectedDate.getDate()
            );
        });
    
        // Create an array of hours from 0 to 23
        for (let i = 0; i < 24; i++) {
            hours.push(`${i < 10 ? '0' + i : i}:00`);
        }
    
        return { hours, todayTasks };
    };

    
    const hourTasks = generateHoursArray().todayTasks.filter(task => {
        const taskHour = parseInt(task.time.split(':')[0]);
        const nextHour = taskHour === 23 ? 0 : taskHour + 1;
        const currentTimeHour = currentTime.getHours();
    
        if (taskHour === currentTimeHour) {
            // If the task starts at the current hour, check if the minutes have passed
            const currentMinutes = currentTime.getMinutes();
            const taskMinutes = parseInt(task.time.split(':')[1]);
            return currentMinutes >= taskMinutes;
        } else {
            // Check if the task falls between the current hour and the next hour
            return currentTimeHour <= taskHour && taskHour < nextHour;
        }
    });
    


    const getBarPosition = () => {
        if (selectedDate.toDateString() === new Date().toDateString()) {
            const hour = currentTime.getHours();
            const minutes = currentTime.getMinutes();
            const totalMinutes = hour * 60 + minutes;
            const pixelsPerMinute = 300 / (24 * 60); // Assuming 300 pixels height for the timeline
            return totalMinutes * pixelsPerMinute;
        }
        return -1; // Return a value that won't affect positioning
    };

    return (
        <View style={styles.container}>
            <View style={styles.datePickerContainer}>
                <DatePicker
                    date={selectedDate}
                    onDateChange={handleDateChange}
                    mode="date" // Set mode to 'datetime' for inline date picker
                    textColor="#ffffff" // Adjust text color of the date picker
                    style={styles.datePicker}
                />
            </View>
            <Text style={styles.selectedDate}>Tasks for {selectedDate.toDateString()}</Text>
            <ScrollView style={styles.timelineContainer}>
                <View style={styles.tasksContainer}>
                    <View style={[styles.currentTimeIndicator, { top: getBarPosition() === -1 ? -100 : getBarPosition() }]} />
                    {generateHoursArray().hours.map((hour, index) => {
                        const hourTasks = generateHoursArray().todayTasks.filter(task => task.time.startsWith(hour));
                        return (
                            <View key={index} style={styles.hourContainer}>
                                <Text style={styles.hourText}>{hour}</Text>
                                {hourTasks.map((task, taskIndex) => (
                                    <View key={taskIndex} style={[styles.taskContainer, task.time === currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) && styles.activeTaskContainer]}>
                                        <View style={styles.timelineDot} />
                                        <View style={styles.taskDetails}>
                                            <Text style={[styles.time, task.time === currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) && styles.activeText]}>{task.time}</Text>
                                            <Text style={[styles.title, task.time === currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) && styles.activeText]}>{task.title}</Text>
                                            <Text style={styles.description}>{task.description}</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 10,
        paddingTop: 50
    },
    datePickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        backgroundColor: 'black',
        borderRadius: 5,
        overflow: 'hidden' // Ensure date picker doesn't overflow its container
    },
    datePicker: {
        flex: 1
    },
    timelineContainer: {
        flex: 1
    },
    tasksContainer: {
        marginTop: 20,
        position: 'relative' // Ensure proper positioning of the current time bar
    },
    selectedDate: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'black'
    },
    hourContainer: {
        marginBottom: 20
    },
    hourText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: 'black'
    },
    taskContainer: {
        flexDirection: 'row',
        marginLeft: 20,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        padding: 10
    },
    activeTaskContainer: {
        backgroundColor: 'lightblue' // Background color for active tasks
    },
    timelineDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'blue',
        marginRight: 10
    },
    taskDetails: {
        flex: 1
    },
    time: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: 'black'
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: 'black'
    },
    activeText: {
        color: 'blue' // Text color for active tasks
    },
    description: {
        fontSize: 16,
        color: 'black'
    },
    currentTimeIndicator: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: 'red' // Color of the current time indicator bar
    }
});

export default TaskTimeline;

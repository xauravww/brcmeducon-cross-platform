import React, { useState, useRef, useCallback, useContext, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Animated, TextInput, Pressable } from 'react-native';
import { TimelineCalendar } from '@howljs/calendar-kit';
import axios from 'axios';
import { authContext } from '../context/AuthContextFunction';
import { PanGestureHandler } from 'react-native-gesture-handler';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import SelectDropdown from 'react-native-select-dropdown';
import { selectRoleContext } from '../context/SelectRoleContext';
import { appcolor } from '../constants';
import { Snackbar } from 'react-native-paper';
import Loader from 'react-native-loader-kit';
import BottomDrawer from './TimeTableBottomDrawer';
import API_URL from "../connection/url"





const exampleEvents = [
    {
        id: '1',
        title: 'BDA class',
        start: new Date('2024-05-03T09:00:00.000Z'),
        end: new Date('2024-05-03T09:45:00.000Z'),
        color: '#A3C7D6',
        sem: "Sem8",
        branch: "CSE",
        faculty: "Dr. Sandeep"
    },

];

const unavailableHours = [
    { start: 0, end: 9 },
    { start: 18, end: 24 },
];

const Calendar = ({ navigation }) => {
    const [selectedEvent, setSelectedEvent] = useState();
    const [timeInterval, setTimeInterval] = useState(45);
    const [startDate, setStartDate] = useState(new Date('2024-05-02T09:00:00.000Z'));
    const [endDate, setEndDate] = useState(new Date('2024-05-02T10:00:00.000Z'));
    const calendarRef = useRef(null);
    const [timeTableData, settimeTableData] = useState(exampleEvents);
    const { authData } = useContext(authContext);
    const [openDrawerBottom, setopenDrawerBottom] = useState(false)
    const [editedEvent, setEditedEvent] = useState({ ...selectedEvent });
    const role = authData?.member?.role
   
    const _onLongPressEvent = useCallback((event) => {
        setSelectedEvent(event);
       
    }, []);

    const _onPressCancel = useCallback(() => {
        setopenDrawerBottom(false)
        setSelectedEvent(undefined);
    }, []);

    const _onPressSave = useCallback(() => {
        setSelectedEvent(undefined);
    }, []);

    const onUpdateEvent = useCallback((updatedEvent) => {
        settimeTableData(prevEvents =>
            prevEvents.map(ev => (ev.id === updatedEvent.id ? updatedEvent : ev))
        );
    }, []);

    const handleDeleteEvent = (eventId) => {
        settimeTableData(prevEvents =>
            prevEvents.filter(ev => ev.id !== eventId)
        );
    };

    const renderBottomDrawer = useCallback(() => {
        if (selectedEvent) {
            return (
                <BottomDrawer
                    event={selectedEvent}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                    onPressCancel={_onPressCancel}
                    onPressSave={_onPressSave}
                    onUpdateEvent={onUpdateEvent}
                    onDeleteEvent={handleDeleteEvent}
                    editedEvent={editedEvent}
                    setEditedEvent={setEditedEvent}

                />
            );
        }
        return null;
    }, [selectedEvent, startDate, endDate, _onPressCancel, _onPressSave, onUpdateEvent]);

    const renderTimeLabel = useCallback((time) => {
        return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }, []);

    const renderEvent = useCallback((event, index) => {
        const durationInMinutes = (new Date(event.end) - new Date(event.start)) / (1000 * 60);
        const height = (durationInMinutes / timeInterval) * 40; // Adjust 40 as per your preference
        const topPosition = index * (height + 10); // Add overlap spacing if needed

        const onDragEnd = (e, gestureState) => {
            const durationChangeMinutes = (gestureState.dy * (timeInterval / 40));
            const newStart = new Date(event.start.getTime() + (durationChangeMinutes * 60 * 1000));
            const newEnd = new Date(event.end.getTime() + (durationChangeMinutes * 60 * 1000));

            let updatedTimeTableData = [...timeTableData]; // Copy the original array

            // Update the dragged event first (avoids initial "overlapping" state)
            updatedTimeTableData[updatedTimeTableData.findIndex(ev => ev.id === event.id)] = { ...event, start: newStart, end: newEnd };

            let hasResized = false; // Flag to track if any resizing occurred

            // Iterate through all elements (including the first)
            for (let i = 0; i < updatedTimeTableData.length; i++) {
                if (i === updatedTimeTableData.findIndex(ev => ev.id === event.id)) {
                    continue; // Skip the dragged event (already updated)
                }

                const otherEvent = updatedTimeTableData[i];
                if (isColliding(otherEvent, newStart, newEnd)) {
                    // Resize the colliding event and subsequent overlapping events
                    const startDiff = Math.abs(newStart - new Date(otherEvent.start));
                    const endDiff = Math.abs(newEnd - new Date(otherEvent.end));
                    otherEvent.width = otherEvent.width + startDiff + endDiff;

                    // Update start times of following events if needed
                    for (let j = i + 1; j < updatedTimeTableData.length; j++) {
                        const followingEvent = updatedTimeTableData[j];
                        if (newEnd > followingEvent.start) {
                            followingEvent.start = newEnd;
                        } else {
                            break;
                        }
                    }

                    hasResized = true; // Mark resizing done
                    break; // Exit loop after first collision and resize
                }
            }

            // No need to update the dragged event again if no resizing occurred

            settimeTableData(updatedTimeTableData);
        };


        return (
            <PanGestureHandler onGestureEvent={onDragEnd}>
                <Animated.View key={event._id} style={[styles.eventContainer, { top: topPosition, height: height}]}>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <Text style={styles.eventTime}>
                        Start: {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, Duration: {durationInMinutes} minutes
                    </Text>
                </Animated.View>
            </PanGestureHandler>
        );
    }, [timeInterval, timeTableData]);

    const { setNavigationState } = useContext(selectRoleContext)

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setNavigationState('TimeTable');

        });

        if (unsubscribe) {
            return unsubscribe
        }
    }, [navigation])

    useEffect(() => {
        console.log("role is ", role);
        alert("This feature is still in development, might contain bugs, but still some APIs are working")
        try {
            if (role === "student") {
                axios.get(`${API_URL}/api/v1/tt/${authData?.member?.branch}/${authData?.member?.semester}`).then((res) => {
                    console.log(res.data);
                    settimeTableData(res.data.data);
                });
            } else if (role === "faculty") { // Make sure to use "else if" here
                axios.get(`${API_URL}/api/v1/tt/faculty/${authData?.member?.rollno}`).then((res) => {
                    console.log(res.data);
                    settimeTableData(res.data.data);
                });
            }
        } catch (error) {
            console.log(error);
        }
    }, []); 
    

    const _onEndDragSelectedEvent = useCallback((event) => {
        console.log("Event occurred:", event);
        setSelectedEvent(event);
        setStartDate(new Date(event.start)); // Set start date for date picker
        setEndDate(new Date(event.end)); // Set end date for date picker
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            {/* for student and faculty */}
         {
            role=="student" || role=="faculty" && (
                <TimelineCalendar
                ref={calendarRef}
                viewMode="day"
                events={timeTableData}
                unavailableHours={unavailableHours}
                allowPinchToZoom
                
                renderTimeLabel={renderTimeLabel}
                timeInterval={timeInterval}
                renderEvent={renderEvent}

                minTimeIntervalHeight={40}
                maxTimeIntervalHeight={60}
                minTimeInterval={15}
                maxTimeInterval={60}

                overlapEventsSpacing={10}
            />
            )
         }
            {/* for admin only */}
            {role == 'admin' && (
                <TimelineCalendar
                    ref={calendarRef}
                    viewMode="day"
                    events={exampleEvents}
                    unavailableHours={unavailableHours}
                    allowPinchToZoom
                    onLongPressEvent={_onLongPressEvent}
                    selectedEvent={selectedEvent}
                    onEndDragSelectedEvent={_onEndDragSelectedEvent}
                    renderTimeLabel={renderTimeLabel}
                    timeInterval={timeInterval}
                    renderEvent={renderEvent}

                    minTimeIntervalHeight={40}
                    maxTimeIntervalHeight={60}
                    minTimeInterval={15}
                    maxTimeInterval={60}

                    overlapEventsSpacing={10}
                />
            )}

            {role == 'admin' && (
                <View style={{ flexDirection: "row", justifyContent: "center", gap: 10 }}>
                    <SelectDropdown
                        data={['Sem1', 'Sem2', 'Sem3', 'Sem4', 'Sem5', 'Sem6', 'Sem7', 'Sem8']}
                        onSelect={(selectedItem, index) => setEditedEvent({ ...editedEvent, sem: selectedItem })}
                        defaultButtonText="Semester"
                        buttonStyle={{ width: "45%" }}
                        dropdownStyle={{ backgroundColor: '#FFF' }}
                        textStyle={{ color: 'black' }}
                    />
                    <SelectDropdown
                        data={['CSE', 'CIVIL', 'EE', 'ME']}
                        onSelect={(selectedItem, index) => setEditedEvent({ ...editedEvent, branch: selectedItem })}
                        defaultButtonText="Branch"
                        buttonStyle={{ width: "45%" }}
                        dropdownStyle={{ backgroundColor: '#FFF' }}
                        textStyle={{ color: 'black' }}
                    />
                </View>
            )}


            {role == "admin" && (
                <TouchableOpacity style={{ position: "absolute", bottom: 30, right: 20 }} onPress={() => setopenDrawerBottom(true)}>
                    <Text style={{ color: "black", fontSize: 55 }}>+</Text>
                </TouchableOpacity>
            )}
            {openDrawerBottom && (
                <BottomDrawer event={selectedEvent}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                    onPressCancel={_onPressCancel}
                    onPressSave={_onPressSave}
                    onUpdateEvent={onUpdateEvent}
                    onDeleteEvent={handleDeleteEvent}
                    openDrawerBottom={openDrawerBottom}
                    setopenDrawerBottom={setopenDrawerBottom}
                    editedEvent={editedEvent}
                    setEditedEvent={setEditedEvent}
                />
            )}
        </SafeAreaView>
    );
};



const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    button: {
        height: 45,
        paddingHorizontal: 24,
        backgroundColor: '#1973E7',
        justifyContent: 'center',
        borderRadius: 24,
        marginHorizontal: 8,
        marginVertical: 8,
    },
    btnText: { fontSize: 16, color: '#FFF', fontWeight: 'bold' },
    eventContainer: {
        padding: 8,
        backgroundColor: '#EFEFEF',
        borderRadius: 8,
        marginBottom: 8,
    },
    eventTitle: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    eventTime: {
        fontStyle: 'italic',
    },
});

export default Calendar;

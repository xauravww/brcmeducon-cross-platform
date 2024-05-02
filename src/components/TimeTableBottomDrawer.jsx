import React, { useState } from 'react';
import { View, TextInput, Pressable, Text ,StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Snackbar from 'react-native-paper';
import DatePicker from 'react-native-date-picker'; 
import axios from 'axios'
import API_URL from "../connection/url"
export default TimeTableBottomDrawer = ({ event, startDate, setStartDate, endDate, setEndDate, onPressCancel, onPressSave, onUpdateEvent, onDeleteEvent, openDrawerBottom,setopenDrawerBottom,editedEvent, setEditedEvent }) => {
   
    const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
    const [openEndDatePicker, setOpenEndDatePicker] = useState(false);
    const [loading, setLoading] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleDelete = () => {
        onDeleteEvent(editedEvent.id);
        onPressCancel();
    };

    const handleChange = (key, value) => {
        setEditedEvent(prevEvent => ({
            ...prevEvent,
            [key]: value
        }));
    };

      const handleSave = async () => {
        try {
            // Show loader
            // You can show a loader here
    
            if (editedEvent.id) {
                // If edited event has an ID, it means it's an existing event being edited
                // So send a PUT request to update the event
                const response = await axios.put(`${API_URL}/api/v1/tt/${editedEvent.id}`, {
                    title: editedEvent.title,
                    start: startDate.toISOString(),
                    end: endDate.toISOString(),
                    color: editedEvent.color || '#ccc',
                    sem: editedEvent.sem,
                    branch: editedEvent.branch,
                    facultyId: editedEvent.faculty.name, // You may need to replace this with the actual faculty ID
                    facultyName: editedEvent.faculty.id,
                    subject: editedEvent.title // Assuming subject is the same as title
                });
    
                // Show success message using Snackbar from react-native-paper
                // You can use Snackbar from react-native-paper to show a success message
                console.log('Event updated:', response.data);
    
                // Update the event in the state
                settimeTableData(prevEvents =>
                    prevEvents.map(ev => (ev.id === editedEvent.id ? response.data.data : ev))
                );
            } else {
                // If edited event doesn't have an ID, it means it's a new event being added
                // So send a POST request to add the new event
                const response = await axios.post('${API_URL}/api/v1/tt/add', {
                    title: editedEvent.title,
                    start: startDate.toISOString(),
                    end: endDate.toISOString(),
                    color: editedEvent.color || '#ccc',
                    sem: editedEvent.sem,
                    branch: editedEvent.branch,
                    facultyId: editedEvent.faculty.id, // You may need to replace this with the actual faculty ID
                    facultyName: editedEvent.faculty.name,
                    subject: editedEvent.title // Assuming subject is the same as title
                });
    
                // Show success message using Snackbar from react-native-paper
                // You can use Snackbar from react-native-paper to show a success message
                console.log('New event added:', response.data);
    
                // Add the new event to the state
                settimeTableData(prevEvents => [...prevEvents, response.data.data]);
            }
    
            // Hide loader
            // You can hide the loader here
    
            // Close the bottom drawer
            setopenDrawerBottom(false);
            
        } catch (error) {
            // Hide loader
            // You can hide the loader here
    
            // Show error message using Snackbar from react-native-paper
            // You can use Snackbar from react-native-paper to show an error message
            console.error('Error saving event:', error);
        }
    };


    return (
        <View style={styles.bottomDrawer}>
            <TextInput
                value={editedEvent?.title}
                onChangeText={value => handleChange('title', value)}
                placeholder="Event Title"
                style={styles.input}
                placeholderTextColor={"gray"}
            />
           
            <TextInput
                value={editedEvent?.faculty?.id}
                onChangeText={value => handleChange('faculty', value)}
                placeholder="Faculty  (Optional)"
                style={styles.input}
                placeholderTextColor={"gray"}
            />
            <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
                
                <Pressable onPress={() => setOpenStartDatePicker(true)}>
                <Text style={{ color: "black" }}>{startDate?.toLocaleString()}</Text>
                </Pressable>
                <Icon name="long-arrow-right" size={20} color="black"  />
                <Pressable onPress={() => setOpenEndDatePicker(true)}>
                <Text style={{ color: "black" }}>{endDate?.toLocaleString()}</Text>
                </Pressable>
            </View>
            <TextInput
                value={editedEvent?.color}
                onChangeText={value => handleChange('color', value)}
                placeholder="Color  (Optional)"
                style={styles.input}
                placeholderTextColor={"gray"}
                defaultValue='#ccc'
            />
            <View style={styles.buttonContainer}>
                <Icon name="close" size={30} color={"#FF0000"} onPress={onPressCancel} />
                <Icon name="check" size={30} color={"black"} />
                {!openDrawerBottom && <Icon name="trash" size={30} color="#FF0000" onPress={handleDelete} />}
            </View>
            {openStartDatePicker && (
                <DatePicker
                    modal
                    open={openStartDatePicker}
                    date={startDate}
                    onConfirm={(date) => {
                        setOpenStartDatePicker(false);
                        setStartDate(new Date(date));
                    }}
                    onCancel={() => {
                        setOpenStartDatePicker(false);
                    }}
                />
            )}
            {openEndDatePicker && (
                <DatePicker
                    modal
                    open={openEndDatePicker}
                    date={endDate}
                    onConfirm={(date) => {
                        setOpenEndDatePicker(false);
                        setEndDate(new Date(date));
                    }}
                    onCancel={() => {
                        setOpenEndDatePicker(false);
                    }}
                />
            )}
           
            {loading && <Loader loading={loading} />}
        </View>
    );
};


const styles = StyleSheet.create({
    bottomDrawer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ccc',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10
    },
    input: {
        height: 40,
        width: '92%',
        marginVertical: 8,
        paddingHorizontal: 10,
        color: "black",
        backgroundColor: "#ebebeb",
        borderRadius:10
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: "flex-end",
        width: '100%',
        marginTop: 10,
        gap: 40,
        marginRight: 30
    }
});



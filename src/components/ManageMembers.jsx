import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import Config from '../connection/url';

const ManageEvents = ({ route, navigation }) => {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [eventData, setEventData] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    assignTo: '',
    eventType: '',
  });

  useEffect(() => {
    if (route.params) {
      const { name, description, date, assignTo, eventType, time } = route.params;
      setEventData({
        name,
        description,
        date,
        time,
        assignTo,
        eventType,
      });
    }
  }, []);

  const handleInputChange = (field, value) => {
    setEventData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleChoosePhoto = () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 1024,
      maxHeight: 1024,
      quality: 0.8,
    };

    launchImageLibrary(options, (response) => {
      console.log('ImagePicker Response:', response);  // Debugging log

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        setImage(response);
        console.log('Updated Image:', image);  // Debugging log
      }
    });
  };

  const handleSubmitEvents = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append('image', {
      uri: image.uri,
      type: image.type,
      name: image.fileName,
    });

    Object.keys(eventData).forEach((key) => {
      formData.append(key, eventData[key]);
    });

    try {
      const response = await axios.post(`${API_URL}/api/v1/events`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success) {
        navigation.pop(1);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (image) {
      console.log('Selected Image:', image.uri);
    }
  }, [image]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Manage Events</Text>

      <TouchableOpacity style={styles.imageButton} onPress={handleChoosePhoto}>
        <Text style={styles.buttonText}>Choose Photo</Text>
      </TouchableOpacity>

      {image && (
        <Image
          source={{ uri: image?.assets[0]?.uri  }}
          style={styles.image}
          onError={(e) => console.log('Image Load Error:', e.nativeEvent.error)}
        />
      )}

      {/* Add input fields and other UI components here */}
      
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmitEvents}
        disabled={!image || loading}
      >
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  imageButton: {
    backgroundColor: '#ebebeb',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
});

export default ManageEvents;

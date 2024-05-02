import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, TextInput, Alert } from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import axios from 'axios';
import API_URL from "../connection/url";
import avatarImage from "../assets/images/man_avatar.jpg";
import Fontisto from 'react-native-vector-icons/Fontisto';
import DatePicker from 'react-native-date-picker';
import SelectDropdown from 'react-native-select-dropdown';
import moment from 'moment';
import { selectRoleContext } from '../context/SelectRoleContext';
import { authContext } from '../context/AuthContextFunction';
import Loader from "react-native-loader-kit"
import { appcolor } from '../constants';
import { color } from 'react-native-reanimated';
const ManageEvents = ({ navigation, route }) => {
  const { setNavigationState } = useContext(selectRoleContext)
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [imageUri, setimageUri] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [id, setid] = useState('')
  const [memberData, setMemberData] = useState({
    email: '',
    phone: '',
    countryCode: '',
    pass: '',
    rollno: '',
    name: '',
    semester: '',
    address: '',
    batchYear: '',
    fathername: '',
    registrationNo: '',
    dateOfBirth: new Date().toLocaleDateString("en-GB").slice(0, 10),
    branch: '',
    role: ''
  });

  const { authData } = useContext(authContext)



  useEffect(() => {

    if (route.params) {
      const {
        email,
        phone,
        countryCode,
        pass,
        rollno,
        name,
        semester,
        address,
        batchYear,
        fathername,
        registrationNo,
        dateOfBirth,
        branch,
        role
        , actionType
      } = route.params;

      setMemberData({
        ...memberData,
        email,
        phone,
        countryCode,
        pass,
        rollno,
        name,
        semester,
        address,
        batchYear,
        fathername,
        registrationNo,
        dateOfBirth,
        branch,
        role
      });
      if (actionType == "EDIT") setIsEditing(true)
      setimageUri(route.params.imageurl.url);
      setid(route.params._id)
    }

    const unsubscribe = navigation.addListener('focus', () => {
      setNavigationState('ManageMembers');
    });

    if (unsubscribe) {
      return unsubscribe
    }
  }, [navigation, route.params]);


  useEffect(() => {
    console.log("Ye aagyi hmaari memeberdata ", memberData);
  }, [memberData]);

  const errorMessages = {
    email: 'Please enter a valid email address.',
    phone: 'Please enter a valid phone number (10 digits).',
    countryCode: 'Please enter a valid country code (1-4 digits).',
    pass: 'Password must contain at least 8 characters, including one letter and one digit.',
    rollno: 'Please enter a valid roll number (e.g., 20-CSE-4375).',
    name: 'Please enter a valid name containing only letters and spaces.',
    semester: 'Please enter a valid semester (e.g., Sem1).',
    address: 'Please enter a valid address.',
    batchYear: 'Please enter a valid batch year (4 digits).',
    fathername: 'Please enter a valid father\'s name containing only letters and spaces.',
    registrationNo: 'Please enter a valid registration number (10 digits).',
    dateOfBirth: "Please enter a valid DOB"
  };

  const getFieldsToValidate = () => {
    const role = memberData.role.toLowerCase();
    let fieldsToValidate = [];

    if (role === 'student') {
      fieldsToValidate = ['email', 'phone', 'countryCode', 'pass', 'rollno', 'name', 'semester', 'address', 'batchYear', 'fathername', 'registrationNo'];
    } else if (role === 'admin' || role === 'faculty') {
      fieldsToValidate = ['email', 'phone', 'countryCode', 'pass', 'name', 'address', 'fathername'];
    } else if (role === 'alumni') {
      fieldsToValidate = ['email', 'phone', 'countryCode', 'pass', 'rollno', 'name', 'semester', 'address', 'batchYear', 'fathername', 'registrationNo'];
    }

    return fieldsToValidate;
  };


  useEffect(() => {

  }, []);


  const handleInputChange = (field, value) => {
    setMemberData(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };



  useEffect(() => {
    console.log(JSON.stringify(memberData.branch))
  }, [memberData.branch])


  const handleBlur = (field) => {
    const isValid = validateInput(field, memberData[field]);
    setValidity((prevValidity) => ({
      ...prevValidity,
      [field]: isValid,
    }));

    if (!isValid) {
      showAlert(errorMessages[field]);
    }
  };
  const [validity, setValidity] = useState({
    email: true,
    phone: true,
    countryCode: true,
    pass: true,
    rollno: true,
    name: true,
    semester: true,
    address: true,
    batchYear: true,
    fathername: true,
    registrationNo: true,
    dateOfBirth: true,
  });

  const validateInput = (field, value) => {
    if (memberData.role === 'student') {
      const regexMap = {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^[0-9]{10}$/,
        countryCode: /^[0-9]{1,4}$/,
        pass: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        rollno: /^[0-9]{1,4}-[A-Z]{2,3}-[0-9]{4}$/i,
        name: /^[a-zA-Z\s]+$/,
        semester: /^Sem[0-9]$/,
        address: /^[a-zA-Z0-9\s,'-]*$/,
        batchYear: /^[0-9]{4}$/,
        fathername: /^[a-zA-Z\s]+$/,
        registrationNo: /^[0-9]{10}$/,
        dateOfBirth: /^\d{4}-\d{2}-\d{2}$/
      };

      return regexMap[field]?.test(value);
    } else if (memberData.role === 'faculty' || memberData.role === 'admin') {
      const regexMap = {
        // regex patterns for faculty and admin fields except roll number
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^[0-9]{10}$/,
        countryCode: /^[0-9]{1,4}$/,
        pass: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
        name: /^[a-zA-Z\s]+$/,
        address: /^[a-zA-Z0-9\s,'-]*$/,
        fathername: /^[a-zA-Z\s]+$/,
        dateOfBirth: /^\d{4}-\d{2}-\d{2}$/
      };
      return regexMap[field]?.test(value);
    } else if (memberData.role === 'alumni') {
      const regexMap = {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^[0-9]{10}$/,
        countryCode: /^[0-9]{1,4}$/,
        pass: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
        rollno: /^[0-9]{1,4}-[A-Z]{3}-[0-9]{4}$/,
        name: /^[a-zA-Z\s]+$/,
        semester: /^Sem[0-9]$/,
        address: /^[a-zA-Z0-9\s,'-]*$/,
        batchYear: /^[0-9]{4}$/,
        fathername: /^[a-zA-Z\s]+$/,
        registrationNo: /^[0-9]{10}$/,
        dateOfBirth: /^\d{4}-\d{2}-\d{2}$/
      };

      return regexMap[field]?.test(value);
    }
  };


  const handleChoosePhoto = () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 1024,
      maxHeight: 1024,
      quality: 0.8,
      includeBase64: false
    };

    launchImageLibrary(options, (response) => {
      if (!response.didCancel && !response.errorCode) {
        // Ensure response.assets exists and has at least one item
        if (response.assets && response.assets.length > 0) {
          setImage(response);
          // Accessing uri property from the first item in assets array
          setimageUri(response.assets[0].uri);
          console.log('Image selected:', response.assets[0].uri);
        } else {
          console.error('No image selected.');
        }
      }
    });
  };

  const handleOpenCamera = () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 1024,
      maxHeight: 1024,
      quality: 0.8,
      includeBase64: false
    };

    launchCamera(options, (response) => {
      if (!response.didCancel && !response.errorCode) {
        // Ensure response.assets exists and has at least one item
        if (response.assets && response.assets.length > 0) {
          setImage(response);
          // Accessing uri property from the first item in assets array
          setimageUri(response.assets[0].uri);
          console.log('Image captured:', response.assets[0].uri);
        } else {
          console.error('No image captured.');
        }
      }
    });
  };


  const handleSubmitEvents = async () => {

    // Frontend validation
    if (!imageUri) {
      showAlert('Please select an image.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', {
        uri: image.assets[0].uri,
        type: image.assets[0].type,
        name: image.assets[0].fileName,
      });

      // Set the role field
      formData.append('role', memberData.role);

      // Determine which fields need validation based on the role
      const fieldsToValidate = getFieldsToValidate();

      // Validate the required fields
      for (const key of fieldsToValidate) {
        if (!memberData[key]) {
          showAlert(`Please enter ${key}.`);
          setLoading(false);
          return;
        }
        if (!validateInput(key, memberData[key])) {
          showAlert(`Please enter a valid ${key}.`);
          setLoading(false);
          return;
        }
        formData.append(key, memberData[key]);
      }
      formData.append("branch", memberData.branch);
      setLoading(true)

      const response = await axios.post(`${API_URL}/api/v1/register`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setLoading(false)
        navigation.pop(1);
      } else {
        setLoading(false)
        console.error('Registration failed:', response.data.error);
      }
    } catch (error) {
      setLoading(false)
      console.error('Error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditEvents = async () => {
    setLoading(true);

    try {
      const formData = new FormData();

      // Append the image if it has been changed
      if (image) {
        formData.append('file', {
          uri: image.assets[0].uri,
          type: image.assets[0].type,
          name: image.assets[0].fileName,
        });
      }

      // Include all fields from memberData
      for (const key of Object.keys(memberData)) {
        formData.append(key, memberData[key]);
      }

      formData.append("_id", id)

      setLoading(true)
      // Make the PUT request
      const response = await axios.put(`${API_URL}/api/v1/admin/me/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          "Authorization": `Bearer ${authData?.token}`
        },
      });

      if (response.data.success) {
        setLoading(false)
        navigation.pop(1);

      } else {
        setLoading(false)
        console.error('Update failed:', response.data.error);
      }
    } catch (error) {
      setLoading(false)
      console.error('Error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(`${API_URL}/api/v1/admin/user/${id}`, {
        headers: {
          "Authorization": `Bearer ${authData?.token}`
        },
      });
      if (response.data.success) {
        setLoading(false)
        navigation.pop(1);
      }
      else {
        setLoading(false)
        console.error('Update failed:', response.data.error);
      }
    } catch (error) {
      setLoading(false)
      console.error('Error:', error.message);
    }
    finally {
      setLoading(false);
    }
  }




  const showAlert = (message) => {
    Alert.alert('Validation Error', message, [{ text: 'OK' }]);
  };

  const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  const placeholderMap = {
    email: 'email@example.com',
    phone: '1234567890',
    countryCode: '91',
    pass: 'password123',
    rollno: '20-CSE-4375',
    name: 'Saurav',
    semester: 'Sem1',
    address: '123 Main Street',
    batchYear: '2022',
    fathername: 'Ramesh Kumar',
    registrationNo: '2010031105',
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Manage Events</Text>

      <SelectDropdown
        data={['Student', 'Admin', 'Faculty', 'Alumni']}
        defaultButtonText={memberData.role || "Select Role"}
        onSelect={(selectedItem, index) => {
          setMemberData({ ...memberData, role: selectedItem.toLowerCase() })
        }}
        buttonTextAfterSelection={(selectedItem, index) => {
          return selectedItem;
        }}
        rowTextForSelection={(item, index) => {
          return item;
        }}
        style={styles.dropdown}
        dropdownStyle={styles.dropdownList}
        buttonStyle={styles.dropdownButton}
        buttonTextStyle={styles.dropdownButtonText}
      />
      <View style={styles.imageButtonContainer}>
        {!imageUri && (
          <View style={styles.imageButtonWrapper}>
            <TouchableOpacity style={styles.imageButton} onPress={handleChoosePhoto}>
              <Text style={styles.buttonText}>Choose Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.imageButton} onPress={handleOpenCamera}>
              <Text style={styles.buttonText}>Open Camera</Text>
            </TouchableOpacity>
          </View>
        )}
        {imageUri && (
          <View>
            <Image
              source={{ uri: imageUri || image.assets[0].uri }}
              style={styles.image}
              onError={(e) => console.log('Image Load Error:', e.nativeEvent.error)}
              defaultSource={avatarImage}
            />
            <TouchableOpacity style={[styles.imageButton, { width: "100%" }]} onPress={() => {
              setImage(null)
              setimageUri('')
            }

            }>
              <Text style={styles.buttonText}>Remove Image</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.inputContainer}>
        {memberData.role == "student" &&
          Object.keys(memberData)
            .filter(item => item !== "dateOfBirth" && item !== "branch" && item !== "role" && item !== "branch" && item !== "semester" && item !== "date")
            .map((key) => (
              <View key={key}>
                <Text style={styles.textInputHeaders}>{capitalizeFirstLetter(key)}</Text>
                <TextInput
                  key={key}
                  style={[
                    styles.input,
                    !validity[key] && styles.invalidInput,
                  ]}
                  placeholder={placeholderMap[key]}
                  onChangeText={(text) => handleInputChange(key, text)}
                  placeholderTextColor="gray"
                  onBlur={() => handleBlur(key)}
                  value={String(memberData[key]) !== "undefined" ? String(memberData[key]) : ''}
                />
              </View>
            ))
        }
        {(memberData.role == "admin" || memberData.role == "faculty") &&
          Object.keys(memberData)
            .filter(item => item !== "dateOfBirth" && item !== "branch" && item !== "role" && item !== "registrationNo" && item !== "registrationNo" && item !== "semester" && item !== "rollno" && item !== "batchYear")
            .map((key) => (
              <View key={key}>
                <Text style={styles.textInputHeaders}>{capitalizeFirstLetter(key)}</Text>
                <TextInput
                  key={key}
                  style={[
                    styles.input,
                    !validity[key] && styles.invalidInput,
                  ]}
                  placeholder={placeholderMap[key]}
                  onChangeText={(text) => handleInputChange(key, text)}
                  placeholderTextColor="gray"
                  onBlur={() => handleBlur(key)}
                  value={String(memberData[key]) !== "undefined" ? String(memberData[key]) : ''}
                />
              </View>
            ))
        }
        {memberData.role == "alumni" &&
          Object.keys(memberData)
            .filter(item => item !== "dateOfBirth" && item !== "branch" && item !== "role" && item !== "branch" && item !== "semester")
            .map((key) => (
              <View key={key}>
                <Text style={styles.textInputHeaders}>{capitalizeFirstLetter(key)}</Text>
                <TextInput
                  key={key}
                  style={[
                    styles.input,
                    !validity[key] && styles.invalidInput,
                  ]}
                  placeholder={placeholderMap[key]}
                  onChangeText={(text) => handleInputChange(key, text)}
                  placeholderTextColor="gray"
                  onBlur={() => handleBlur(key)}
                  value={String(memberData[key]) !== "undefined" ? String(memberData[key]) : ''}
                />
              </View>
            ))
        }

{authData?.member?.role=='admin' && (
 <View>
   <Text style={{color:"black"}}>{capitalizeFirstLetter(authData?.member?.role)} ID</Text>
  <TextInput
   
    style={styles.input}
    placeholder={`${authData.role} ID`}
    onChangeText={(text) => handleInputChange("rollno", text)}
    placeholderTextColor="gray"
    value={memberData?.rollno}
  />
  </View>
)}
      </View>

      <View>
        <Text style={styles.textInputHeaders}>Pick DOB</Text>
        <View style={styles.dateTimePickerWrapper}>
          <TextInput
            placeholder="MM/DD/YYYY"
            placeholderTextColor={'#a3a3a3'}
            style={styles.dateInput}
            value={formattedDate}
            onChangeText={(text) => handleInputChange("date", text)}
          />
          <TouchableOpacity onPress={() => setOpen(true)}>
            <Fontisto name="date" color={'black'} size={25} />
            <DatePicker
              modal
              open={open}
              date={date}
              mode='date'
              theme='light'
              onConfirm={(date) => {
                setOpen(false)
                setDate(date)
                setMemberData({ ...memberData, dateOfBirth: date.toLocaleDateString("en-GB").slice(0, 10) })
              }}

              onCancel={() => {
                setOpen(false)
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
      {memberData.role == "student" && (
        <SelectDropdown
          data={['CSE', 'ME', 'EE', "CIVIL"]}
          defaultButtonText={memberData.branch || "Select Branch"}
          onSelect={(selectedItem, index) => {
            setMemberData({ ...memberData, branch: selectedItem })
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            return selectedItem;
          }}
          rowTextForSelection={(item, index) => {
            return item;
          }}
          style={styles.dropdown}
          dropdownStyle={styles.dropdownList}
          buttonStyle={styles.dropdownButton}
          buttonTextStyle={styles.dropdownButtonText}
        />
      )}
      {memberData.role == "student" && (
        <SelectDropdown
          data={['Sem1', 'Sem2', 'Sem3', 'Sem4', 'Sem5', 'Sem6', 'Sem7', 'Sem8']}
          defaultButtonText={memberData.semester || "Select Semester"}
          onSelect={(selectedItem, index) => {
            setMemberData({ ...memberData, semester: selectedItem })
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            return selectedItem;
          }}
          rowTextForSelection={(item, index) => {
            return item;
          }}
          style={styles.dropdown}
          dropdownStyle={styles.dropdownList}
          buttonStyle={styles.dropdownButton}
          buttonTextStyle={styles.dropdownButtonText}
        />
      )}
      {!loading && !isEditing && (
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmitEvents}
          disabled={!imageUri || loading}
        >
          <Text style={[styles.buttonText, { color: "white" }]}>Submit</Text>
        </TouchableOpacity>
      )}
      {!loading && isEditing && (
        <View>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleEditEvents}
            disabled={!imageUri || loading}
          >
            <Text style={[styles.buttonText, { color: "white" }]}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: "red" }]}
            onPress={handleDeleteEvents}
            disabled={!imageUri || loading}
          >
            <Text style={[styles.buttonText, { color: "white" }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={{ alignSelf: "center", marginVertical: 20 }}>
        {loading && <Loader style={{ width: 50, height: 50 }}
          name={'BallRotate'} // Optional: see list of animations below
          color={appcolor} />}
      </View>
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
  imageButtonContainer: {
    marginTop: 10,
  },
  imageButtonWrapper: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  imageButton: {
    backgroundColor: '#ebebeb',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: "40%",
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 20,
  },
  inputContainer: {
    marginTop: 10,
  },
  input: {
    borderRadius: 5,
    padding: 10,
    marginBottom: 5,
    color: 'black',
    paddingHorizontal: 10,
    backgroundColor: '#ebebeb',
    borderRadius: 10,
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
  },
  dateTimePickerWrapper: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: '#ebebeb',
    borderRadius: 10,
  },
  dateInput: {
    color: "black",
  },
  dropdown: {
    marginTop: 10,
  },
  dropdownList: {
    //
  },
  dropdownButton: {
    backgroundColor: "#ebebeb",
    width: "100%",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,

    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 10
  },
  dropdownButtonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
  textInputHeaders: {
    color: "black",
    marginBottom: 5
  },
  invalidInput: {
    borderColor: 'red',
    borderWidth: 1,
  }
});

export default ManageEvents;

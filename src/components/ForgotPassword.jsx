import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Snackbar } from 'react-native-paper';
import axios from 'axios';
import Loader from 'react-native-loader-kit'; // Import loader component
import { appcolor } from '../constants';
import API_URL from "../connection/url"
export default function ForgotPassword({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [validEmail, setValidEmail] = useState(true);
  const [loading, setLoading] = useState(false); // State for loader



  const handleForgotPassword = async () => {
    if (!validateEmail(email)) {
      setValidEmail(false);
      return;
    }

    try {
      setLoading(true); // Show loader while sending email
      const response = await axios.post(`${API_URL}/api/v1/password/forgot`, {
        email: email
      });

      if (response.data.success) {
        setShowVerification(true);
        setSnackbarMessage(response.data.message);
        setSnackbarVisible(true);
      } else {
        setSnackbarMessage('Failed to send email');
        setSnackbarVisible(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setSnackbarMessage('Something went wrong');
      setSnackbarVisible(true);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  const handleVerifyCode = async () => {
    try {
      setLoading(true); // Show loader while verifying code
      const response = await axios.put(`${API_URL}/api/v1/password/reset`, {
        email: email,
        randomPass: verificationCode,
        password: password,
        confirmPassword: confirmPassword
      });

      if (response.data.success) {
        setSnackbarMessage('Password reset successful');
        setSnackbarVisible(true);
        setTimeout(()=>{
            navigation.pop(1)
        },5000)
      } else {
        setSnackbarMessage('Failed to verify code');
        setSnackbarVisible(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setSnackbarMessage('Something went wrong');
      setSnackbarVisible(true);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <View style={styles.container}>

        <Text style={styles.headerText}>Forgot Password</Text>
      <TextInput
        style={[styles.input, !validEmail && styles.invalidInput]}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        onBlur={() => {
          if (!validateEmail(email)) {
            setValidEmail(false);
          } else {
            setValidEmail(true);
          }
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCompleteType="email"
        placeholderTextColor={"black"}
      />
      {!validEmail && (
        <Text style={styles.errorText}>Please enter a valid email address.</Text>
      )}
     {!loading && !showVerification && (
         <Button title="Send Code" onPress={handleForgotPassword} color={appcolor} />
     )}

      {showVerification && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter verification code"
            value={verificationCode}
            onChangeText={setVerificationCode}
            keyboardType="numeric"
            placeholderTextColor={"black"}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter new password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            placeholderTextColor={"black"}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={true}
            placeholderTextColor={"black"}
          />
         {!loading && (
             <Button title="Verify Code" onPress={handleVerifyCode} color={appcolor} />
         )}
          <Text style={styles.text}>Verification code is valid for 15 minutes</Text>
        </>
      )}

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000} // Adjust duration as needed
      >
        {snackbarMessage}
      </Snackbar>

      {/* Loader component */}
      {loading && <Loader  style={{ width: 50, height: 50 }}
  name={'BallRotate'} // Optional: see list of animations below
  color={appcolor} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerText:{
    color:"black",
    marginBottom:40,
    fontSize:30,
    fontFamily:"Montserrat-Bold"
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 4,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#f1f3f5', // Background color
    color: '#495057', // Text color
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  text: {
    marginTop: 10,
    color:"red"
  },
  invalidInput: {
    borderColor: 'red',
  },
});

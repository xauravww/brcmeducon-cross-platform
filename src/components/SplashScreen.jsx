import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const SplashScreen = () => {
    return (
        <View style={styles.container}>
            <Image 
                source={require('../assets/images/brcm_logo_big.png')} // Replace with your image path
                style={styles.logo}
                resizeMode="contain" // Adjust the image size and aspect ratio
            />
            <Text style={styles.title}>BRCM EduCon</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff', // Optional: set background color
    },
    logo: {
        width: 200, // Adjust the width
        height: 200, // Adjust the height
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        color: 'black',
    },
});

export default SplashScreen;

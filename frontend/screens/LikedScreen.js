// screens/LoginScreen.js
import React from 'react';
import { Text, StyleSheet} from 'react-native';

const LikedScreen = () => {
    return (
        <Text styles={styles.title}>Welcome to the Liked Screen!</Text>
    );
};


const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20,
    }
});

 export default LikedScreen; 
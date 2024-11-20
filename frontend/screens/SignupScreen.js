import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Alert } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { app, firestore } from '../configs/firebase';
import Constants from 'expo-constants';
import axios from 'axios';

const SignupScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const BASE_API_URL = Constants.expoConfig.extra.BASE_API_URL;
    const handleSignup = async () => {

        if (!email || !username || !password || password !== confirmPassword) {
            Alert.alert('Error', 'All fields are required and passwords must match');
            return;
        }
    
        setLoading(true);
    
        try {
            const auth = getAuth(app);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log('User signed up:', userCredential.user.email);

            const user = auth.currentUser;
            // Update the user's display name
            await updateProfile(auth.currentUser, {
                displayName: username,
            });
    
            // Send email verification
            await sendEmailVerification(auth.currentUser);

            // Add user to MongoDB
            const response = await axios.post(`${BASE_API_URL}/auth/create`, {
                email: user.email,
                username,
            });
            const data = response.data;
            console.log(data);


            setEmail('');
            setUsername('');
            setPassword('');
            setConfirmPassword('');
            Alert.alert('Success', 'Signup successful. Please log in.');
            navigation.navigate('Login');
        } catch (error) {
            Alert.alert('Signup failed', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ImageBackground source={require('../assets/signupPage_background.png')} style={styles.background}>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>Signup</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        value={username}
                        onChangeText={setUsername}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm Password"
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                    <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
                        <Text style={styles.buttonText}>{loading ? 'Signing up...' : 'Signup'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.secondaryButtonText}>Already have an account? Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    container: {
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20,
    },
    input: {
        backgroundColor: 'white',
        width: '80%',
        marginBottom: 10,
        padding: 10,
        borderRadius: 5,
    },
    button: {
        backgroundColor: '#3498db',
        padding: 10,
        borderRadius: 5,
        width: '80%',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    secondaryButton: {
        marginTop: 15,
    },
    secondaryButtonText: {
        color: '#3498db',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
});

export default SignupScreen;

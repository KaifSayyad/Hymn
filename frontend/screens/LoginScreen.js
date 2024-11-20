import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

import { app } from '../configs/firebase';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Email and password are required');
            return;
        }
    
        setLoading(true);
        const auth = getAuth(app);
    
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setEmail('');
            setPassword('');
            navigation.navigate('Home');  // Navigate to HomeScreen upon successful login
        } catch (error) {
            Alert.alert('Login failed', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = () => {
        setEmail('');
        setPassword('');
        navigation.navigate('Signup');  // Navigate to Signup screen
    };

    return (
        <ImageBackground source={require('../assets/loginScreen_background.png')} style={styles.background}>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>Login</Text>
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
                    <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                        <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.secondaryButton} onPress={handleSignup}>
                        <Text style={styles.secondaryButtonText}>Don't have an account? Signup</Text>
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

export default LoginScreen;

// App.js
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Constants from 'expo-constants';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import LikedScreen from './screens/LikedScreen';
import RoomsScreen from './screens/RoomsScreen';
import LoadingScreen from './utils/LoadingScreen';
import AddSongScreen from './utils/AddSongScreen';
import Navbar from './utils/Navbar';

const Stack = createNativeStackNavigator();

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // null for initial loading state
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                await user.reload(); // Reload user to update user data
                setIsAuthenticated(user.emailVerified); // Check if email is verified
            } else {
                setIsAuthenticated(false); // User is not logged in
            }
        });
        return unsubscribe; // Clean up subscription on unmount
    }, [auth]);

    if (isAuthenticated === null) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <NavigationContainer>
                    <Stack.Navigator>
                        <Stack.Screen name="Loading" component={LoadingScreen} options={{ headerShown: false }} />
                    </Stack.Navigator>
                </NavigationContainer>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ animationTypeForReplace: 'push' }}>
                    {(!isAuthenticated) ? (
                        <>
                            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
                        </>
                    ) : (
                        <>
                            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="Search" component={SearchScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="Liked" component={LikedScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="Rooms" component={RoomsScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="AddSong" component={AddSongScreen} options={{ headerShown: false }} />
                        </>
                    )}
                </Stack.Navigator>
                {isAuthenticated && <Navbar />}
            </NavigationContainer>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        paddingTop: Constants.statusBarHeight + 10,
        paddingBottom: 72,
        flex: 1,
        backgroundColor: '#333333', // Dark background color to match the theme
    },
});

export default App;

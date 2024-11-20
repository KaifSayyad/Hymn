import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';

const Navbar = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <BlurView intensity={50} style={styles.blurContainer} tint="light">
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
                    <Ionicons name="home-outline" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Search')}>
                    <Ionicons name="search-outline" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Rooms')}>
                    <Ionicons name="people-outline" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddSong')}>
                    <Ionicons name="add-circle-outline" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Liked')}>
                    <Ionicons name="heart-outline" size={24} color="white" />
                </TouchableOpacity>
            </BlurView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 7,
        left: 20,
        right: 20,
        alignItems: 'center',
    },
    blurContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 30,
        overflow: 'hidden',  // Ensure children are clipped within rounded edges
    },
    button: {
        padding: 10,
    },
});

export default Navbar;

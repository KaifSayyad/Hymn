import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, Image } from 'react-native';
import SongUtil from '../utils/SongUtil.js';
import Constants from 'expo-constants';
import { useFonts } from 'expo-font';

const HomeScreen = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSongId, setCurrentSongId] = useState(null); // Track current song ID
  const [fontsLoaded] = useFonts({
    'GreatVibesRegular': require('../assets/fonts/GreatVibesRegular.ttf'), // Load the custom font
  });

  const BASE_API_URL = Constants.expoConfig.extra.API_URL;

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch(`${BASE_API_URL}/songs/all`);
        const data = await response.json();
        setSongs(data);
      } catch (error) {
        console.error('Error fetching songs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  if (loading) {
    return <Text style={styles.loadingText}>Loading songs...</Text>;
  }

  if (!fontsLoaded) {
    return <Text style={styles.loadingText}>Loading fonts...</Text>; // Show loading until font is loaded
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.title} > Hymn </Text>

      </View>

      {/* Song List */}
      <FlatList
        data={songs}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <SongUtil
            song={item}
            currentSongId={currentSongId}
            setCurrentSongId={setCurrentSongId} // Pass down the state
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333333', // Dark background color
    paddingHorizontal: 10,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 20,
  },
  logo: {
    top: 8,
    width: 40,
    height: 40,
    marginRight: 10,
  },
  title: {
    top: 8,
    fontSize: 24,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.5)',
    fontFamily: 'GreatVibesRegular',
  },
  loadingText: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default HomeScreen;

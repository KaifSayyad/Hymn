import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, Modal, FlatList } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

const SongUtil = ({ song, currentSongId, setCurrentSongId, rooms }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const [scrollAnim] = useState(new Animated.Value(0));
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Scroll title animation effect
  useEffect(() => {
    if (isPlaying && song.title.length > 15) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scrollAnim, {
            toValue: -screenWidth, // Scroll effect
            duration: 5000,
            useNativeDriver: true,
          }),
          Animated.timing(scrollAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      scrollAnim.setValue(0); // Reset when not playing or if title is small
    }
  }, [isPlaying, song.title.length, scrollAnim]);

  // Unload the sound when component unmounts
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  // Handle play/pause action when song is clicked
  const handleSongClick = async () => {
    console.log('Playing song ', song.title);
    if (currentSongId !== song._id) {
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: song.s3Url },
        { shouldPlay: true }
      );
      setSound(newSound);
      setIsPlaying(true);
      setCurrentSongId(song._id); // Set the current song ID to prevent multiple songs playing
    } else {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    }
  };

  // Open modal to select a room
  const openRoomModal = () => {
    setModalVisible(true);
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    setModalVisible(false);
    // Handle adding song to the selected room here
    console.log(`Added to room: ${room.name}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.songInfo}>
        <Animated.Text
          style={[
            styles.title,
            {
              transform: [{ translateX: isPlaying ? scrollAnim : 0 }],
              color: isPlaying ? '#1DB954' : '#fff', // Change font color when playing
            },
          ]}
          numberOfLines={1}
          onPress={handleSongClick}  // Play the song on title click
        >
          {song.title}
        </Animated.Text>
        <Text style={styles.artist}>{song.artist}</Text>
      </View>

      <TouchableOpacity onPress={openRoomModal} style={styles.menuButton}>
        <Ionicons name="ellipsis-vertical" size={24} color="white" />
      </TouchableOpacity>

      {/* Modal for selecting a room */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Room</Text>
            <FlatList
              data={rooms}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.roomItem}
                  onPress={() => handleRoomSelect(item)}
                >
                  <Text style={styles.roomText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    marginBottom: 10,
    height: 60,
  },
  songInfo: {
    flex: 1,
    marginRight: 10,
    overflow: 'hidden', // Ensure text doesn't overflow
  },
  title: {
    top: 8,
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    width: screenWidth * 0.6, // Limit title width to screen portion
  },
  artist: {
    fontSize: 14,
    color: '#aaa',
  },
  menuButton: {
    paddingLeft: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: screenWidth * 0.8,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    position: 'relative',
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  roomItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  roomText: {
    fontSize: 16,
  },
});

export default SongUtil;

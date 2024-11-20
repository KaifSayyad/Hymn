import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import Constants from 'expo-constants';


const AddSongScreen = () => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [genre, setGenre] = useState('');
  const [songFile, setSongFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state to manage submission state
  const BASE_API_URL = Constants.expoConfig.extra.BASE_API_URL;

  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
      });
      if (result != null) {
        console.log(result);
        setSongFile(result.assets[0]);
      }
    } catch (error) {
      console.error('Error picking file:', error);
    }
  };

  const handleSubmit = async () => {
    if (!title || !songFile) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('artist', artist);
    formData.append('album', album);
    formData.append('genre', genre);
    
    const fileData = await FileSystem.readAsStringAsync(songFile.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    
    formData.append('songFile', {
      uri: songFile.uri,
      name: songFile.name,
      type: 'audio/mpeg',
      data: fileData
    });

    setIsSubmitting(true); // Disable submit button during submission

    try {
      const response = await fetch(`${BASE_API_URL}/songs/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
    
      if (response.ok) {
        Alert.alert('Success', 'Song added successfully!');
      } else {
        console.log(response);
        Alert.alert('Error', 'Failed to add the song.');
      }
    } catch (error) {
      console.error('Error uploading song:', error);
      Alert.alert('Error', 'Could not upload the song. Please try again.');
    } finally {
      setIsSubmitting(false); // Re-enable submit button after request completes
    }
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Song Title" value={title} onChangeText={setTitle} />
      <TextInput style={styles.input} placeholder="Artist" value={artist} onChangeText={setArtist} />
      <TextInput style={styles.input} placeholder="Album" value={album} onChangeText={setAlbum} />
      <TextInput style={styles.input} placeholder="Genre" value={genre} onChangeText={setGenre} />

      <TouchableOpacity onPress={handlePickFile} style={styles.filePicker}>
        <Text style={styles.filePickerText}>
          {songFile ? `File selected: ${songFile.name}` : 'Select an audio file'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleSubmit}
        style={[styles.submitButton, isSubmitting && { backgroundColor: '#ddd' }]} // Disabled button style
        disabled={isSubmitting} // Disable button during submission
      >
        <Text style={styles.submitButtonText}>
          {isSubmitting ? 'Submitting Song...' : 'Submit Song'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#2a2a2a'
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 20,
    fontSize: 16,
    paddingVertical: 10,
    backgroundColor: 'white'
  },
  filePicker: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  filePickerText: {
    fontSize: 16,
    color: '#555',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default AddSongScreen;

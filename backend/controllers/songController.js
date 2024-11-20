import Song from '../models/Song.js';
import { s3Client } from '../config/s3ClientConfig.js';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import axios from 'axios';

dotenv.config();

export const addSong = async (req, res) => {
  try {
    const { title, artist, album, genre } = req.body;
    console.log(req.file);
    if (!req.file || !title) {
      return res.status(400).json({ error: 'File, title, and artist are required fields' });
    }

    const file = req.file;
    console.log(file);
    const s3Key = `songs/${uuidv4()}-${file.originalname}`;

    // Configure S3 upload parameters
    const s3Params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: s3Key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    // Upload file to S3
    console.log('Uploading file to S3...');
    await s3Client.send(new PutObjectCommand(s3Params));
    const s3Url = `https://${process.env.S3_BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${s3Key}`;
    // Create new song entry in MongoDB
    const newSong = new Song({
      title,
      artist,
      album,
      genre,
      s3Key,
      s3Url: s3Url, // URL from S3
    });

    await newSong.save();

    res.status(201).json({ message: 'Song uploaded successfully', song: newSong });
  } catch (error) {
    console.error('Error uploading song:', error);
    res.status(500).json({ error: 'Failed to upload song' });
  }
};


// Function to retrieve songs
export const getSongs = async (req, res) => {
    try {
        const songs = await Song.find({});
        res.status(200).json(songs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch songs' });
    }
};

// Function to retrieve a single song by ID
export const fetchCurrentSong = async (req, res) => {
  console.log("Fetching current song...");
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
    });

    response.data.pipe(res);
  } catch (error) {
    console.error('Error fetching song:', error);
    res.status(500).json({ error: 'Failed to fetch song' });
  }
};
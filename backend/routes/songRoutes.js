import express from 'express';
import multer from 'multer';
import { addSong, getSongs, fetchCurrentSong } from '../controllers/songController.js';

const router = express.Router();

// Multer configuration for audio file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Error: File type not supported!')); // Reject the file
    }
  }
});

// Route to add a new song and upload the file to S3
router.post('/add', upload.single('songFile'), addSong);

// Route to get all songs
router.get('/all', getSongs);

// Route to fetch the current song by song ID
router.get('/current', fetchCurrentSong);

export default router;

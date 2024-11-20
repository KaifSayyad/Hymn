import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    artist: {
        type: String,
        required: false,
    },
    album: {
        type: String,
        required: false,
    },
    s3Key: {
        type: String,
        required: true,
        unique: true,
    },
    s3Url: {
        type: String,
        required: true,
    },
    uploadDate: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('Song', songSchema);

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    likedSongs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song',
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('User', userSchema);

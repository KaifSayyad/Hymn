import User from '../models/User.js';

export const createUser = async (req, res) => {
  const { email, username } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user document
    const newUser = new User({
      email,
      username: username, // Save the hashed password
    });

    // Save the user to MongoDB
    await newUser.save();

    // Respond with success
    return res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    return res.status(200).json(user);
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

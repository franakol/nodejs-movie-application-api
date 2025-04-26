const User = require('../models/user.model');
const Movie = require('../models/movie.model');

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    // Don't allow password updates through this endpoint
    if (req.body.password) {
      delete req.body.password;
    }
    
    // Don't allow changing admin status
    if (req.body.isAdmin !== undefined && !req.user.isAdmin) {
      delete req.body.isAdmin;
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: req.body },
      { new: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add movie to user's list
exports.addToMyList = async (req, res) => {
  try {
    const { movieId } = req.body;
    
    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    // Check if movie is already in user's list
    const user = await User.findById(req.user.id);
    if (user.myList.includes(movieId)) {
      return res.status(400).json({ message: 'Movie already in your list' });
    }
    
    // Add movie to user's list
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $push: { myList: movieId } },
      { new: true }
    ).select('-password');
    
    res.status(200).json({
      message: 'Movie added to your list',
      myList: updatedUser.myList
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Remove movie from user's list
exports.removeFromMyList = async (req, res) => {
  try {
    const { movieId } = req.params;
    
    // Remove movie from user's list
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { myList: movieId } },
      { new: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({
      message: 'Movie removed from your list',
      myList: updatedUser.myList
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's list
exports.getMyList = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('myList');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user.myList);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete user (admin or self)
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user is trying to delete themselves or is an admin
    if (userId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this user' });
    }
    
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

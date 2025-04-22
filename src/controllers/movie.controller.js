const Movie = require('../models/movie.model');

// Get all movies
exports.getAllMovies = async (req, res) => {
  try {
    const { genre, type, limit } = req.query;
    let query = {};
    
    // Filter by genre if provided
    if (genre) {
      query.genre = { $in: [genre] };
    }
    
    // Filter by type (movie or series)
    if (type === 'movies') {
      query.isSeries = false;
    } else if (type === 'series') {
      query.isSeries = true;
    }
    
    // Get movies based on query
    let movies;
    if (limit) {
      movies = await Movie.find(query).limit(parseInt(limit));
    } else {
      movies = await Movie.find(query);
    }
    
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get featured content
exports.getFeatured = async (req, res) => {
  try {
    const { type } = req.query;
    let query = { featured: true };
    
    if (type === 'movies') {
      query.isSeries = false;
    } else if (type === 'series') {
      query.isSeries = true;
    }
    
    const featured = await Movie.findOne(query);
    res.status(200).json(featured);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get movie by ID
exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new movie (admin only)
exports.createMovie = async (req, res) => {
  try {
    const newMovie = new Movie(req.body);
    const savedMovie = await newMovie.save();
    res.status(201).json(savedMovie);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update movie (admin only)
exports.updateMovie = async (req, res) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedMovie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.status(200).json(updatedMovie);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete movie (admin only)
exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.status(200).json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get random movie or series
exports.getRandomContent = async (req, res) => {
  try {
    const { type } = req.query;
    let query = {};
    
    if (type === 'movies') {
      query.isSeries = false;
    } else if (type === 'series') {
      query.isSeries = true;
    }
    
    const count = await Movie.countDocuments(query);
    const random = Math.floor(Math.random() * count);
    const content = await Movie.findOne(query).skip(random);
    
    res.status(200).json(content);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Search movies
exports.searchMovies = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const movies = await Movie.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { genre: { $in: [new RegExp(query, 'i')] } }
      ]
    });
    
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

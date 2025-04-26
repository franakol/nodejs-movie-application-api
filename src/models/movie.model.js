const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  trailerUrl: { type: String, default: '' },
  year: { type: Number, required: true },
  genre: { type: [String], required: true },
  duration: { type: String, required: true },
  rating: { type: Number, min: 0, max: 10, default: 0 },
  isSeries: { type: Boolean, default: false },
  seasons: { type: Number, default: 0 },
  episodes: [{
    title: String,
    description: String,
    duration: String,
    thumbnailUrl: String,
    videoUrl: String,
    season: Number,
    episodeNumber: Number
  }],
  cast: [{
    name: String,
    character: String,
    profilePicture: String
  }],
  director: { type: String, default: '' },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);

require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('../models/movie.model');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

// Sample movie data
const movies = [
  {
    title: 'Stranger Things',
    description: 'When a young boy disappears, his mother, a police chief, and his friends must confront terrifying supernatural forces in order to get him back.',
    imageUrl: 'https://example.com/stranger-things.jpg',
    trailerUrl: 'https://example.com/stranger-things-trailer',
    year: 2016,
    genre: ['Sci-Fi', 'Horror', 'Drama'],
    duration: '50m',
    rating: 8.7,
    isSeries: true,
    seasons: 4,
    episodes: [
      {
        title: 'Chapter One: The Vanishing of Will Byers',
        description: 'On his way home from a friend\'s house, young Will sees something terrifying. Nearby, a sinister secret lurks in the depths of a government lab.',
        duration: '50m',
        thumbnailUrl: 'https://example.com/st-s01e01.jpg',
        videoUrl: 'https://example.com/st-s01e01',
        season: 1,
        episodeNumber: 1
      }
    ],
    cast: [
      {
        name: 'Millie Bobby Brown',
        character: 'Eleven',
        profilePicture: 'https://example.com/millie.jpg'
      },
      {
        name: 'Finn Wolfhard',
        character: 'Mike Wheeler',
        profilePicture: 'https://example.com/finn.jpg'
      }
    ],
    director: 'Igitangaza EMMY',
    featured: true
  },
  {
    title: 'The Queen\'s Gambit',
    description: 'Orphaned at the tender age of nine, prodigious introvert Beth Harmon discovers and masters the game of chess in 1960s USA. But child stardom comes at a price.',
    imageUrl: 'https://example.com/queens-gambit.jpg',
    trailerUrl: 'https://example.com/queens-gambit-trailer',
    year: 2020,
    genre: ['Drama'],
    duration: '60m',
    rating: 8.6,
    isSeries: true,
    seasons: 1,
    episodes: [
      {
        title: 'Openings',
        description: 'Sent to an orphanage at age 9, Beth develops an uncanny talent for chess and a growing dependence on the tranquilizers given to the children.',
        duration: '60m',
        thumbnailUrl: 'https://example.com/qg-s01e01.jpg',
        videoUrl: 'https://example.com/qg-s01e01',
        season: 1,
        episodeNumber: 1
      }
    ],
    cast: [
      {
        name: 'Anya Taylor-Joy',
        character: 'Beth Harmon',
        profilePicture: 'https://example.com/anya.jpg'
      }
    ],
    director: 'Scott Frank',
    featured: false
  },
  {
    title: 'The Irishman',
    description: 'Hitman Frank Sheeran looks back at the secrets he kept as a loyal member of the Bufalino crime family.',
    imageUrl: 'https://example.com/irishman.jpg',
    trailerUrl: 'https://example.com/irishman-trailer',
    year: 2019,
    genre: ['Crime', 'Drama', 'Biography'],
    duration: '3h 29m',
    rating: 7.8,
    isSeries: false,
    cast: [
      {
        name: 'Robert De Niro',
        character: 'Frank Sheeran',
        profilePicture: 'https://example.com/deniro.jpg'
      },
      {
        name: 'Al Pacino',
        character: 'Jimmy Hoffa',
        profilePicture: 'https://example.com/pacino.jpg'
      }
    ],
    director: 'Martin Scorsese',
    featured: true
  }
];

// Sample admin user
const adminUser = {
  username: 'admin',
  email: 'admin@example.com',
  password: 'admin123',
  isAdmin: true
};

// Seed function
async function seedDatabase() {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/movieapp';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
    
    // Clear existing data
    await Movie.deleteMany({});
    await User.deleteMany({});
    
    // Insert sample movies
    await Movie.insertMany(movies);
    console.log('Sample movies inserted successfully');
    
    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminUser.password, salt);
    
    await User.create({
      ...adminUser,
      password: hashedPassword
    });
    
    console.log('Admin user created successfully');
    console.log('Database seeded successfully');
    
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error seeding database:', error);
    // Ensure connection is closed even if there's an error
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('MongoDB connection closed after error');
    }
  }
}

module.exports = seedDatabase;

# Netflix-like Movie Application API

A RESTful API for a Netflix-like streaming service built with Node.js, Express, and MongoDB. This API provides endpoints for user authentication, movie/series management, and user preferences.

## Table of Contents

- [Features](#features)
- [Folder Structure](#folder-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Testing with Postman](#testing-with-postman)
- [Development Process](#development-process)
- [Error Handling](#error-handling)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication (register, login)
- Movie and TV series management
- User profiles with personal watchlists
- Content filtering by genre, type (movie/series)
- Featured and random content recommendations
- Admin functionalities for content management

## Folder Structure

```
nodejs-movie-application-api/
├── node_modules/
├── src/
│   ├── config/
│   │   └── seed-data.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── movie.controller.js
│   │   └── user.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── models/
│   │   ├── movie.model.js
│   │   └── user.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── movie.routes.js
│   │   └── user.routes.js
│   └── server.js
├── .env
├── .env.example
├── .gitignore
├── LICENSE
├── package-lock.json
├── package.json
└── README.md
```

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (v4.4 or higher, local installation or MongoDB Atlas account)

## Installation

### Installing MongoDB

#### Windows
1. Download the MongoDB Community Server installer from the [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Run the installer and follow the installation wizard
   - Choose "Complete" setup type
   - Check "Install MongoDB as a Service"
   - Keep the default data directory or choose a custom path
3. After installation, MongoDB will run as a Windows service automatically
4. Verify the installation by opening Command Prompt and running:
   ```cmd
   mongod --version
   ```

#### macOS
1. Using Homebrew (recommended):
   ```bash
   brew tap mongodb/brew
   brew install mongodb-community@6.0
   brew services start mongodb/brew/mongodb-community@6.0
   ```
2. Verify the installation:
   ```bash
   mongod --version
   ```

#### Linux (Ubuntu/Debian)
1. Import the MongoDB public GPG key:
   ```bash
   curl -fsSL https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
   ```
2. Create a list file for MongoDB:
   ```bash
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
   ```
3. Update the package list and install MongoDB:
   ```bash
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   ```
4. Start MongoDB service:
   ```bash
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```
5. Verify the installation:
   ```bash
   mongod --version
   ```

### Alternative: Using MongoDB Atlas (Cloud Database)

If you prefer not to install MongoDB locally:

1. Create a free account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a new cluster (the free tier is sufficient)
3. Configure network access (add your IP address)
4. Create a database user with read/write permissions
5. Get your connection string from the "Connect" button
6. Use this connection string in your `.env` file (see Configuration section)

### Setting up the Application

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/nodejs-movie-application-api.git
   cd nodejs-movie-application-api
   ```

2. Install dependencies
   ```bash
   npm install
   ```

## Configuration

1. Create a `.env` file in the root directory based on the `.env.example` file
   ```bash
   # On macOS/Linux
   cp .env.example .env
   
   # On Windows
   copy .env.example .env
   ```

2. Update the `.env` file with your configuration values:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/netflix-api
   JWT_SECRET=your_jwt_secret_key_here
   ```

   If you're using MongoDB Atlas, your connection string will look like:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/netflix-api
   ```

3. Generate a secure JWT secret:
   ```bash
   # On macOS/Linux
   openssl rand -base64 32
   
   # On Windows (using Node.js)
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```
   Copy the generated string and use it as your JWT_SECRET in the .env file.

## Running the Application

1. Make sure MongoDB is running:
   ```bash
   # Check if MongoDB is running (macOS/Linux)
   ps aux | grep mongod
   
   # Check if MongoDB is running (Windows)
   tasklist | findstr mongod
   ```

2. Start the server in development mode
   ```bash
   npm run dev
   ```

3. Start the server in production mode
   ```bash
   npm start
   ```

4. The API will be available at `http://localhost:5000`

5. Seed the database with sample data (optional)
   ```bash
   npm run seed
   ```

## API Endpoints

### Authentication

- **POST /api/auth/register** - Register a new user
  - Request body: `{ "username": "user1", "email": "user1@example.com", "password": "password123" }`

- **POST /api/auth/login** - Login a user
  - Request body: `{ "email": "user1@example.com", "password": "password123" }`

### Movies

- **GET /api/movies** - Get all movies (query params: genre, type, limit)
- **GET /api/movies/featured** - Get featured content (query params: type)
- **GET /api/movies/random** - Get random content (query params: type)
- **GET /api/movies/search** - Search movies (query params: query)
- **GET /api/movies/:id** - Get movie by ID
- **POST /api/movies** - Create new movie (admin only)
- **PUT /api/movies/:id** - Update movie (admin only)
- **DELETE /api/movies/:id** - Delete movie (admin only)

### Users

- **GET /api/users/profile** - Get user profile
- **PUT /api/users/profile** - Update user profile
- **GET /api/users/mylist** - Get user's watchlist
- **POST /api/users/mylist** - Add movie to watchlist
- **DELETE /api/users/mylist/:movieId** - Remove movie from watchlist
- **GET /api/users** - Get all users (admin only)
- **DELETE /api/users/:id** - Delete user (admin or self)

## Testing with Postman

1. Download and install [Postman](https://www.postman.com/downloads/)

2. Create a new collection for the Netflix API

3. Set up environment variables:
   - `BASE_URL`: http://localhost:5000
   - `TOKEN`: (This will be filled after login)

4. Authentication flow:
   - Register a user using the `/api/auth/register` endpoint
   - Login with the user credentials using the `/api/auth/login` endpoint
   - Save the returned token as the `TOKEN` environment variable

5. Set up a request authorization:
   - In the Authorization tab, select "Bearer Token"
   - Use `{{TOKEN}}` as the token value

6. Create requests for each endpoint
   - For POST/PUT requests, set the body to "raw" and format as JSON
   - Example movie creation body:
   ```json
   {
     "title": "Inception",
     "description": "A thief who steals corporate secrets through the use of dream-sharing technology.",
     "imageUrl": "https://example.com/inception.jpg",
     "year": 2010,
     "genre": ["Action", "Sci-Fi", "Thriller"],
     "duration": "2h 28m",
     "rating": 8.8,
     "isSeries": false,
     "director": "Christopher Nolan",
     "cast": [
       {
         "name": "Leonardo DiCaprio",
         "character": "Cobb",
         "profilePicture": "https://example.com/leo.jpg"
       }
     ]
   }
   ```

## Development Process

Here's a step-by-step guide to how this project was created:

1. **Project Initialization**
   ```bash
   mkdir nodejs-movie-application-api
   cd nodejs-movie-application-api
   git init
   npm init -y
   ```

2. **Installing Dependencies**
   ```bash
   npm install express mongoose jsonwebtoken bcryptjs cors dotenv
   npm install --save-dev nodemon
   ```
   
   Add the following scripts to package.json:
   ```json
   "scripts": {
     "start": "node src/server.js",
     "dev": "nodemon src/server.js",
     "seed": "node src/config/seed-data.js"
   }
   ```

3. **Setting up Project Structure**
   ```bash
   mkdir -p src/{controllers,models,routes,config,middleware,utils} public
   ```

4. **Creating Server Configuration**
   - Created `server.js` with Express setup
   - Set up middleware and routes
   - Configured MongoDB connection

5. **Defining Database Models**
   - Created User model with authentication methods
   - Created Movie model with all necessary fields

6. **Implementing Authentication**
   - Created JWT-based authentication system
   - Implemented register and login endpoints
   - Added middleware for route protection

7. **Creating API Endpoints**
   - Implemented CRUD operations for movies
   - Added user profile management
   - Created watchlist functionality

8. **Testing and Documentation**
   - Tested all endpoints with Postman
   - Created comprehensive README documentation

## Error Handling

### Error Response

```json
{
  "message": "Error message",
  "code": 400
}
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running on your system
   - Check your connection string in the `.env` file
   - For Windows users, verify MongoDB is running as a service (Services app)
   - For macOS users, run `brew services list` to check MongoDB status

2. **Port Already in Use**
   - Change the PORT value in your `.env` file
   - Check if another application is using port 5000

3. **JWT Authentication Issues**
   - Ensure your JWT_SECRET is properly set in the `.env` file
   - Check that the token is being sent in the Authorization header

4. **Version Compatibility Issues**
   - MongoDB version compatibility: If you encounter errors with newer MongoDB versions, consider downgrading to MongoDB 6.0 which has wider OS compatibility

## Contributing

1. Fork the repository
2. Create a new branch
3. Make changes
4. Commit changes
5. Push changes
6. Create a pull request

## License

MIT License

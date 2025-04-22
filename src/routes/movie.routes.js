const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movie.controller');
const { verifyToken, verifyAdmin } = require('../middleware/auth.middleware');

// Public routes
router.get('/', movieController.getAllMovies);
router.get('/featured', movieController.getFeatured);
router.get('/random', movieController.getRandomContent);
router.get('/search', movieController.searchMovies);
router.get('/:id', movieController.getMovieById);

// Protected routes (admin only)
router.post('/', verifyToken, verifyAdmin, movieController.createMovie);
router.put('/:id', verifyToken, verifyAdmin, movieController.updateMovie);
router.delete('/:id', verifyToken, verifyAdmin, movieController.deleteMovie);

module.exports = router;

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken, verifyAdmin } = require('../middleware/auth.middleware');

// Protected routes (user)
router.get('/profile', verifyToken, userController.getUserProfile);
router.put('/profile', verifyToken, userController.updateUserProfile);
router.get('/mylist', verifyToken, userController.getMyList);
router.post('/mylist', verifyToken, userController.addToMyList);
router.delete('/mylist/:movieId', verifyToken, userController.removeFromMyList);

// Protected routes (admin only)
router.get('/', verifyToken, verifyAdmin, userController.getAllUsers);
router.delete('/:id', verifyToken, userController.deleteUser);

module.exports = router;

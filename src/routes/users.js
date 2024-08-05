const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/movies', userController.getMovies);
router.post('/rentMovie/:id', userController.rentMovie);
router.post('/returnMovie/:id', userController.returnMovie);
router.post('/comment/:id', userController.addComment);
router.delete('/comment/:id', userController.deleteComment);
router.get('/history', userController.getRentalHistory);
router.put('/edit-profile', userController.editProfile);

module.exports = router;

const express = require('express');
const viewsController = require('../controllers/viewsControllers');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(viewsController.alerts);

router.get('/', authController.isLogedIn,viewsController.getAllQuarters ,viewsController.getAllSumScores,viewsController.addNames);
router.get('/login/login', authController.isLogedIn, viewsController.getLoginForm);
router.get('/:quarter', authController.isLogedIn,viewsController.getQuarterGames,viewsController.getGameSumScores,viewsController.addNamesGames);
router.get('/game/:date', authController.isLogedIn,viewsController.getGames);
// router.get('/tour/:slug', authController.isLogedIn, viewsController.getTour);

router.get('/me/me', authController.protect, viewsController.getAccount);
router.get('/me/scores', authController.isLogedIn, viewsController.postScores);


// router.get('/my-tours', authController.protect, viewsController.getMyTours);

// router.post(
//   '/submit-user-data',
//   authController.protect,
//   viewsController.updateUserData
// );

module.exports = router;
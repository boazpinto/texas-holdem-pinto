const express = require('express');
const scoreControllers=require('../controllers/scoreControllers')
const authControllers=require('../controllers/authController')

const router=express.Router();

//protect all routes after this middleware
router.use(authControllers.protect);

router.route('/')
  .get( scoreControllers.getAllScores)
  .post(scoreControllers.addScore);
router.route('/quarters')
  .get( scoreControllers.getAllQuarters)
router.route('/sum/:quarter')
  .get( scoreControllers.getTotalsForQuarter);



     
module.exports=router;
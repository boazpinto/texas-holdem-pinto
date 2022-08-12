const express = require('express');
const playerControllers=require('../controllers/playerControllers')
const authControllers=require('../controllers/authController')

const router=express.Router();

router.post('/signup',authControllers.signup);
router.post('/login',authControllers.login);
router.get('/logout',authControllers.logout);
router.post('/forgotPassword',authControllers.forgotPassword);
router.patch('/resetPassword/:token',authControllers.resetPassword);

//protect all routes after this middleware
router.use(authControllers.protect);

router.param('id',(req,res,next,val)=>{
  console.log(`user id#${val}`);
  next();
})

router.patch('/updatePassword/:token',authControllers.resetPassword);
router.patch('/updateMyPassword',authControllers.updatePassword);
router.patch('/updateMe',playerControllers.uploadUserPhoto,playerControllers.resizeUserPhoto,playerControllers.updateMe);
router.delete('/deleteMe',playerControllers.deleteMe);
router.get('/Me',playerControllers.getMe,playerControllers.getSpecificUser);

//restrict all routes after this middleware
router.use(authControllers.restrictTo('admin'));

router.route('/')
  .get( playerControllers.getAllUsers)
  .post(playerControllers.addUser);
router
  .route('/:id')
  .get( playerControllers.getSpecificUser)
  .patch(playerControllers.updateUser)
  .delete(playerControllers.deleteUser);

     
module.exports=router;

const multer=require('multer');
const sharp=require('sharp');
const Player=require('../models/playerModel');
const catchASync=require('../utils/catchASync');
const AppError=require('../utils/appError');
const factory=require('./handlerFactory');


const multerStorage=multer.memoryStorage();

const multerFilter=(req,file,cb)=> {
  if (file.mimetype.startsWith('image')) {
    cb(null,true)
  } else {
      cb(new AppError('Not an Image! please upload only images!!',400),false)
  }
}
const upload=multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

//FUNCTIONS
  const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
      if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
  };

  exports.uploadUserPhoto=upload.single('photo');

exports.resizeUserPhoto=catchASync( async (req,res,next)=>{
  if (!req.file) return next();
  req.file.filename=`user-${req.user._id}-${Date.now()}.jpeg`
  await sharp(req.file.buffer)
          .resize(500,500)
          .toFormat('jpeg')
          .jpeg({quality:90})
          .toFile(`public/img/users/${req.file.filename}`);
  next();
})

  exports.getMe=(req,res,next)=>{
    req.params.id=req.user._id;
    next();
  }
  
  exports.updateMe=catchASync(async (req,res,next)=>{
    //check if user tries to update password
    if (req.body.password || req.body.passwordConfirm) 
      return next(new AppError('This route is for updatind data only, for changig passwords please use/updateMyPassword',400));
    //update data
    const filteredBody= filterObj(req.body, 'name', 'email','photo');
    if (req.file) filteredBody.photo=req.file.filename;

    const updateUser=await Player.findByIdAndUpdate(req.user._id,filteredBody,{new:true,runValidator:true});
    //sending res
    res.status(200).json({
      status:'success',
      data:{
        user:updateUser
      }
    })
  })
  exports.deleteMe=catchASync(async (req,res,next)=>{
    await Player.findByIdAndUpdate(req.user._id,{active:false});
    //sending res
    res.status(204).json({
      status:'success'
    })
  })
  exports.getAllUsers = factory.getAll(Player);
  exports.getSpecificUser =factory.getOne(Player);
  exports.updateUser = factory.updateOne(Player);
  exports.deleteUser = factory.deleteOne(Player);
  exports.addUser = factory.addOne(Player);

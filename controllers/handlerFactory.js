const AppError=require('../utils/appError')
const APIFeatures=require('../utils/apiFeatures')


const catchAsync = fn=>{
  return (req,res,next)=>{
      fn(req,res,next).catch(next) 
  }
}

  exports.deleteOne = Model=>  catchAsync(async (req, res,next) => {

    const {id} = req.params ;
    const doc=await Model.findByIdAndDelete(id);

    if (!doc) return next(new AppError(`document id ${id} not found`,404));

    res.status(204).json({
       status: 'Deleted Successfuly',
       message: 'Deleted Successfuly'
      })
});

exports.updateOne= Model => catchAsync(async (req,res,next)=>{
    const {id} = req.params ;
    if (req.file) req.body.photo=req.file.filename;
    
    const doc =await Model.findByIdAndUpdate(id,req.body,{new:true,runValidators:true});
    if (!doc) return next(new AppError(`Document id ${id} not found`,404));
    res.status(200).json({
       status: 'Success',
       data:{doc} 
      })
})
exports.addOne =Model=> catchAsync(async (req, res,next) => {
    console.log("post scores")
    console.log(req.body)
    if (req.body.quarter && !req.body.player) req.body.player=req.user._id;
    const doc=await Model.create(req.body);
    res.status(201).json({
      status:'Success',
      data:{
        document:doc
      }
    })
  });

  exports.getOne = (Model,populateOptions)=> catchAsync(async (req, res,next) => {
    const {id} = req.params ;
    let query =  Model.findById(id);
    if (populateOptions) query=query.populate(populateOptions)
    const doc=await query;
    if (!doc) return next(new AppError(`Document id ${id} not found`,404));
    res.status(200).json({
       status: 'Success',
       results: 1, 
       data: { doc } 
      });
});

exports.getAll = Model=>catchAsync( async (req, res,next) => {
    //EXECUTE QURY
    const features=new APIFeatures(Model.find(),req.query).filter().sort().limitFields().paginate();
    const documents= await features.query;
    // const documents= await features.query.explain();
    //SEND RESPONSE
    res.status(200).json({
      status:'Successful',
      Documents: documents.length,
      data:documents
    })
});

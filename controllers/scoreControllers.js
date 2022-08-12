const Player=require('../models/playerModel');
const Score=require('../models/scoreModel');
// const catchASync=require('../utils/catchASync');
const AppError=require('../utils/appError');
const factory=require('./handlerFactory');

//FUNCTIONS
const catchAsync = fn=>{
  return (req,res,next)=>{
      fn(req,res,next).catch(next) 
  }
}


exports.getAllScores = factory.getAll(Score);
exports.getSpecificScore =factory.getOne(Score);
exports.updateScore = factory.updateOne(Score);
exports.deleteScore = factory.deleteOne(Score);
exports.addScore = factory.addOne(Score);

exports.getTotalsForQuarter = catchAsync(async (req, res, next) => {
    const {quarter} = req.params;
 
    const scores = await Score.aggregate([
        {
          $match: { quarter }
        },
        {
          $group: {
            _id: '$player',
            profit: { $sum: '$profit' }
          }
        }
      ])
    await Promise.all(
        scores.map(async (player, i) => {    
          player.player= await Player.findById(player).select('name');
          delete player._id;
          player.name=player.player.name;
          delete player.player;
        })
      );

    res.status(200).json({
        status:'success',
        data:{
          quarter,
          scores
        }
      })
    })
    exports.getAllQuarters = catchAsync(async (req, res, next) => {

        const scores = await Score.aggregate([
            {
              $group: {
                _id: '$quarter',
                scores:{ $sum: '$profit' }
              }
            }
          ])
        await Promise.all(
            scores.map(async (player, i) => {    
              player.player= await Player.findById(player).select('name');
              delete player._id;
              player.name=player.player.name;
              delete player.player;
            })
          );
        
        res.status(200).json({
            status:'success',
            data:{
              scores
            }
          })
        })
const Score = require('../models/scoreModel');
const Player = require('../models/playerModel');
// const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const scoreControllers=require('../controllers/scoreControllers')


const catchAsync = fn=>{
  return (req,res,next)=>{
      fn(req,res,next).catch(next) 
  }
}


exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'booking')
    res.locals.alert =
      "Your booking was successful! Please check your email for a confirmation. If your booking doesn't show up here immediatly, please come back later.";
  next();
};

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
//   const quarters = await scoreControllers.getTotalsForQuarter(req, res, next);

  // 2) Build template
  // 3) Render that template using tour data from 1)
  res.status(200).render('overview', {
    title: 'All Quarters',
    quarters
  });
});


exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account'
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser
  });
});
exports.getAllQuarters= catchAsync(async (req, res, next) => {
    const quarters=await Score.aggregate([

        {
          $group: {
            _id: '$quarter'

          }
        }
      ]).sort('-_id');
      req.quarters=quarters;
      next()
    })
exports.getQuarterGames= catchAsync(async (req, res, next) => {
    console.log(req.params)
    const {quarter}=req.params;
    console.log("quarter:",quarter)
    const games=await Score.aggregate([
        {
            $match:{quarter}
        },
        {
          $group: {
            _id: '$date'
          }
        }
      ]).sort('-_id');
      req.games=games;
      console.log(games)
      next()
    })
exports.getGameSumScores=catchAsync(async (req, res, next) => {
    const {games}=req;
    await Promise.all(
        games.map(async (game)=>{
           game.scores= await Score.aggregate([
             {
                $match: {
                    date:game._id
                  }
              },
              {
                $group: {
                  _id: '$player',
                  profit: { $sum: '$profit' },
                  num:{$sum:1}
                }
              }
           ]).sort('-profit');
        })
    )
    req.games=games;
    console.log("games0:",games)
    next();
    })
exports.getAllSumScores= catchAsync(async (req, res, next) => {
    const {quarters}=req;
    await Promise.all(
        quarters.map(async (quarter)=>{
           quarter.scores= await Score.aggregate([
             {
                $match: {
                    quarter:quarter._id
                  }
              },
              {
                $group: {
                  _id: '$player',
                  profit: { $sum: '$profit' },
                  num:{$sum:1}
                }
              }
           ]).sort('-profit');
        })
    )
    next();
    })

exports.addNamesGames = catchAsync(async (req, res, next) => {
        const {games}=req;
        await Promise.all(
                games.map(async (game)=>{
                    await Promise.all(
                        game.scores.map(async (score)=>{
                            score.player= await Player.findById(score._id).select('name');
                        })
                    )
                    })
        )   
        console.log("games:",games)     
        res.status(200).render('games',{
            title:'All Players',
            games        
        })
    })
exports.addNames = catchAsync(async (req, res, next) => {
    const {quarters}=req;
    await Promise.all(
            quarters.map(async (quarter)=>{
                await Promise.all(
                    quarter.scores.map(async (score)=>{
                        score.player= await Player.findById(score._id).select('name');
                    })
                )
                })
    )
       
    res.status(200).render('overview',{
        title:'All Players',
        quarters          
    })
})
exports.getGames= catchAsync(async (req, res, next) => {
    const {date}=req.params
    const scores=await Score.find({date})
    // console.log(`these are the scores: ${scores[1]}`);
    // next()
    res.status(200).render('game',{
        title:'All Scores',
        scores          
    })
})

exports.postScores=catchAsync(async (req, res, next) => {
  res.status(200).render('postScores', {
    title: 'Post Your scores'
  });
})

const mongoose = require('mongoose');
const validator=require('validator');
const AppError=require('../utils/appError');
const Player=require('../models/playerModel')
const catchASync=require('../utils/catchASync')


const scoreSchema = new mongoose.Schema({
    quarter: {
      type: String,
      required: [true, 'Quarter in format yy-q is required'],
      validator: function (v) {
        if (!v.split('-')[1]) return false
        const month=v.split('-')[1];
        const months=['1','2','3','4'];
        const year=parseInt(v.split('-')[0]);
        if (!months.includes(month)) return false
        if (year<22 || year>50) return false
        return true;       
      },
      message: 'Format of a quarter should be like yy-q'
    },
    player :  {
        type: mongoose.Schema.ObjectId,
        ref: 'Player',
        required: [true, 'Scores must have a referance to a player.']
      },
    date: {
        type: String
    },
    profit: {
        type: Number
    },
    startAmount: {
        type: Number,
        required: [true, 'You must provide startAmount.']
    },
    endAmount: {
        type: Number
    },
    c5000 : {
        type: Number
    },
    c1000 : {
        type: Number
    },
    c500 : {
        type: Number
    },
    c100 : {
        type: Number
    },
    c50 : {
        type: Number
    },
    c25 : {
        type: Number
    }
  });
  scoreSchema.pre(/^find/, function(next) {
    this.populate({
      path: 'player',
      select: '-__v -passwordChangedAt'
    });
    next();
  });


  scoreSchema.pre('save', async  function(next){
    if (!this.date) this.date= new Date().toISOString().slice(0, 10);
    const score= await Scores.findOne({player:this.player,period:this.period,date:this.date});
    if (score)  return next(new AppError('You allready have a score for this play',400));
    // if (!this.endAmount && !this.c5000 && !this.c1000 && !this.c500 && !this.c100 && !this.c50 && !this.c25) return next(new AppError('You must provide your scores',400));
    const amount=(this.c5000 || 0)*5000+(this.c1000 || 0)*1000+(this.c500 || 0)*500+(this.c100 || 0)*100+(this.c50*50 || 0)+(this.c25 || 0)*25;
    if (this.endAmount && this.endAmount!=amount && amount!=0) return next(new AppError('Your counting is not correct',400));
    if (!this.endAmount) this.endAmount=amount;
    // if (this.profit && this.endAmount-this.startAmount!=this.profit) return next(new AppError('Your profit is not correct',400));
    if (!this.profit) this.profit=this.endAmount-this.startAmount
    next();
  })
 
  const Scores = mongoose.model('Scores', scoreSchema);
  
  module.exports = Scores;
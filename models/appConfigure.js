var mongoose = require('mongoose');

var configureSchema = mongoose.Schema({

    photoPerDay:{
        type:Number
    },
    backUpPeriod:{
        type:Number
    },
    status:{
        type:Boolean,
        default:true
    },
    createdAt:{
        type:String
    },
    modifiedAt:{
        type:String
    }
});

module.exports = mongoose.model("configure",configureSchema);


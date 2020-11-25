var mongoose = require('mongoose');

var flashSchema =  mongoose.Schema({

        userId:{
            type:String
        },
        message :{
            type:String
        },
        fromDate:{
            type:Date
        },
        toDate:{
            type:Date
        },
        status:{
            type:Boolean
        },
        createdAt:{
            type:String
        },
        modifiedAt:{
            type:String
        }
});

module.exports = mongoose.model('flash',flashSchema);

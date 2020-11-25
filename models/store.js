var mongoose = require('mongoose');

var storeSchema = mongoose.Schema({

    storeName :{
        type:String
    },
    storeAddress:{
        type:String
    },
    storeLocation:{
        type:String
    },
    storeTimings:{
        type:String
    },
    storeHolidays:{
        type:String
    },
    userId:{
        type:String
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

module.exports = mongoose.model('store',storeSchema);
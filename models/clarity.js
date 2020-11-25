var mongoose = require('mongoose');

var claritySchema = mongoose.Schema({

    imageId :{
        type:String
    },
    clarityName:{
        type:String
    },
    storeId:{
        type:String
    },
    createdAt:{
        type:String
    },
    modifiedAt:{
        type:String
    }

});

module.exports = mongoose.model('clarity',claritySchema);
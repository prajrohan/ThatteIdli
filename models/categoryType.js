var mongoose = require('mongoose');

var categorySchema = mongoose.Schema({

    categoryName :{
        type:String
    },
    createdAt:{
        type:String
    },
    modifiedAt:{
        type:String
    }

});

module.exports = mongoose.model('category',categorySchema);
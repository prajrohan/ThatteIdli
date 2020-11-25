var mongoose = require('mongoose');

var subCategorySchema = mongoose.Schema({

    subCategoryName :{
        type:String
    },
    categoryId:{
        type: String
    },
    createdAt:{
        type:String
    },
    modifiedAt:{
        type:String
    }
});

module.exports = mongoose.model('subCategory',subCategorySchema);
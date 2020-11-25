var mongoose = require('mongoose');

var imageSchema = mongoose.Schema({

    storeId:{
        type:String
    },
    userId:{
        type:String
    },
    categoryId:{
        type:String
    },
    subCategoryId:{
        type:String
    },
    imageStatus:{
        type:String,
        default : "In Pending"
    },
    imageName:{
        type:String
    },
    imageLocation:{
        type:String
    },
    tagBy:{
        type:String
    },
    clarityStatus:{
        type:Boolean,
        default:false
    },
    clarityMessage:{
        type:String,
        default:""
    },
    comments:{
        type: String
    },
    createdAt:{
        type:String
    },
    modifiedAt:{
        type:String
    }
});


module.exports = mongoose.model('image',imageSchema);
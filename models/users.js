var mongoose = require('mongoose');

var userSchema = mongoose.Schema({

    userName : {
        type:String
    },
    userEmail:{ 
        type:String
    }, 
    userPhone:{ 
        type:String
    }, 
    password:{  
        type:String  
    },
    roleId:{
        type:String
    },
    status:{
        type:Boolean,
        default:true
    },
    imeiNumber:{
        type:String,
        default: "Empty"
    },
    phoneBuild:{
        type:String,
        default: "Empty"
    },
    createdAt:{
        type:String
    },
    modifiedAt:{
        type:String
    },
    response:{
        type:String
    }

});


module.exports = mongoose.model('users',userSchema);
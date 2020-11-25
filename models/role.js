var mongoose = require('mongoose');

var roleSchema = mongoose.Schema({

    roleName : {
        type:String
    },
    createdAt:{
        type:String
    },
    modifiedAt:{
        type:String
    }
 
});


module.exports = mongoose.model('role',roleSchema);
     
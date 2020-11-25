
var subCategory = require('./subCategotyType');
var categoryDetails = {

        categoryName :{
            type:String
        },
        categoryDetails : {
            type:subCategory
        }
}

module.exports = categoryDetails;
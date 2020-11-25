var Category = require('../models/categoryType');
var subCategory = require('../models/subCategotyType');
var categoryMap = new Map();

    Category.find({},(err,category)=>{

        for(let i=0;i<category.length;i++){
            var id = ""+category[i]._id;
            categoryMap.set(id,category[i].categoryName);
        }
    })
    
    subCategory.find({},(err,subCategory)=>{
    
        for(let i=0;i<subCategory.length;i++){
            var id = ""+subCategory[i]._id;
            categoryMap.set(id,subCategory[i].subCategoryName);
        }
    
    })

module.exports = categoryMap;


var express = require('express');
var router = express.Router();
var Category = require('../models/categoryType');
var subCategory = require('../models/subCategotyType');
var getFormattedDate = require('../assets/currentDate');

router.post('/add/:id', function(req, res, next) {  

    subCategory.find({subCategoryName:req.body.subCategoryName}).then(category=>{

        if(category.length == 0){
            const subCat = new subCategory({
                subCategoryName: req.body.subCategoryName,
                categoryId:req.params.id,
                getFormattedDate:getFormattedDate(new Date())
            });
            subCat.save()
            .then(cat => {
                res.send(cat)
            }).catch(err => {
                res.status(500).send({
                    response: err.message || "Some error occurred while creating the Category."
                });
            });
        }
        else{
            res.send({response: req.body.subCategoryName +" SubCategory Already Exist"});
        }
    });

});


let catCount = 0;
var object = [];
router.get('/getAllCategoriesAndSubCategories',function(req,res,next){
    Category.find()
    .then(category => {
        console.log('category.length--> '+category.length);
       catcount = 0;
       getSubCategory(category,function(cat){
        console.log(cat);
         res.send(cat);
       });
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving category."
        });
    }); 
});  
async function getSubCategory(category,callback){
    var a = JSON.stringify(category);
    console.log('category->'+a)
    var b = JSON.parse(a); 

if(catCount <= b.length-1){
    var categoryId = b[catCount]._id;
    var categoryName = b[catCount].categoryName;
    console.log( catCount + ' b id '+b[catCount]._id);
    subCategory.find({categoryId:categoryId}).then(subCat=>{
        console.log('Inside catcount id--> '+categoryId);
        var obj = {
            "id":categoryId,
            "categoryName":categoryName,
            "subCategories":subCat 
        }
        console.log(obj);
        object.push(obj);
        catCount++; 
        getSubCategory(category,callback);
    }).catch(err=>{
        console.log('Errr--> ' +err.message);
    })
} 
else{
     console.log('Final--> '+JSON.stringify(object));
     callback(object);
} 
}  


router.get('/getSubCategoriesByCategoryId/:id',function(req,res,next){
var object = [];
Category.findById(req.params.id)
.then(category => {

        subCategory.find({categoryId:category._id}).then(subCat=>{
            var obj={
                "id":category._id,
                "categoryName" : category.categoryName,
                "subCategories": subCat
            }
            object.push(obj);
            res.send(object);
        })
}).catch(err => {
    res.status(500).send({
        message: err.message || "Some error occurred while retrieving category."
    });
}); 
})

router.get('/getSubCategory/:id',function(req,res,next){
    var object = [];
    Category.findById(req.params.id)
    .then(category => {
            subCategory.find({categoryId:category._id}).then(subCat=>{
                if(subCat.length === 0){
                    res.send({
                        message:"Not Found"
                    })
                }
                res.send(subCat);
            })
    }).catch(err => {
        res.send({
            message: err.message || "Some error occurred while retrieving category."
        });
    }); 
    })




router.get('/getSubCategoiresByCategoryIdAndSubCategoryId/:catId/:subCatId',function(req,res,next){

var object = [];
Category.findById(req.params.catId)
.then(category => {
        subCategory.findById(req.params.subCatId).then(subCat=>{
            var obj={
                "id":category._id,
                "categoryName" : category.categoryName,
                "subCategories": subCat
            }
            object.push(obj);
            res.send(object);
        })
}).catch(err => {
    res.status(500).send({
        message: err.message || "Some error occurred while retrieving category."
    });
});

});

router.put('/updateByCategory/:id',function(req,res,next){

    var sub = new subCategory({
        subCategoryName : req.body.subCategoryName,
        categoryId : req.params.id,
    })
  
    Category.findById(req.params.id)
        .then(category => {
            if(category.length == 0) {
                return res.status(404).send({
                    message: "Category not found with id " + req.params.id
                });            
            }
            sub.save().then(sub=>{
                res.send(sub);
            })
        
        }).catch(err => {
            if(err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Category not found with id " + req.params.id
                });                
            }
            console.log(err);
            return res.status(500).send({
                message: "Error retrieving category with id " + req.params.id
            });
        });

    })


module.exports = router;
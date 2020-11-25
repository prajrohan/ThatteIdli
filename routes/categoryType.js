var express = require('express');
var router = express.Router();
var Category = require('../models/categoryType');
var categoryMap = new Map();
var getFormattedDate = require('../assets/currentDate');

router.post('/add', function(req, res, next) {  

    Category.find({categoryName:req.body.categoryName}).then(category=>{

        if(category.length == 0){
            const category = new Category({
                categoryName: req.body.categoryName,
                createdAt:getFormattedDate(new Date())
            });
            category.save()
            .then(cat => {
                res.send(cat)
            }).catch(err => {
                res.status(500).send({
                    response: err.message || "Some error occurred while creating the Category."
                });
            });
        }
        else{
            res.send({response: req.body.categoryName +" Category Already Exist"});
        }
    });

});
 
router.get('/getAll',function(req,res,next){
    Category.find()
    .then(category => {
        res.send(category);
        console.log(categoryMap);
    }).catch(err => {
        res.status(500).send({
            response: err.message || "Some error occurred while retrieving category."
        });
    });

});



router.get('/getById/:id',function(req,res,next){

    Category.findById(req.params.id)
    .then(category => {
        if(category.length == 0) {
            return res.status(404).send({
                response: "Category not found with id " + req.params.id
            });            
        }
        res.send(category);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                response: "Category not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            response: "Error retrieving category with id " + req.params.id
        });
    });

});

router.delete('/deleteById/:id',function(req,res,next){

    Category.findByIdAndRemove(req.params.id)
    .then(category => {
        if(category.length == 0) {
            return res.status(404).send({
                response: "Category not found with id " + req.params.id
            });
        }
        res.send({response: "Category deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                response: "Category not found with id " + req.params.noteId
            });                
        }
        return res.status(500).send({
            response: "Could not delete category with id " + req.params.id
        });
    });
})

router.put('/updateById/:id',function(req,res,next){

    var category = req.body;
    category.modifiedAt = getFormattedDate(new Date());
    Category.findByIdAndUpdate(req.params.id, category, {new: true})
    .then(category => {
        if(category.length == 0) {
            return res.status(404).send({
                response: "Category not found with id " + req.params.id
            });
        }
        res.send(category);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                response: "Category not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            response : "Error updating category with id " + req.params.id
        });
    });
})

module.exports = router;
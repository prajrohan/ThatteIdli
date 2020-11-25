var express = require('express');
var router = express.Router();
var Clarity = require('../models/clarity');
var getFormattedDate = require('../assets/currentDate');
router.post('/add/:id', function(req, res, next) {
                var clarity = new Clarity({
                imageId:req.params.id,
                storeId:req.body.storeId,
                clarityName:req.body.clarityName,
                createdAt:getFormattedDate(new Date())
                });
                clarity.save()
                .then(clarityimg=>{
                res.send(clarityimg);
                }).catch(err => {
                res.status(500).send({
            response: err.message || "Some error occurred while creating the Image."
        });
    });
});

 
router.get('/getClarityImageByImageId/:id',function(req,res,next){

            Clarity.find({imageId:req.params.id}).then(img => {
                if(img.length == 0) {
                    return res.send({
                        response: "Image not found with id"
                    });
                }
                res.send(img);
            }).catch(err=>{
        res.status(500).send({
            response: err.message || "Some error occurred while retrieving Images."
        });
    })
        
})

router.get('/getClarityImageByStoreId/:id',function(req,res,next){

    Clarity.find({storeId:req.params.id}).then(img => {
        if(img.length == 0) {
            return res.send({
                response: "Image not found"
            });
        }
        res.send(img);
    }).catch(err=>{
    res.status(500).send({
        response: err.message || "Some error occurred while retrieving Images."
    });
})
 
})  
 
router.delete('/deleteById/:id',function(req,res,next){

    Clarity.findByIdAndRemove(req.params.id) 
    .then(img => { 
        if(img.length==0) {   
            return res.send({ 
                response: "Clarity Image not found"
            }); 
        }
        res.send({response: "Clarity Image deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                response: "Clarity Image not found with id " + req.params.noteId
            });                 
        }
        return res.status(500).send({
            response: "Could not delete clarity Image with id " + req.params.id
        });
    });
});



module.exports = router;
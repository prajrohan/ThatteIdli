var express = require('express');
var router = express.Router();
var Flash = require('../models/flashMessage');
var modifiedDate = require('../assets/modifiedDate'); 
var getFormattedDate = require('../assets/currentDate');
router.post('/add', function(req, res, next) {  

    const flash = new Flash({
        message: req.body.message,
        userId: req.body.userId,
        fromDate : req.body.fromDate,
        toDate : req.body.toDate,
        status : req.body.status,
        createdAt:getFormattedDate(new Date())
    });
    flash.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Flash Message."
        });
    });
});

router.get('/getAll',function(req,res,next){

    Flash.find()
    .then(flash => {
        res.send(flash);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving flash."
        });
    });

});

router.get('/getById/:id',function(req,res,next){

    Flash.findById(req.params.id)
    .then(flash => {
        if(!flash) {
            return res.status(404).send({
                message: "Flash not found with id " + req.params.id
            });            
        }
        res.send(flash);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Flash not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error retrieving flash with id " + req.params.id
        });
    });

});

router.delete('/deleteById/:id',function(req,res,next){

    Flash.findByIdAndRemove(req.params.id)
    .then(flash => {
        if(!flash) {
            return res.status(404).send({
                message: "Flash not found with id " + req.params.id
            });
        }
        res.send({message: "Flash deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Flash not found with id " + req.params.noteId
            });                
        }
        return res.status(500).send({
            message: "Could not delete flash with id " + req.params.id
        });
    });
})

router.put('/updateById/:id',function(req,res,next){
    var flash = req.body;
    flash.modifiedAt = getFormattedDate(new Date());
    Flash.findByIdAndUpdate(req.params.id, req.flash, {new: true})
    .then(flash => {
        if(!flash) {
            return res.status(404).send({
                message: "Flash not found with id " + req.params.id
            });
        }
        res.send(flash);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Flash not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error updating flash with id " + req.params.id
        });
    });
})


module.exports = router;
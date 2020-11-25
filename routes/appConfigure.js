var express = require('express');
var router = express.Router();
var Configure = require('../models/appConfigure');
var getFormattedDate = require('../assets/currentDate');

router.post('/add', function(req, res, next) {  

    const configure = new Configure({
        photoPerDay: req.body.photoPerDay,
        backUpPeriod: req.body.backUpPeriod,
        createdAt:getFormattedDate(new Date())
    });
    configure.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the configure."
        });
    });
  });

router.put('/updateById/:id',function(req,res,next){
    var config = req.body
    config.modifiedAt = getFormattedDate(new Date());
    Configure.findByIdAndUpdate(req.params.id, config, {new: true})
    .then(configure => {
        if(configure.length == 0) {
            return res.status(404).send({
                message: "Configure not found with id " + req.params.id
            });
        }
        res.send(configure);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                response: "Configure not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            response: "Error updating Configure with id " + req.params.id
        });
    });
})

router.get('/getAll',function(req,res,next){

    Configure.find()
    .then(config => {
        res.send(config);
    }).catch(err => {
        res.status(500).send({
            response: err.message || "Some error occurred while retrieving Configure."
        });
    });
})



module.exports = router;
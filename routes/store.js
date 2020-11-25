var express = require('express');
var router = express.Router();
var Store = require('../models/store');
var getFormattedDate = require('../assets/currentDate');

router.post('/add', function(req, res, next) {  

    Store.find({storeName:req.body.storeName}).then(store=>{

        if(store.length == 0){
                const store = new Store({
                storeName: req.body.storeName,
                storeAddress: req.body.storeAddress,
                storeLocation :req.body.storeLocation,
                storeTimings:req.body.storeTimings,
                storeHolidays :req.body.storeHolidays,
                userId : req.body.userId,
                createdAt:getFormattedDate(new Date())
              });
              store.save()
              .then(data => {
                  res.send(data);
              }).catch(err => {
                  res.status(500).send({
                      response: err.message || "Some error occurred while creating the Store."
                  });
              });
        }
        else{
            res.send({response: req.body.storeName+" Store already Exist"});
        }
    })
  });


router.get('/getAll', function(req, res, next) {
    Store.find()
  .then(store => {
      res.send(store);
  }).catch(err => {
      res.status(500).send({
        response: err.message || "Some error occurred while retrieving Stores."
      });
  });
});

router.get('/getById/:id',function(req,res,next){

    Store.findById(req.params.id)
    .then(store => {
        if(store.length == 0) {
            return res.status(404).send({
                response: "Store not found with id " + req.params.id
            });            
        }
        res.send(store);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                response: "Store not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            response : "Error retrieving store with id " + req.params.id
        });
    });

});

router.get('/getStoreByUserId/:id',function(req,res,next){

    Store.find({userId:req.params.id})
    .then(store => {
        if(store.length == 0) {
            return res.status(404).send({
                response: "Store not found with id " + req.params.id
            });            
        }
        res.send(store);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                response: "Store not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            response: "Error retrieving store with id " + req.params.id
        });
    });

});

router.delete('/deleteById/:id',function(req,res,next){

    Store.findByIdAndRemove(req.params.id)
    .then(store => {
        if(store.length == 0) {
            return res.status(404).send({
                response: "Store not found with id " + req.params.id
            });
        }
        res.send({response: "Store deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                response: "Store not found with id " + req.params.noteId
            });                
        }
        return res.status(500).send({
            response: "Could not delete Store with id " + req.params.id
        });
    });
})

router.put('/updateById/:id',function(req,res,next){
    var store = req.body;
    store.modifiedAt = getFormattedDate(new Date());
    Store.findByIdAndUpdate(req.params.id, store, {new: true})
    .then(store => {
        if(store.length == 0) {
            return res.status(404).send({
                response: "Store not found with id " + req.params.id
            });
        }
        res.send(store);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                response: "Store not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            response: "Error updating role with id " + req.params.id
        });
    });
});



module.exports = router;
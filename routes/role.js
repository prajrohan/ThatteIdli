var express = require('express');
var router = express.Router();
var Role = require('../models/role');
const modifiedDate = require('../assets/modifiedDate');
var getFormattedDate = require('../assets/currentDate');


router.post('/add', function(req, res, next) {  

    Role.find({roleName:req.body.roleName}).then(role=>{
        if(role.length == 0){
            const roles = new Role({
                roleName: req.body.roleName,
                createdAt:getFormattedDate(new Date())
            });
            roles.save()
            .then(data => {
                res.send(data);
            }).catch(err => {
                res.status(500).send({
                    response: err.message || "Some error occurred while creating the Role."
                });
            });
        }
        if(role.length == 1){
            res.send({response: req.body.roleName+" Role already Exist"});
        }
    }).catch(err => {
        res.status(500).send({
            response: err.message || "Some error occurred while creating the Role."
        });
    });

});

router.get('/getAll',function(req,res,next){

    Role.find()
    .then(roles => {
        res.send(roles);
    }).catch(err => {
        res.status(500).send({
            response: err.message || "Some error occurred while retrieving role."
        });
    });

});

router.get('/getById/:id',function(req,res,next){

    Role.findById(req.params.id)
    .then(role => {
        if(!role) {
            return res.status(404).send({
                response: "Role not found with id " + req.params.id
            });            
        }
        res.send(role);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                response: "Role not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            response: "Error retrieving role with id " + req.params.id
        });
    });

});

router.delete('/deleteById/:id',function(req,res,next){

    Role.findByIdAndRemove(req.params.id)
    .then(role => {
        if(!role) {
            return res.status(404).send({
                response: "Role not found with id " + req.params.id
            });
        }
        res.send({message: "Role deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                response: "Role not found with id " + req.params.noteId
            });                
        }
        return res.status(500).send({
            response: "Could not delete role with id " + req.params.id
        });
    });
})

router.put('/updateById/:id',function(req,res,next){
    var role = req.body;
    role.modifiedAt = getFormattedDate(new Date());
    Role.findByIdAndUpdate(req.params.id, role, {new: true})
    .then(role => {
        if(!role) {
            return res.status(404).send({
                response: "Role not found with id " + req.params.id
            });
        }
        res.send(role);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                response: "Role not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            response: "Error updating role with id " + req.params.id
        });
    });
})


module.exports = router;
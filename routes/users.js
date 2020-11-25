var express = require('express');
var router = express.Router();
var User = require('../models/users')
var sendMail = require('../assets/mailSender');
var base64 = require('nodejs-base64');
const Role = require('../models/role');
var getFormattedDate = require('../assets/currentDate');
var usersMap = require('../assets/getUsers');

var changePassword = 'changeMePlease';
router.post('/add', function(req, res, next) {

User.find({userEmail:req.body.userEmail}).then(users=>{
        if(users.length == 0){
                
                const user = new User({
                userName: req.body.userName,
                userEmail: req.body.userEmail,
                userPhone :req.body.userPhone,
                password: base64.base64encode(changePassword),
                roleId :req.body.roleId,
                createdAt:getFormattedDate(new Date())
              });
              user.save()
              .then(data => {
                  res.send(data);
                  sendMail(user.userEmail,sysPass)
              }).catch(err => {
                  res.status(500).send({
                    response: err.message || "Some error occurred while creating the User."
                  });
              });
        } 
        if(users.length == 1){
            res.send({"response":req.body.userEmail+" User Already Exist"});
        }
    }).catch(err => {
        res.status(500).send({
            response: err.message || "Some error occurred while creating the User."
        });
    });


});

router.get('/getAll', function(req, res, next) {
  User.find()
  .then(users => {
      res.send(users);
  }).catch(err => {
      res.status(500).send({
        response: err.message || "Some error occurred while retrieving Users."
      });
  });
});

router.get('/getById/:id',function(req,res,next){

  User.findById(req.params.id)
  .then(user => {
      if(user.length === 0) {
          return res.status(404).send({
            response: "User not found with id " + req.params.id
          });            
      }
      res.send(user);
  }).catch(err => {
      if(err.kind === 'ObjectId') {
          return res.status(404).send({
            response: "User not found with id " + req.params.id
          });                
      }
      return res.status(500).send({
        response: "Error retrieving user with id " + req.params.id
      });
  });

});


router.delete('/deleteById/:id',function(req,res,next){

  User.findByIdAndRemove(req.params.id)
  .then(user => {
      if(user.length == 0) {
          return res.status(404).send({
            response: "User not found with id " + req.params.id
          });
      }
      res.send({response: "User deleted successfully!"});
  }).catch(err => {
      if(err.kind === 'ObjectId' || err.name === 'NotFound') {
          return res.status(404).send({
            response: "User not found with id " + req.params.noteId
          });                
      }
      return res.status(500).send({
        response: "Could not delete user with id " + req.params.id
      });
  });
})

router.put('/updateById/:id',function(req,res,next){

    User.findById(req.params.id).then(user=>{

        
        var userBody = req.body;
        
        for (var key in userBody) {
            user[key] = userBody[key];
           }
           
        if(req.body.password){
            var password = base64.base64encode(req.body.password);
            user.password = password;
        }
           user.modifiedAt = getFormattedDate(new Date());
         
         User.findByIdAndUpdate(user._id,user,{upset:true}).then(users=>{

            if(users.length == 0){

                res.send({"response":"Not Updated"})
            }
            else{
                res.send({"response":"Updated Successfully"});
            }
         })
  }).catch(err => {
      if(err.kind === 'ObjectId') {
          return res.status(404).send({
            response: "User not found with id " + err.message
          });                
      }
      return res.status(500).send({
        response :"Error updating user with id " + err.message
      });
  });
});


router.get('/loginapi/:userEmail/:password/:imeiNumber/:phoneBuild',function(req,res,next){

    try{
    const emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var password = base64.base64encode(req.params.password);
    var userEmail = req.params.userEmail;
    if(!emailPattern.test(userEmail)){

        userEmail = userEmail.split(" ").join('');

        if(!(userEmail.endsWith('BTI') || userEmail.endsWith('bti'))){
            userEmail = userEmail.concat('BTI');
        }
        userEmail = userEmail.toLowerCase();
    }
    
    var user = usersMap.get(userEmail);
    console.log('User ->'+user);

    if(user === undefined){
        res.send({response:"User Not Exist"})
    }
    if(user.password !== password){

        res.send({response:"Invalid Password"})
    }
    console.log(user.roleId); 
    user.response = "success"
    res.send(user);
    }catch(err){
        res.send({response:err})
    }
});

router.get('/login/:userEmail/:password/:imeiNumber/:phoneBuild',function(req,res,next){


    const emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var password = base64.base64encode(req.params.password);
    var userEmail = req.params.userEmail;
    console.log(emailPattern.test(userEmail)); 
    if(!emailPattern.test(userEmail)){

        userEmail = userEmail.split(" ").join('');

        if(!(userEmail.endsWith('BTI') || userEmail.endsWith('bti'))){
            userEmail = userEmail.concat('BTI');
        }
        userEmail = userEmail.toLowerCase();
    }

    User.find({userEmail:userEmail}).then(user=>{

        if(user.length === 0){
            res.send({response:"User Doesnt Exist"})
        }
        else{
            if(user[0].password !== password){
                res.send({response:"Invalid Password"})
            }
            else{
                Role.findById(user[0].roleId).then(role=>{
                    user[0].roleId = role.roleName;
                    user[0].response = "success"
                    res.send(user);
                })
            }
            
        }
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
              response: err.message || "User not found"
            });                 
        }
        return res.status(500).send({
          response :  err.message || "Error"
        });
    });
});




router.put('/forgotPassword',function(req,res){
    var changePassword = 'ChangeMePlease';
    const emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var userEmail = req.body.userEmail;
    console.log(changePassword);
    console.log(userEmail);
    if(!emailPattern.test(userEmail)){

        userEmail = userEmail.split(" ").join('');

        if(!(userEmail.endsWith('BTI') || userEmail.endsWith('bti'))){
            userEmail = userEmail.concat('BTI');
        }
        userEmail = userEmail.toLowerCase();
    }
            
        var modifiedAt = getFormattedDate(new Date());    
        var password =  base64.base64encode(changePassword);
 
    User.find({userEmail:userEmail}).then(user=>{

        if(user.length == 0){
            res.send({response:"User Not Exist"});
        }else{
                User.findByIdAndUpdate(user[0]._id,{ $set: {password:password,modifiedAt:modifiedAt} },{upsert: true}).then(users=>{
                    res.send({response:"Password has changed, Login with Default Password"});
                })
        }
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
              response: err.message || "User not found"
            });                
        }
        return res.status(500).send({
          response :  err.message || "Error updating user"
        });
    });

});


module.exports = router;

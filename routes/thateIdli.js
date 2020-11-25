var express = require('express');
var router = express.Router();
var User = require('../models/users')
var sendMail = require('../assets/mailSender');
var passwordGenerator = require('generate-password');
var base64 = require('nodejs-base64');
var Stores = require('../models/store');
const Role = require('../models/role');
var getFormattedDate = require('../assets/currentDate');

router.get('/login',function(req,res){

    res.render('login',{error:'none'});
})

router.get('/forgotPassword',function(req,res){
    res.render('forgotPassword',{error:'none'});
})

router.get('/changePassword',function(req,res){
    res.render('changePassword',{error:'none'});
})

router.post('/login',function(req,res,next){

    if(!req.body.userEmail) {
        return res.status(400).send({
            message: "Provide User Name"
});
    }
    if(!req.body.password){
        return res.status(400).send({
            message:"Provide password"
        })
    }
    var userName = req.body.userEmail;
    var password = base64.base64encode(req.body.password);
    User.find({userEmail:userName})

    .then(user=>{
        if(user.length == 0){
            return res.render('login',{error:'userEmailInvalid'});

        }
        else{
            if(user[0].password !== password){
                  
            return res.render('login',{error:'userPasswordInvalid'});
            }
            else{

                Stores.find().then(stores=>{
 
                    Role.findById(user[0].roleId).then(roles=>{
                        user[0].roleId = roles.roleName;
                        console.log(user[0].roleId);
                        if(user[0].roleId === 'Manager'){
                            res.render('login',{error:'Manager'}); 
                        }
                        else if(user[0].roleId === 'Driver'){
                            res.render('login',{error:'Driver'}); 
                        }
                        else{
                            res.render('userPage',{users:user,stores:stores});
                            
                        }
        
                    }) 
                })
  
            }

        }

        
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Users."
        });
    });
});


router.post('/forgotPassword',function(req,res){
    var password = 'ChangeMePlease';
    var user = req.body;
    user.modifiedAt = getFormattedDate(new Date());    
    user.password =  base64.base64encode(password);
    User.findOneAndUpdate({userEmail:user.userEmail},user,{new:true})
    .then(users=>{
        if(!users) {
            res.render('forgotPassword',{error:'userInvalid'});
        } 
       
        res.render('login',{error:'updated'});
        sendMail(user.userEmail,sysPass);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Users."
        });
    });


}); 

router.post('/changePassword',function(req,res){

    var userName = req.body.userName;
    var password = base64.base64encode(req.body.password);
    var changePassword = base64.base64encode(req.body.changePassword);
    User.find({userEmail:userName}).then(user=>{
        if(user.length == 0){
            res.render('changePassword',{error:"Invalid User"});
        }
        else if(user[0].password !== password){
            res.render('changePassword',{error:"Invalid Password"});
        }
        else if(user[0].password === password){

            User.findByIdAndUpdate(user[0]._id,{$set: {password:changePassword,modifiedAt:getFormattedDate(new Date())}},{upsert:true},function(err,result){
                if(!err){
                    res.render('login',{error:"Password Changed"});
                }
            }).catch(err=>{
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving Users."
                });
            })
        }
    })

})


module.exports = router;
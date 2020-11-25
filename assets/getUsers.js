var Users = require('../models/users');
var usersMap = new Map();

var Role = require('../models/role')
var roleMap = new Map();



Users.find({},(err,user)=>{

    
Role.find({},(err,role)=>{

    for(let i=0;i<role.length;i++){
        var id = ''+ role[i]._id;
        roleMap.set(id,role[i].roleName);
    }

    for(let i=0;i<user.length;i++){
        var id = ''+ user[i].userEmail; 
        user[i].roleId = roleMap.get(user[i].roleId);
        usersMap.set(id,user[i]);

    }
    })


})

module.exports = usersMap; 
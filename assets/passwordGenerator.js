var passwordGenerator = require('generate-password');

var sysPass = passwordGenerator.generate({
    length: 8,
    numbers: true,
    excludeSimilarCharacters : true,
    });

module.exports=sysPass;
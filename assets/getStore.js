var Store = require('../models/store');

var storeMap = new Map();

Store.find().then(stores=>{

    for(let i = 0 ; i < stores.length;i++){
        var storeId = ''+stores[i]._id;
        storeMap.set(storeId,stores[i].storeName);
    }

})

module.exports = storeMap;
var express = require('express');
var router = express.Router();
var Store = require('../models/store');
var Image = require('../models/image');
var catMap = require('../assets/getCategory');
var getFormattedDate = require('../assets/currentDate');
var storeMap = require('../assets/getStore');

router.post('/add', function(req, res, next) {  

    const image = new Image({
        storeId: req.body.storeId,
        userId: req.body.userId,
        categoryId :req.body.categoryId,
        subCategoryId:req.body.subCategoryId,
        imageStatus:req.body.imageStatus,
        imageLocation:req.body.imageLocation,
        imageName:req.body.imageName,
        comments :req.body.comments,
        tagBy:req.body.tagBy,
        createdAt:getFormattedDate(new Date())
    });
    image.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            response: err.message || "Some error occurred while creating the Image."
        });
    });
  });


  router.post('/addDriverImage',function(req,res,next){
 
    res.setHeader('Content-Type', 'application/json');
    Store.find().then(stores=>{
        var latLong = ''+req.body.imageLocation;
        var latLongArray = latLong.split(',');
        var lat1 = latLongArray[0];
        var lon1 = latLongArray[1];
        let i=0;
        for(;i<stores.length;i++){
            var location = ""+stores[i].storeLocation;
            var locationArray = location.split(',');
            var lat2 = locationArray[0];
            var lon2 = locationArray[1];

            if ((lat1 == lat2) && (lon1 == lon2)) {
                const image = new Image({
                    storeId: stores[i]._id,
                    userId: req.body.userId,
                    imageStatus:req.body.imageStatus,
                    categoryId :'Delivery',
                    imageLocation:latLong,
                    imageName:req.body.imageName,
                    comments :req.body.comments,
                    tagBy:req.body.tagBy,
                    createdAt:getFormattedDate(new Date())
                });
                image.save()
                .then(data => {
                    res.send(data);
                }).catch(err => {
                    res.status(500).send({
                        response: err.message || "Some error occurred while creating the Image."
                    });
                });
                break;
                }
            else{
                var radlat1 = Math.PI * lat1/180;
		        var radlat2 = Math.PI * lat2/180;
		        var theta = lon1-lon2;
		        var radtheta = Math.PI * theta/180;
		        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		        if (dist > 1) {
			    dist = 1;
		        }
		        dist = Math.acos(dist);
		        dist = dist * 180/Math.PI;
                dist = dist * 60 * 1.1515;

            if(dist <= 0.06368030481931813){
                const image = new Image({
                    storeId: stores[i]._id,
                    userId: req.body.userId,
                    imageStatus:req.body.imageStatus,
                    categoryId :'Delivery',
                    imageLocation:latLong,
                    imageName:req.body.imageName,
                    comments :req.body.comments,
                    tagBy:req.body.tagBy,
                    createdAt:getFormattedDate(new Date())
                });
                image.save()
                .then(data => {
                    res.send(data);
                }).catch(err => {
                    res.status(500).send({
                        response: err.message || "Some error occurred while creating the Image."
                    });
                });
                break;
                }
            }
        }
        if(stores.length === i){
            const image = new Image({
                storeId:'Not Available',
                userId: req.body.userId,
                imageStatus:req.body.imageStatus,
                categoryId :'Delivery',
                imageLocation:latLong,
                imageName:req.body.imageName,
                comments :req.body.comments,
                tagBy:req.body.tagBy,
                createdAt:getFormattedDate(new Date())
            });
            image.save()
            .then(data => {
                res.send(data);
            }).catch(err => {
                res.status(500).send({
                    response: err.message || "Some error occurred while creating the Image."
                });
            });
        }
    });
  });

router.get('/getById/:id',function(req,res,next){

    Image.findById(req.params.id)
    .then(image => {
        if(image.length == 0) {
            return res.status(404).send({
                response: "Image not found with id " + req.params.id
            });            
        }else{

                image.categoryId = catMap.get(image.categoryId);
                image.subCategoryId = catMap.get(image.subCategoryId);

                res.send(image);
            }
       
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                response: "Image not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            response: "Error retrieving image with id " + req.params.id
        });
    });

});

router.delete('/deleteById/:id',function(req,res,next){

    Image.findByIdAndRemove(req.params.id)
    .then(image => {
        if(image.length == 0) {
            return res.status(404).send({
                response: "Image not found"
            });
        }
        res.send({response: "Image deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                response: "Image not found with id " + req.params.noteId
            });                
        }
        return res.status(500).send({
            response: "Could not delete image with id " + req.params.id
        });
    });
})

router.put('/updateById/:id',function(req,res,next){
    var image = req.body;
    image.modifiedAt = getFormattedDate(new Date());
    Image.findByIdAndUpdate(req.params.id, image, {upsert:true})
    .then(image => {
        if(image.length == 0) {
            return res.status(404).send({
                response: "Image not found"
            });
        }
        else{
            res.send({
                response:"Updated Successfully"
            })
        }
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                response: "Image not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            response: "Error updating image with id " + req.params.id
        });
    });
});

router.get('/getImageByStoreId/:id',function(req,res,next){

    var object = [];
    var storeId = req.params.id
    
    Image.find({storeId:storeId},(error, image)=>{
        var imageLength = image.length;
        for(let i=0;i<imageLength;i++){
            if(image[i].categoryId !== 'Delivery'){
                image[i].categoryId = catMap.get(image[i].categoryId);
                image[i].subCategoryId = catMap.get(image[i].subCategoryId);
                object.push(image[i]);
            }else{
                image[i].subCategoryId = 'Not Available';
                object.push(image[i]);
            }
            if(i==imageLength-1){
                res.send(object);
            } 
        }

    }).catch(err=>{
        res.status(500).send({
            response: err.message || "Some error occurred while retrieving Images."
        });
    })  
});


router.get('/getImageByStoreId/:storeid/:userid',function(req,res,next){

    var object = [];
    Image.find({storeId:req.params.storeid,userId:req.params.userid})
    .then(image=>{
        if(image.length == 0) {
            return res.status(404).send({
                response: "Image not found"
            });            
        }        
        var imageLength = image.length;
        for(let i=0;i<imageLength;i++){
            if(image[i].categoryId !== 'Delivery'){
                image[i].categoryId = catMap.get(image[i].categoryId);
                image[i].subCategoryId = catMap.get(image[i].subCategoryId);
                object.push(image[i]);
            }else{
                image[i].subCategoryId = 'Not Available';
                object.push(image[i]);
            }
            if(i==imageLength-1){
                res.send(object);
            } 
        }
        
    }).catch(err=>{
        res.status(500).send({
            response: err.message || "Some error occurred while retrieving Images."
        });
    })  
}); 

router.get('/getImageByCategoryId/:storeId/:catId/:date',function(req,res,next){

    var object = [];
    Image.find({storeId:req.params.storeId,categoryId:req.params.catId,createdAt:{'$regex':req.params.date}}).sort({createdAt:'asc'})
    .then(image=>{
        if(image.length == 0) {
            res.send({ 
                response: "Image not found"
            });            
        }        
        var imageLength = image.length;
        for(let i=0;i<imageLength;i++){
            if(image[i].categoryId !== 'Delivery'){
                image[i].categoryId = catMap.get(image[i].categoryId);
                image[i].subCategoryId = catMap.get(image[i].subCategoryId);
                object.push(image[i]);
            }else{
                image[i].subCategoryId = 'Not Available';
                object.push(image[i]);
            }

            if(i==imageLength-1){
                res.send(object);
            } 
        }
        
    }).catch(err=>{
        res.status(500).send({
            response: err.message || "Some error occurred while retrieving Images."
        });
    })  
}); 


router.get('/getImageBySubCategoryId/:storeId/:catId/:date',function(req,res,next){

    var object = [];
    Image.find({storeId:req.params.storeId,subCategoryId:req.params.catId,createdAt:{'$regex':req.params.date}}).sort({createdAt:'asc'})
    .then(image=>{
        if(image.length == 0) {
            res.send({ 
                response: "Image not found"
            });            
        }        
        var imageLength = image.length;
        for(let i=0;i<imageLength;i++){
            if(image[i].categoryId !== 'Delivery'){
                image[i].categoryId = catMap.get(image[i].categoryId);
                image[i].subCategoryId = catMap.get(image[i].subCategoryId);
                object.push(image[i]);
            }else{
                image[i].subCategoryId = 'Not Available';
                object.push(image[i]);
            }
            if(i==imageLength-1){
                res.send(object);
            } 
        }
        
    }).catch(err=>{
        res.status(500).send({
            response: err.message || "Some error occurred while retrieving Images."
        });
    })  
}); 


router.get('/getImagesByStoreIdAndImageIdAndClarityStatus/:storeid/:userid/:clarityStatus',function(req,res,next){

    
    var object = [];
    Image.find({storeId:req.params.storeid,userId:req.params.userid,clarityStatus:req.params.clarityStatus})
    .then(image=>{
        if(image.length == 0) {
            return res.status(404).send({
                response: "Image not found"
            });            
        }
        var imageLength = image.length;
        for(let i=0;i<imageLength;i++){
            if(image[i].categoryId !== 'Delivery'){
                image[i].categoryId = catMap.get(image[i].categoryId);
                image[i].subCategoryId = catMap.get(image[i].subCategoryId);
                object.push(image[i]);
            }else{
                image[i].subCategoryId = 'Not Available';
                object.push(image[i]);
            }
            if(i==imageLength-1){
                res.send(object);
            } 
        }
    }).catch(err=>{
        res.status(500).send({
            response: err.message || "Some error occurred while retrieving Images."
        });
    }) 
});


router.get('/getImagesByStoreIdAndClarityStatus/:storeid/:clarityStatus',function(req,res,next){

    var object = [];
    Image.find({storeId:req.params.storeid,clarityStatus:req.params.clarityStatus})
    .then(image=>{
        if(image.length == 0) {
            return res.status(404).send({
                response: "Image not found"
            });            
        }
        var imageLength = image.length;
        for(let i=0;i<imageLength;i++){
            if(image[i].categoryId !== 'Delivery'){
                image[i].categoryId = catMap.get(image[i].categoryId);
                image[i].subCategoryId = catMap.get(image[i].subCategoryId);
                object.push(image[i]);
            }else{
                image[i].subCategoryId = 'Not Available';
                object.push(image[i]);
            }
            if(i==imageLength-1){
                res.send(object);
            } 
        }
        
    }).catch(err=>{
        res.status(500).send({
            response: err.message || "Some error occurred while retrieving Images."
        });
    }) 
        
});

router.get('/getByStoreIdAndDate/:storeid/:date',function(req,res,next){
    var object = [];
    Image.find({storeId:req.params.storeid,createdAt:{'$regex':req.params.date}}).sort({createdAt:'asc'})
        .then(image=>{
        if(image.length==0){
            res.send({response:"Images Not found"});
        }
        else{
            var imageLength = image.length;
            for(let i=0;i<imageLength;i++){

                if(image[i].categoryId !== 'Delivery'){
                    image[i].categoryId = catMap.get(image[i].categoryId);
                    image[i].subCategoryId = catMap.get(image[i].subCategoryId);
                    object.push(image[i]);
                }else{
                    image[i].subCategoryId = 'Not Available';
                    object.push(image[i]);
                }
                
    
                if(i==imageLength-1){
                    res.send(object);
                } 
            }
        }
    }).catch(err=>{
        res.status(500).send({
            response: err.message || "Some error occurred while retrieving Images."
        });
    }) 
});

router.get('/getImageByStoreIdAndUserIdAndDate/:storeid/:userid/:date',function(req,res){
    var object = [];
    Image.find({storeId:req.params.storeid,userId:req.params.userid,createdAt:{'$regex':req.params.date}}).sort({createdAt:'asc'}).then(image=>{
        if(image.length==0){
            res.send({response:"Images Not found"});
        }
        else{
            var imageLength = image.length;
            for(let i=0;i<imageLength;i++){
                if(image[i].categoryId !== 'Delivery'){
                    image[i].categoryId = catMap.get(image[i].categoryId);
                    image[i].subCategoryId = catMap.get(image[i].subCategoryId);
                    object.push(image[i]);
                }else{
                    image[i].subCategoryId = 'Not Available';
                    object.push(image[i]);
                }
    
                if(i==imageLength-1){
                    res.send(object);
                } 
            }
        }
    }).catch(err=>{
        res.status(500).send({
            response: err.message || "Some error occurred while retrieving Images."
        });
    }) 
});


router.get('/getImageByStoreIdAndPresentDate/:storeid',function(req,res){

    var object = [];
    var d = new Date(),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();
if (month.length < 2) 
    month = '0' + month;
if (day.length < 2) 
    day = '0' + day;

    var today = [day,month,year].join('-');
    console.log(today);
    Image.find({storeId:req.params.storeid,createdAt:{'$regex':today}}).sort({createdAt:'asc'}).then(image=>{
        if(image.length==0){
            res.send({response:"Images Not found"});
        }
        else{
            var imageLength = image.length;
            for(let i=0;i<imageLength;i++){
                if(image[i].categoryId !== 'Delivery'){
                    image[i].categoryId = catMap.get(image[i].categoryId);
                    image[i].subCategoryId = catMap.get(image[i].subCategoryId);
                    object.push(image[i]);
                }else{
                    image[i].subCategoryId = 'Not Available';
                    object.push(image[i]);
                }
    
                if(i==imageLength-1){
                    res.send(object);
                } 
            }
        }
    }).catch(err=>{
        res.status(500).send({
            response: err.message || "Some error occurred while retrieving Images."
        });
    })
});



router.get('/getImageByStoreIdAndImageStatusAndDate/:storeid/:status/:date',function(req,res){

    var object = [];
    today = req.params.date;

    Image.find({storeId:req.params.storeid,imageStatus:req.params.status,createdAt:{'$regex':today}}).sort({createdAt:'asc'}).then(image=>{
        if(image.length==0){
            res.send({response:"Images Not found"});
        }
        else{
            var imageLength = image.length;
            for(let i=0;i<imageLength;i++){
                if(image[i].categoryId !== 'Delivery'){
                    image[i].categoryId = catMap.get(image[i].categoryId);
                    image[i].subCategoryId = catMap.get(image[i].subCategoryId);
                    object.push(image[i]);
                }else{
                    image[i].subCategoryId = 'Not Available';
                    object.push(image[i]);
                }
    
                if(i==imageLength-1){
                    res.send(object);
                } 
            }
        }
    }).catch(err=>{
        res.status(500).send({
            response: err.message || "Some error occurred while retrieving Images."
        });
    }) 
});

router.get('/getImageByStoreIdAndClarityStatusAndDate/:storeid/:status/:date',function(req,res){

    var object = [];
    today = req.params.date;

    Image.find({storeId:req.params.storeid,clarityStatus:req.params.status,createdAt:{'$regex':today}}).sort({createdAt:'asc'}).then(image=>{
        if(image.length==0){
            res.send({response:"Images Not found"});
        }
        else{
            var imageLength = image.length;
            for(let i=0;i<imageLength;i++){
                if(image[i].categoryId !== 'Delivery'){
                    image[i].categoryId = catMap.get(image[i].categoryId);
                    image[i].subCategoryId = catMap.get(image[i].subCategoryId);
                    object.push(image[i]);
                }else{
                    image[i].subCategoryId = 'Not Available';
                    object.push(image[i]);
                }
                if(i==imageLength-1){
                    res.send(object);
                } 
            }
        }
    }).catch(err=>{
        res.status(500).send({
            response: err.message || "Some error occurred while retrieving Images."
        });
    }) 
});

router.get('/getDeliveryImage/:date',function(req,res,next){

    var date = req.params.date;
    Image.find({categoryId:'Delivery',createdAt:{'$regex':date}}).then(image=>{
        if(image.length==0){
            res.send({response:"Images Not found"});  
        }
        else{
            res.send(image);
        }
    }).catch(err=>{
        res.status(500).send({
            response: err.message || "Some error occurred while retrieving Images."
        });
    }) 
});

router.get('/getDeliveryImage/:date/:status',function(req,res,next){
    var date = req.params.date;
    var status = req.params.status;

    Image.find({categoryId:'Delivery',createdAt:{'$regex':date},imageStatus:status}).then(image=>{
        if(image.length==0){
            res.send({response:"Images Not found"});
        }
        else{
            res.send(image);
        }
    }).catch(err=>{
        res.status(500).send({
            response: err.message || "Some error occurred while retrieving Images."
        });
    }) 
})

router.get('/getDeliveryImageByClarity/:date/:clarityStatus',function(req,res,next){
    var date = req.params.date;
    var clarityStatus = req.params.clarityStatus;

    Image.find({categoryId:'Delivery',createdAt:{'$regex':date},clarityStatus:clarityStatus}).then(image=>{
        if(image.length==0){
            res.send({response:"Images Not found"});
        }
        else{
            res.send(image);
        }
    }).catch(err=>{
        res.status(500).send({
            response: err.message || "Some error occurred while retrieving Images."
        });
    }) 
})

router.get('/getDeliveryImageByCategory/:date',function(req,res,next){
    var object = [];
    var date = req.params.date;
    var userId = req.params.userId;
    
    Image.find({categoryId:'Delivery',createdAt:{'$regex':date}}).then(image=>{
        if(image.length==0){
            res.send({response:"Images Not found"});
        }
        else{
            var imageLength = image.length;
            for(let i=0;i<imageLength;i++){

                var storeName = storeMap.get(image[i].storeId);
                if(storeName === undefined){
                    storeName = 'Not Available';
                }
                image[i].storeId = storeName;
                object.push(image[i]);

                if(i == imageLength-1){
                    res.send(object);
                }
            }

        }
    }).catch(err=>{
        res.status(500).send({
            response: err.message || "Some error occurred while retrieving Images."
        });
    }) 

})


router.get('/getCommentsByImageId/:id',(req,res)=>{

    Image.findById(req.params.id).then(image=>{
        if(image.length==0){
            res.send({response:"Images Not found"});
        }
        else{
            if(image.comments === undefined){
                res.send({response:"Comments not found"});
            }
            res.send({"comments":image.comments,"clarityStatus":image.clarityStatus});
        }
    }).catch(err=>{
        res.status(500).send({
            response: err.message || "Some error occurred while retrieving Images."
        });
    }) 
})


module.exports = router;
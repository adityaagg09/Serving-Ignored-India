const express=require('express'); // Accsseing the path facility 
const router=express.Router(); // Caaling the router facility from the express
const path=require('path');
const shopcontroller=require('../controllers/shop');
const check = require('../Check/check');

router.use('/mainpage',shopcontroller.getMainPage); 

router.get('/productdetails',check.logcheck,shopcontroller.getProduct);

router.post('/productdetails',check.logcheck,shopcontroller.postup);

router.get('/productdetails/:proId',check.logcheck,shopcontroller.getDetails);

router.get('/editproduct/:proId',check.logcheck,shopcontroller.getEdit);

router.post('/editproduct',check.logcheck,shopcontroller.postEdit);

router.delete('/deletepro/:proId',check.logcheck,shopcontroller.postDel);
// As request is sent through http so we can even use the  different word even there is no harm in using previous word

module.exports=router; // Inko export krne ka tarika and use krna ka method
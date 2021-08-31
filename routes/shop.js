const express=require('express');  
const router=express.Router();  
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

module.exports=router;  
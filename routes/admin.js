const express=require('express'); // Accsseing the path facility 
const router=express.Router(); // Caaling the router facility from the express
const path=require('path');
const datacontroller=require('../controllers/Data');
const check=require('../Check/check');

router.get('/addingUser',check.logcheck,datacontroller.getAdduser);

router.post('/addingUser',check.logcheck,(req,res,next) => {
    console.log(req.body);
    res.render('mainpage',{
        pageTitle: 'Main Page'
    });
}); 

router.get('/addproducts',check.logcheck,datacontroller.getAddProduct);

router.post('/addproducts',check.logcheck,datacontroller.postAddProduct);


module.exports=router; // Exporting routes
const express=require('express'); // Accessing the path facility 
const router=express.Router(); // Calling the router facility from the express
const authcontroller=require('../controllers/Auth');
const checki=require('../Check/check');
const { check , body }=require('express-validator/check');  // Java syntax which will return the functionality of the checking function
const User=require('../models/user');

router.get('/login',authcontroller.getLogin);

router.post('/login',[
    check('email')
    .isEmail()
    .withMessage('Please enter a valid email adress')
    ,
    body(
        'password',
        'PLases enter a password with a min length of 5 and no spl characters!'
    )
    .trim()
    .isAlphanumeric()
    .isLength({min: 5 })
]
,authcontroller.postLogin);

router.get('/signup',authcontroller.getsignup);

router.post('/signup',
    [
    check('email')
    .isEmail()
    .withMessage('Please enter a valid EMail adreess')
    .custom((value) =>{  // value -> which we are getting from {} 
        // if(value === 'a@a.com'){
        //     throw new Error('This id is banned');
        // }
        // return true; // So that rest request can work
        return User.findOne({email: value})  // *<>* 
        .then(user => {
        if( user){
          return Promise.reject('Email Addrees already found login with new'); // Reject basically throw an error
        }
    })  
    })
    .normalizeEmail(),  // Convert the email into lowecase charaters
    body(
        'password',
        'Please enter a valid password of min length 5'  // Error mssg when len is less than 5
        )
    .isLength({min: 5, max:6}) // Min length to be of 5
    .isAlphanumeric()
    .trim(),  // Trim the extra white space
    body('cnfrmpass')
    .trim()
    .custom( (value ,{req})=>{
        if(value !== req.body.password){
            throw new Error('Password have to match'); 
        }
        return true;
    })
]
    ,authcontroller.postsignup);

router.get('/logout',authcontroller.getLogout);

router.get('/reset',authcontroller.getreset);

router.post('/reset',authcontroller.postreset);

router.get('/reset/:token',authcontroller.getnewpa);

router.post('/newpass',authcontroller.postpa);

module.exports=router;  
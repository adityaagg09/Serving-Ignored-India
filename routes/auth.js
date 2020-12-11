const express=require('express'); // Accsseing the path facility 
const router=express.Router(); // Caaling the router facility from the express
const authcontroller=require('../controllers/Auth');
const checki=require('../Check/check');
const { check , body }=require('express-validator/check');  // Java syntax which will re6=turn the functionality of the checking function
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
    .custom((value, {req}) =>{  // value -> which we are getting {} gives from which this value can be extracted
        // if(value === 'a@a.com'){
        //     throw new Error('This id is banned');
        // }
        // return true; // So that rest request can work
        return User.findOne({email: value})  // *<>* 
        .then(user => {
        if( user){
          return Promise.reject('Email Adrees already found login with new'); // Reject basicaaly throw an error
        }
    }) // return islia lia taaki hm age chck na kre or step by step verification hona chahie :)
    })
    .normalizeEmail(),  // Convert the email into lowecase charaters
    body(
        'password',
        'Please enter a valid password of min length 5'  // AIse krne se mssg apne app show krgais field mein ksisi bhi ror part k lia
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

module.exports=router; //Module ka exports caal krke router ko bhej dia 
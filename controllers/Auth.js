const crypto=require('crypto'); // Library used for generating token for reset password
const User=require('../models/user');
const bcrypt=require('bcryptjs');
const nodemailer=require('nodemailer');
const sendgridtrans=require('nodemailer-sendgrid-transport');
const { validationResult }=require('express-validator/check')

const transporter=nodemailer.createTransport(sendgridtrans({ // Calling the nodemailer and using create and passing sendgrid tool  
    auth: {
        api_key: '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'
    }
}));

exports.getLogin=(req,res,next) => {
    let message=req.flash('error');
    console.log(message);
    if(message.length >0){
        message=message[0];
    }
    else{ 
        message=null;
    }
    res.render('Auth/login',{
        pageTitle: 'Login Page',
        err: message,
        oldinput : {
            email: '',
            password: '' 
        }
    });
};

exports.postLogin=(req,res,next) =>{
    const email=req.body.email;
    const password=req.body.password;
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).render('Auth/login',{
            pageTitle: 'Login',
            err: errors.array()[0].msg, // Gives us the errors in an array format and returning the first error mssg
            oldinput : {
                email: email,
                password: password
            }
        }) 
    }
    User.findOne({email: email})
    .then(yup => {
        if(!yup){
            //req.flash('error','Inalid Email id'); // Using the flash functionality:- key and value pair to tell
            return res.redirect('/login');
        }
        bcrypt.compare(password,yup.password)
        .then(domatch => {
            console.log(domatch);
            if(domatch ) { 
                req.session.user=yup;
                req.session.isLoggedin=true;  
                return res.redirect('/mainpage');
            }
            //req.flash('error','Inalid Password'); // Using the flash functionality:- key and value pair to tell
            return res.status(200).redirect('/login');
        })
    })
    .catch(err => {
        const error=new Error(err);  
        error.httpStatusCode=500; 
        return next(error);   
    })
};

 exports.postsignup=(req,res,next) =>{
    const email=req.body.email;
    const password=req.body.password;
    const confirmp=req.body.cnfrmpass;
    const errorss=validationResult(req);
    if(!errorss.isEmpty()){
        console.log(errorss.array());
        return res.status(422).render('Auth/signup',{
            pageTitle: 'Signup',
            err: errorss.array()[0].msg, // Gives us the errors which we have got in an array format and returning the first error mssg !
            oldinput : {
                email: email,
                password: password,
                cnfrmpass: req.body.cnfrmpass
            }
        })
    }
        bcrypt.hash(password,12) // Calling the hash functiona and asking it to how many layers of enryption
        .then(hashpas => {
            const users=new User({
                email: email,
                password: hashpas
            })
            return users.save()
        })
        .then(result => {
            console.log(email);
            return transporter.sendMail({
                to: email,
                from: 'adityaaggarwal092@gmail.com',
                subject: 'Signup Succeded',
                html: '<h1>You Successfully Signed Up!</h1>'
            })
            .catch(err => {
                const error=new Error(err);  
                error.httpStatusCode=500;  
                return next(error);   
            });
        })
    .catch(err => {
        const error=new Error(err);  
        error.httpStatusCode=500;  
        return next(error);   
    })
};
exports.getsignup=(req,res,next) =>{
    let message=req.flash('error');
    if(message.length>0){
        message=message[0];
    }
    else{
        message=null;
    }
    res.render('Auth/signup' , {
        pageTitle: 'Signup Page',
        err: message,
        oldinput : {
            email: null,
            password: null,
            cnfrmpass: null
        } 
    });
};

exports.getLogout=(req,res,next) => {
    req.session.isLoggedin=false;  
    res.redirect('/login');
};

exports.getreset=(req,res,next) => {
    let message=req.flash('err');
    if(message.length>0){
        message=message[0];
    }
    else{
        message=null;
    }
    res.render('Auth/reset',{
        pageTitle: 'Reset',
        err: message
    })
};

exports.postreset=(req,res,next) => {
    crypto.randomBytes(32,(err,Buffer)=>{ // Generates the random token of 32 bytes 
        if(err){
            console.log(err);
            res.redirect('/reset');
        }
        const token=Buffer.toString('hex');  //Converts it to string and values to the hexadecimal one 
        User.findOne({email: req.body.email})
        .then(user => {
            if(!user){
                req.flash('err','No eamil with that acccount found');
                res.redirect('/reset');
            }
            user.reseToken=token;
            user.tokenexp=Date.now()+ 300000 ;   
            return user.save();
        })
        .then(result =>{
            res.redirect('/mainpage');
            return transporter.sendMail({
                to: req.body.email,
                from: 'adityaaggarwal092@gmail.com',
                subject: 'Password reset', // ${} for sending the dynamic value to our email and anything
                html: `   
                <p>You requested a password reset </p>
                <p>Click this <a href="http://localhost:7000/reset/${token}">link</a> to set a new password</p>
                <p>Link is valid for only 5 minutes </p>
                `
            })     
        })
        .catch(err => {
            const error=new Error(err);  
            error.httpStatusCode=500;  
            return next(error);   
            //console.log(err);
        });
    })
};

exports.getnewpa=(req,res,next)=> {
    const token=req.params.token;
    User.findOne({reseToken: token,tokenexp: {$gt : Date.now()}}) //$gt meaning greater than 
    .then(user => {
    let message=req.flash('err');
    if(message.length>0){
        message=message[0];
    }
    else{
        message=null;
    }
    res.render('Auth/newpass',{
        pageTitle:'Updating Password',
        err: message,
        userid: user._id.toString(),
        token : token
    });
    })
    .catch(err => {
        const error=new Error(err);  
        error.httpStatusCode=500;  
        return next(error);   
    })
};

exports.postpa=(req,res,next)=>{
    const toki=req.body.tokento;
    const id=req.body.userid;
    const pass=req.body.password;
    let users;
    User.findOne({reseToken:toki , tokenexp: {$gt : Date.now()}, _id : id}) // $gt simplies for greater than
    .then(user => {
        if(!user){
            req.flash('Something wrong happen try again later!');
            return res.redirect('/login');
        }
        users=user;
        return bcrypt.hash(pass,12);
    })
    .then(newpas => {
        users.password=newpas;
        users.reseToken=undefined;
        users.tokenexp=undefined; 
        return users.save();
    })
    .then(result => {
        res.redirect('/login');
    })
    .catch(err => {
        const error=new Error(err);  
        error.httpStatusCode=500;  
        return next(error);   
    })
}
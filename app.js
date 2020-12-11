const express=require('express'); // God Package 
const bodyParser=require('body-parser'); // Information submit kri usko apne app mein lane k jaria 
const path=require('path');
const adminroutes=require('./routes/admin');
const shoproutes=require('./routes/shop');
const errorController=require('./controllers/error');
const mongoose=require('mongoose'); // Mongoose PAcakage for database
const authroutes=require('./routes/auth');
const monlink='mongodb://localhost:27017/sii';
const app=express(); // Accessing all the Powers of it
const session=require('express-session'); // Getting the express session 
const Mongosession=require('connect-mongodb-session')(session); // This method gives us the functionality to pass the 
const User=require('./models/user');
const csrf=require('csurf'); // Using the csurf protection pacakage
const csrfprotection=csrf(); // Calling it's functionality
const flash=require('connect-flash'); // Module for printing the message
const multer=require('multer'); // Package for uploading the files from the desktop

const store=new Mongosession({ // This is the store which gonna to store the details
    uri: monlink,    // Passing the link to store data
    collection: 'sessions' // Name to ehich it be stored
});

const fileFilter=(req,file,cb) =>{  // This will gonna to seprate the type of only files to be uploaded
    if(
        file.mimetype === 'image/png',
        file.mimetype === 'image/jpg',
        file.mimetype === 'image/jpeg'
    ){
        cb(null,true); // Here null is gonna to be called off as the error 
    }
    else{
        cb(null,false);
    }
};

const fileStorage = multer.diskStorage({
    destination: 'images', /*(req, file, cb) => {
      cb(null, './images');
    },*/
    filename: (req, file, cb) => {
      cb(null, new Date().toISOString() + '-' + file.originalname);
    }
  });
  
app.set('view engine','ejs'); // Telling we are using the ejs templating dyanmic
app.set('views','views');  // Specfiying the path we are using 

app.use(bodyParser.urlencoded({extended: false})); // Setting the functionality of accesing the req data 
app.use(multer({ dest : 'images'  , fileFilter : fileFilter}).single('image')); // Using the multer and calling it's single file or multiple file's :)
app.use(express.static(path.join(__dirname,'Aditya'))); // Setting this will make this folder avaliable open to one and all :)
app.use('/images',express.static(path.join(__dirname,'images'))); // Setting this will make this folder avaliable open to one and all :)

app.use(session({
    secret : 'my secret', 
    resave: false,
    saveUninitialized:false,
    store: store //Giving the thing in which it has to be stored
})
); // !@#$%^&*&^%$#@!@#$%^&^%$#@#%Y

app.use(csrfprotection);
app.use(flash());

app.use((req,res,next)=>{ // the csrf token used here also is a inbuilt name it will gonna extract the value of it  
    res.locals.toki=req.csrfToken(); // locals used here will be passed to all the render page 
    next();
});

app.use((req,res,next)=>{
    if(!req.session.user){
        return next();
    }
    User.findById(req.session.user._id)
    .then(user =>{
        if(!user){
            return next();
        }
        req.user=user;
        next();
    })
    .catch(err => {
        throw new Error(err); 
    })
});

app.use(adminroutes); // Using the admin routes && will load if we link though /admin/url we want to
app.use(shoproutes);  // Using the shop routes && same above
app.use(authroutes);  // Adding the auth routes

app.get('/500',errorController.error500);

app.use(errorController.error404); 

app.use((error ,req ,res,next)=> {
    //res.redirect('/500');
    res.status(500).render('500', {
        pageTitle: 'Error!',
      });
})

mongoose.connect(monlink) // Calling mongoose fuctionality to join this link on our local host 
.then(result => {
    app.listen(7000);
})
.catch(err => {
    console.log(err);
});
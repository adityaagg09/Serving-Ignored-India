const express=require('express'); // God Package 
const bodyParser=require('body-parser'); 
const path=require('path');
const adminroutes=require('./routes/admin');
const shoproutes=require('./routes/shop');
const errorController=require('./controllers/error');
const mongoose=require('mongoose'); // Mongoose Package for database
const authroutes=require('./routes/auth');
const monlink='mongodb://localhost:27017/sii';
const app=express();                      // Accessing all the Powers of it
const session=require('express-session'); // Getting the express session 
const Mongosession=require('connect-mongodb-session')(session); // This method gives us the functionality to start session 
const User=require('./models/user');
const csrf=require('csurf'); // Using the csurf protection package
const csrfprotection=csrf(); // Calling it's functionality
const flash=require('connect-flash'); // Module for printing the message
const multer=require('multer');     // Package for uploading the files from the desktop

const store=new Mongosession({ // This is the store which store the details
    uri: monlink,              // Passing the link to connect
    collection: 'sessions'     // Name of collection
});

const fileFilter=(req,file,cb) =>{  // Seprate the type of files to upload
    if(
        file.mimetype === 'image/png',
        file.mimetype === 'image/jpg',
        file.mimetype === 'image/jpeg'
    ){
        cb(null,true);   
    }
    else{
        cb(null,false);
    }
};

const fileStorage = multer.diskStorage({
    destination: 'images', 
    filename: (req, file, cb) => {
      cb(null, new Date().toISOString() + '-' + file.originalname);
    }
  });
  
app.set('view engine','ejs'); // Telling we are using the ejs templating dyanmic
app.set('views','views');    // Specfiying the path we are using 

app.use(bodyParser.urlencoded({extended: false})); // Setting the functionality of accesing the req data 
app.use(multer({ dest : 'images'  , fileFilter : fileFilter}).single('image')); // Using the multer and calling for single file or multiple file's
app.use(express.static(path.join(__dirname,'Aditya')));   
app.use('/images',express.static(path.join(__dirname,'images'))); // Setting this will make this folder avaliable open to one and all :)

app.use(session({
    secret : 'my secret', 
    resave: false,
    saveUninitialized:false,
    store: store      //Giving the thing in which it has to be stored
})
);  

app.use(csrfprotection);
app.use(flash());

app.use((req,res,next)=>{            // the csrf token used here also is a inbuilt name it will extract the value of it  
    res.locals.toki=req.csrfToken();  
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

// Adding the routes
app.use(adminroutes); 
app.use(shoproutes);   
app.use(authroutes);  

app.get('/500',errorController.error500);

app.use(errorController.error404); 

app.use((error ,req ,res,next)=> {
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
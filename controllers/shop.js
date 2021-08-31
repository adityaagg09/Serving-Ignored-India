const Product=require('../models/product');

exports.getMainPage = (req,res,next) => {
    res.render('mainpage' ,{
        pageTitle: 'Main Page'
    });
};  
var itemsperpage=2; 

exports.postup=(req,res,next)=>{
    const up=req.body.itemsper;
    itemsperpage=up;
    return res.redirect('/productdetails');
} 
exports.getProduct=(req,res,next) =>{
    itemsperpage= +itemsperpage;
    const page= +req.query.page || 1; // If we redirect from another page then simly just page 1 must show up
    let totalitems;                   // + ahead indicates that to convert it into the integer
    Product.find().countDocuments()   // count gives the total count of products
    .then(numprouducts =>{ 
      totalitems=numprouducts;
      return Product.find()
      .skip((page-1)*itemsperpage) //Will skip the page * itms/page 
      .limit(itemsperpage);        //the cursor will give us the no of items to be fetched
    })
    .then(products => {
    res.render('admin/productlist', {
        pageTitle: 'Product List',
        prods: products,
        currentpage: page,
        hasnextpage: itemsperpage*page < totalitems,
        haspreviouspage: page > 1,
        nextpage: page + 1,
        previouspage: page - 1,
        lastpage: Math.ceil(totalitems/itemsperpage) 
    });
    })
    .catch(err => {
        const error=new Error(err); 
        error.httpStatusCode=500;  
        return next(error);      }); 
};

exports.getDetails=(req,res,next) =>{
    const prodId=req.params.proId;
    Product.findById(prodId)
    .then(product =>{
        res.render('admin/productdetails',{
            pageTitle: product.name,
            product: product
        });
    })
    .catch(err => {
        const error=new Error(err); 
        error.httpStatusCode=500;  
        return next(error);      });
};

exports.getEdit = (req,res,next) => {
    const edito=req.params.edit;
    const prodId=req.params.proId;
    Product.findById(prodId)
    .then(product => {
        console.log(product._id); 
        res.render('admin/products',{
            pageTitle: 'Editing the product',
            product: product,
            edit: true 
        });
    })
    .catch(err => {
        console.log(err);
    });
};

exports.postEdit=(req,res,next) => {
    console.log(req.params);
    const uname=req.body.name;
    const image=req.file;
    const uprice=req.body.price;
    const umax=req.body.maxquan;
    const prodId=req.body.prodId;
    Product.findById(prodId)
    .then(product =>{
        product.name=uname; 
        if(image){
        product.imageUrl=image.path;
        }
        product.price=uprice;
        product.maxquan=umax;
        return product.save();
    })
    .then(result =>{
        res.redirect('/mainpage');
    })
    .catch(err => {
        const error=new Error(err); 
        error.httpStatusCode=500;  
        return next(error);      })
};

exports.postDel=(req,res,next) => { 
    const prodId=req.params.proId;
    Product.findByIdAndDelete(prodId) //Unique function to find and delete
    .then(result => {
        res.status(200).json({message: 'Success!'});
    })
    .catch(err => {
        res.status(500).json({message: 'Deleting Product Failed!'});
        /*const error=new Error(err); 
        error.httpStatusCode=500;  
        return next(error);  */
    })
};
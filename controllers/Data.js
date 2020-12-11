const Product=require('../models/product');

exports.getAdduser=(req,res,next) => {
    res.render('admin/addingUser',{
    pageTitle: ' Adding User ',
});
};

exports.postAddProduct=(req,res,next) =>{
    const name=req.body.name;
    const image=req.file; // Extracting the file document's
    const price=req.body.price;
    const max=req.body.maxquan;
    console.log(image);
    if(!image){
        return res.status(402).render('admin/products' ,{
            pageTitle: 'Adding Product!',
            edit: false
        })
    }
    const imageUrl=image.path;
    console.log(imageUrl);
    const product=new Product({
        name: name,
        imageUrl: imageUrl, 
        price: price,
        maxquan: max
    });
    product.save()
    .then(result => {
        console.log('Craeted Product');
        res.redirect('/mainpage');
    })
    .catch(err => {
        const error=new Error(err); // Tellin it to new eeror has been developed and making sure that error ha been occured
        error.httpStatusCode=500; // Status code set krne ka !!
        return next(error);  // This will call our 500 error page bcz we tell him to do so when er pass error spl func
    })
}; 

exports.getAddProduct=(req,res,next) =>{ 
    res.render('admin/products',{
        pageTitle: 'Adding Product',
        edit: false
    });
};
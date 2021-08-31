const Product=require('../models/product');

exports.getAdduser=(req,res,next) => {
    res.render('admin/addingUser',{
    pageTitle: ' Adding User ',
});
};

exports.postAddProduct=(req,res,next) =>{
    const name=req.body.name;
    const image=req.file;  // Extracting the file document's
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
        const error=new Error(err); 
        error.httpStatusCode=500;  
        return next(error);   
    })
}; 

exports.getAddProduct=(req,res,next) =>{ 
    res.render('admin/products',{
        pageTitle: 'Adding Product',
        edit: false
    });
};
exports.error404=(req,res,next) => {
    res.render('404',{
        pageTitle: 'PAge not found'
    }); 
};

exports.error500=(req,res,next) => {
    res.render('500',{
        pageTitle: 'PAge not found'
    }); 
};
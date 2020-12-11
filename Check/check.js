exports.logcheck=(req,res,next)=>{
    if(!req.session.isLoggedin){
        return res.redirect('/login');
    }
    next();
};

exports.usercheck=(req,res,next)=>{

}; 
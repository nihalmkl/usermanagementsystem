

const isLogin = (req, res, next) => {
    if (req.session.user_id && !req.session.is_admin) {
        next();
    } else {
        res.redirect('/');
    }
}

const isLogout=async(req,res,next)=>{
    try {
        if (req.session.user_id && !req.session.is_admin) {
            res.redirect('/home')
        }else{
            next()
        }
    } catch (error) {
        console.error(error.message);
        
    }
}

const isAdmin=async(req,res,next)=>{
    try {
        if (req.session.user_id && req.session.is_admin) {
            res.redirect('/admin/dashboard')
        }else{
            next()
        }
    } catch (error) {
        console.error(error.message);   
    }
}



module.exports={
    isLogin,
    isLogout,
    isAdmin,
}
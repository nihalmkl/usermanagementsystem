
const isLogin = async (req,res,next) => {
    try {
        if (req.session.user_id && req.session.is_admin ) {
            next()
        } else {
            res.redirect('/admin')
        }
        
    } catch (error) {
        console.log(error.message);
        
    } 
}


const isLogout = async (req,res,next) => {
    try {
        if (req.session.user_id && req.session.is_admin) {
            res.redirect('/admin/dashboard')
        }else{
            next()
        }
       
    } catch (error) {
        console.log(error.message);
        
    }
}

const isUser = async (req,res,next) => {
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

module.exports = {
    isLogin,
    isLogout,
    isUser,
    
}
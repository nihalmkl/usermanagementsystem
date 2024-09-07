const User = require('../model/userModel');
const bcrypt = require('bcrypt');
const randomstring = require('randomstring')


const securePassword=async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password,10)
        return passwordHash
    } catch (error) {
        console.log(error.message);
        
    }
}


// Show login page
const showLogin = (req, res) => {
    try{
        if(req.session.user_id){
            return redirect('/dashboard')
        }
    res.render('admin/adminlogin');
    }catch(err){
        console.log(err.message);
        
    }
};

const verifyAdminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userData = await User.findOne({ email: email });
        
        if (userData) {
            const validPass = await bcrypt.compare(password, userData.password);
            if (validPass) {
                req.session.user_id = userData._id;
                req.session.is_admin = userData.is_admin;
                res.redirect('/admin/dashboard'); 
            } else {
                console.log('Invalid password');
                res.render('admin/adminlogin', { error: 'Invalid Password' }); // Use res.render instead of res.redirect
            }
        } else {
            console.log('Not an admin');
            res.render('admin/adminlogin', { error: 'Access Denied. Not an Admin.' }); // Use res.render instead of res.redirect
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};


// Show dashboard after login
const adminDashboard = async (req, res) => { 
    try {
        if(req.session.is_admin){
        const userData = await User.find({ is_admin: false }); 
        return res.render('admin/dashboard', { users: userData });
        }else{
            return res.redirect('/')
        }
        
    } catch (error) {
        console.log(error.message);
        res.render('admin/dashboard', { error: 'Failed to load dashboard.' });
    }
};


const createUserLoad = async (req,res) => {
    try {
        res.render('admin/createUser')
    } catch (error) {
        console.log(error.message);
        
    }
}

const addUser = async (req,res) => {
    try{
        const {username,email} = req.body;
        const password = randomstring.generate({
            length: 6,
            charset: 'alphanumeric'
        });
        const sPassword = await securePassword(password)
        const user = new User({
            username:username,
            email:email,
            password:sPassword
        })
      const userData = await user.save()
      if(userData){
        res.redirect('/admin/dashboard')
      }else{
        res.render('createUser',{message :'Something is wrong'})
      }
    }catch(err){
        console.log(err);
        
    }
}

// // Show edit user form
const editUserLoad = async (req, res) => {
    try {
        const id= req.params.id
        const userData = await User.findById(id)
        if(userData){
            res.render('admin/edit',{user:userData})
        }else{
            res.redirect('/admin/dashboard')
        }
        
    } catch (error) {
        console.log(error.message);
    }
};

// Handle edit user
const updateUser = async (req, res) => {
    try {
        id=req.params.id
    const userData = await User.findByIdAndUpdate({_id:id}, {$set:{username:req.body.username,email:req.body.email}});
    res.redirect('/admin/dashboard');
    } catch (error) {
        console.log(error.message)
    }
};

// Handle delete user
const deleteUser = async (req, res) => {
    try {
        const id = req.params.id; 
        await User.findByIdAndDelete(id);
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.log(error.message);
      
    }
};
const searchUser = async (req, res) => {
    const search = req.body.search;
    console.log(search);
    
    // Using the correct format for the `find` method
    let users = await User.find({ username: new RegExp('^' + search, 'i') });
    
    res.render("admin/search", { users });
  }


const adminLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err.message);
            return res.redirect('/admin/dashboard');
        }
        res.redirect('/admin');
    });
};


module.exports ={
    showLogin,
    verifyAdminLogin,
    adminLogout,
    adminDashboard,
    createUserLoad,
    addUser,
    securePassword,
    editUserLoad,
    updateUser,
    deleteUser,
    searchUser,
}
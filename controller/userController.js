const User = require('../model/userModel');
const bcrypt = require('bcrypt');

const securePassword=async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password,10)
        return passwordHash
    } catch (error) {
        console.log(error.message);
        
    }
}

const loadSignup = async (req, res) => {
    try {
        // Render the signup page with any flash messages
        res.render('users/signup', { 
            messages: {
                errors: req.flash('errors'),
                success: req.flash('success')
            }
        });
    } catch (error) {
        // Log the error message to the console for debugging
        console.error(error.message);
    }
};

const insertUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const errors = [];

        // Server-side validation
        if (username.length <= 4) {
            errors.push('Username must be at least 5 characters long');
        }

        const emailPattern = /^[a-z0-9._-]+@[gmail]+\.[com]{2,6}$/;
        if (!emailPattern.test(email)) {
            errors.push('Please enter a valid email address');
        }

        if (password.length < 6) {
            errors.push('Password must be at least 6 characters long');
        }

        // Check if there are any errors
        if (errors.length > 0) {
            req.flash('errors', errors);
            return res.redirect('/signup');
        }

        // Secure the password
        const sPassword = await securePassword(password);
        const userExists = await User.findOne({ email: email });
        if (userExists) {
            req.flash('errors', ['Email is already registered']);
            return res.redirect('/signup');
        } else {
            // Create a new user instance with data from the request body
            const user = new User({
                username: username,
                email: email,
                password: sPassword,
            });
            // Save the user to the database
            const userData = await user.save();
            if (userData) {
                req.flash('success', 'Registration successful! Please log in.');
                return res.redirect('/');
            } else {
                req.flash('errors', ['Registration failed. Please try again.']);
                return res.redirect('/signup');
            }
        }
    } catch (error) {
        console.log(error.message);
        req.flash('errors', ['Something went wrong. Please try again.']);
        return res.redirect('/signup');
    }
};

//login user methods started

const loginLoad =async(req,res)=>{
    try {
        res.render('users/userlogin')
    } catch (error) {
        console.error(error);
    }
}

const verifyLogin = async (req,res) => {
    try {
        const {email,password} = req.body;
        const userData = await User.findOne({email:email})
        if(userData){
            const validPass = await bcrypt.compare(password,userData.password);
            if(validPass){
                req.session.user_id = userData._id
                req.session.is_admin = userData.is_admin
                res.redirect('/home')
             }else{
                res.render('users/userlogin',{message:'Invalid password'})
             }
        }else{
            res.render('users/userlogin',{message:'Invalid email'})
        }
    }catch (error) {
        console.log(error);
    }
}

const loadHome=async (req,res) => {
  try {
    const userData = await User.findById({_id:req.session.user_id})
    res.render('users/home',{user:userData})
  } catch (error) {
    console.error(error.message);
  }
}

const userLogout = async (req,res) => {
    try {
       req.session.destroy();
       res.redirect('/')
    } catch (error) {
        console.log(error.message);
    }
}



// const sessionHandle = async (req, res, next) => {
//     try {
//       const user = req.session.username;
//       if (!user) {
//         return res.redirect('/'); // Redirect if there's no user ID in the session
//       }
  
//       const existingUser = await User.findById(user);
//       if (!existingUser) {
//         req.session.destroy((err) => {
//           if (err) {
//             return next(err); // Pass the error to the next middleware
//           }
//           res.redirect('/'); // Redirect to login page if user does not exist
//         });
//       } else {
//         next(); // User exists, proceed to the next middleware or route handler
//       }
//     } catch (error) {
//       console.error(error.message);
//       next(error); // Pass any caught error to the next middleware
//     }
//   };

module.exports = {
    loadSignup,
    insertUser,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout,
    // sessionHandle
};
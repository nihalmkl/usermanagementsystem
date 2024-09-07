const express = require('express');
const admin_router = express.Router();
const adminConteroller = require('../controller/adminController')
const adminAuth = require('../middleware/adminAuth')

// Show login page
admin_router.get('/',[ adminAuth.isLogout,adminAuth.isUser ],adminConteroller.showLogin);
// Verify admin login
admin_router.post('/', adminConteroller.verifyAdminLogin);
// Admin dashboard
admin_router.get('/dashboard',adminAuth.isUser,adminConteroller.adminDashboard);
// Create user form
admin_router.get('/createUser',adminConteroller.createUserLoad);
// Add a new user
admin_router.post('/createUser',adminConteroller.addUser);
// Edit user form
admin_router.get('/edit/:id', adminAuth.isUser,adminConteroller.editUserLoad);
// Update user details
admin_router.post('/edit/:id', adminConteroller.updateUser);
// Search users
admin_router.post('/search', adminConteroller.searchUser);
// Delete a user
admin_router.post('/delete/:id',adminConteroller.deleteUser);
// Admin logout
admin_router.get('/adminlogout', adminAuth.isLogin, adminConteroller.adminLogout);
admin_router.get('*',(req,res)=>{
    res.redirect('/admin')
})

module.exports = admin_router
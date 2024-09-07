const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const auth = require('../middleware/auth');

// Define routes

router.get('/',auth.isLogout,auth.isAdmin,userController.loginLoad)
router.post('/',auth.isLogout,userController.verifyLogin)
// router.use(userController.sessionHandle)
router.get('/home',auth.isAdmin,userController.loadHome)
router.get('/signup', auth.isAdmin,auth.isLogout, userController.loadSignup);
router.post('/signup', userController.insertUser);
router.get('/logout',auth.isLogin,userController.userLogout)

module.exports = router;
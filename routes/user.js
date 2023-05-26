const express=require('express');
const router=express.Router();
const {
    register,
    login,
    updatePassword,
    getAllUsers
}=require('../controllers/user');

// Register
router.post('/register',register);

// Login
router.post('/login',login);

// update password of user
router.put('/:id',updatePassword);

// get all users
router.get('/',getAllUsers);

module.exports=router;

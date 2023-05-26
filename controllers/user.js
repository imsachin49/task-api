const express=require('express');
const router=express.Router();
const User=require('../models/User');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

// Register
const register=async(req,res)=>{
    const {name,email,password}=req.body;
    console.log(req.body)
    try{
        if(!name || !email || !password){
            return res.status(400).json({message:"Please enter all fields"});
        }
        const user=await User.findOne({email});
        if(user){
            res.setHeader('Access-Control-Allow-Origin', '*'); // add this line
            return res.status(400).json({message:"User already exists"});
        }
        const salt=await bcrypt.genSalt(10);
        const hash=await bcrypt.hash(password,salt);
        const newUser=new User({
            name,
            email,
            password:hash
        });
        await newUser.save();
        res.status(200).json({message:"User registered successfully"});
    }catch(err){
        res.status(500).json({message:"Something went wrong"});
    }
}

// Login
const login=async(req,res)=>{
    const {email,password}=req.body;
    try{
        if(!email || !password){
            return res.status(400).json({message:"Please enter all fields"});
        }
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"User does not exists"});
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }
        const token=jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:"30d"});
        res.status(200).json({token,user:{id:user._id,name:user.name,email:user.email}});
    }catch(err){
        res.status(500).json({message:"Something went wrong"});
    }
}

// update password of user
const updatePassword=async(req,res)=>{
    const id=req.params.id;
    try {
        const user=await User.findById({_id:id});
        if(!user){
            return res.status(400).json({message:"User does not exists"});
        }

        const {oldPassword,newPassword}=req.body;
        if(!oldPassword || !newPassword){
            return res.status(400).json({message:"Please enter all fields"});
        }

        const isMatch=await bcrypt.compare(oldPassword,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Please write correct old password"});
        }

        const salt=await bcrypt.genSalt(10);
        const hash=await bcrypt.hash(newPassword,salt);

        const updatedUserPassword=await User.findByIdAndUpdate({_id:id},{password:hash},{new:true});
        res.status(200).json({message:"Password updated successfully"});

    } catch (error) {
        res.status(500).json({message:"Error in updating password"})
    }
}

// to test get all user
const getAllUsers=async(req,res)=>{
    try {
        const users=await User.find();
        res.status(200).json({users});
    } catch (error) {
        res.status(500).json({message:"Error in getting all users"})
    }
}

module.exports={register,login,updatePassword,getAllUsers};

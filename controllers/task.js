const express=require('express');
const router=express.Router();
const Task=require('../models/Task');
const User=require('../models/User');

// Create Task
const createTask=async(req,res)=>{
    const {title,description,status}=req.body;
    console.log(req.user);
    if(!title){
        return res.status(400).json({message:"Please enter title"});
    }
    try{
        const newTask=new Task({
            title,
            description,
            status,
            user:req.user._id
        });
        const task=await newTask.save();
        res.status(200).json({message:"Task created successfully",task});
    }
    catch(err){
        res.status(400).json({message:err.message});
    }
}

// Get all tasks of logged in user using async/await and try catch and populate User
const getAllTasks=async(req,res)=>{
    try{
        const tasks=await Task.find({user:req.user._id}).sort({createdAt:-1}).populate('user');
        res.status(200).json({tasks});
    }
    catch(err){
        res.status(400).json({message:err.message});
    }
}

// Get task by id 
const getTaskById=async(req,res)=>{
    try{
        const task=await Task.findById(req.params.id).populate('user');
        res.status(200).json({task});
    }
    catch(err){
        res.status(400).json({message:err.message});
    }
}

// Update task by id using async/await and try catch and populate User
const updateTaskById=async(req,res)=>{
    const {title,description,status}=req.body;
    try{
        const task=await Task.findById(req.params.id);
        if(!task){
            return res.status(400).json({message:"Task does not exists"});
        }
        const updatedTask=await Task.findByIdAndUpdate(req.params.id,{$set:{title,description,status}},{new:true}).populate('user');
        res.status(200).json({message:"Task updated successfully",updatedTask});
    }
    catch(err){
        res.status(400).json({message:err.message});
    }
}

// Delete task by id using async/await and try catch and populate User
const deleteTaskById=async(req,res)=>{
    try{
        const deletedTask=await Task.findByIdAndDelete(req.params.id);
        res.status(200).json({message:"Task deleted successfully",deletedTask});
    }catch(err){
        res.status(400).json({message:err.message});
    }
}

module.exports={createTask,getAllTasks,getTaskById,updateTaskById,deleteTaskById};

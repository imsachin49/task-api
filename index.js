const express=require('express');
const app=express();
const cors=require('cors');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const port=process.env.PORT || 8800;
const taskRoutes=require('./routes/task');
const userRoutes=require('./routes/user');
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Routes
app.use('/api/tasks',taskRoutes);
app.use('/api/users',userRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log(err);
});

// listen to port
app.listen(port,()=>{
    console.log(`Listening to port ${port}`);
});

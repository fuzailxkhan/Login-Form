const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const secret_key = "RimshaAnwar4ever"

const app = express();
app.use(express.json());
app.use(cors());

const userSchema = require('./schema/schema')

mongoose.connect('mongodb+srv://fuzail:spiderman123@cluster0.1ig1y1c.mongodb.net/?retryWrites=true&w=majority')
.then(()=>console.log("Connected To Database"))
.catch((err)=>console.log("Database ran into",err.message))

const db = mongoose.connection;
db.on('error',console.error.bind(console,'MongoDb Connection Error:'))
db.once('open',()=>console.log("MongoDB connected Successfully"))


const emailFind=async(email)=>{
    const user = await userSchema.find({email:email});
    return user;
}




app.post("/createAccount",async (req,res)=>{
    console.log(req.body)
    const user = await emailFind(req.body.email);
    if(user.length <=0){
        const salt = await bcrypt.genSalt(10);
        const pass = await bcrypt.hash(req.body.password,salt);
        const newUser = userSchema({email:req.body.email,password:pass});
        const savedUser = await newUser.save()
        console.log(savedUser);
        const token = jwt.sign({id:savedUser.id,email:savedUser.email},secret_key)

        res.status(200).json({"Message":"New Account Created on "+newUser.email,"token":token});
        
    }   
    else{
        res.status(200).json({"Message":"Email Already in Use"});
    }
    
})




app.post("/loginAccount",async (req,res)=>{
    console.log(req.body);
    const foundUser = await emailFind(req.body.email);
    if(bcrypt.compare(req.body.password,foundUser[0].password)){        
    res.status(200).json({"Message":"You are Logged in"})
    }
    else{
        res.status(200).json({"Message":"Incorrect Password"})
    }
})




app.listen(3000,(err)=>{
    if(err)throw err;
    else
        console.log("Server Running On Port 3000")
})
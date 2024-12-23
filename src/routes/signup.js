const express =require('express')
const { createUser } = require('../service/signup')
const route = express.Router()


route.post('/signup',async (req,res)=>{
    const user= await createUser(req.body)
    
    switch (user.status) {
        case 12:
            res.status(204).send({message:"User Already Exist"});
            break;
        case 11:
            res.status(200).send({message:"User created with id: ",userToken:user.token});
            break;
        default:
            res.status(204).send({message:"Unknown error occured at server"});
            break;
    }  
})

module.exports=route

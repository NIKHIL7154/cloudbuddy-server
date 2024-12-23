const express= require('express');
const { validateUser } = require('../service/login');
const route= express.Router()

route.post("/login",async (req,res)=>{
    const user=await validateUser(req.body)
    switch (user.status) {
        case 10:
            res.status(200).send({message:"Login successfull",token:user.token})
            break;
        case 11:
            res.status(204).send({message:"Invalid credentials"})
            break;
        case 14:
            res.status(204).send({message:"Invalid Password"})
            break;
        default:
            res.status(204).send({message:"Unknown error occured at server"});
            break;
    }
})

module.exports =route;
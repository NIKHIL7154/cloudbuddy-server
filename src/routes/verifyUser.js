const express = require('express');
const { verifytoken } = require('../middle/authverify');
const USER = require('../model/user');
const router= express.Router();


router.get("/verifyuser",verifytoken,async (req,res)=>{
    console.log("Request came for : "+req.authdata.name);
    try {
        const user = await USER.findById(req.authdata.id);
        if(user){
            res.status(200).send({name:user.name,email:user.email});
        }
        else{
            res.status(401).send({message:"Invalid token"});
        }
    } catch (error) {
        res.status(401).send({message:"Invalid token"});
        console.log('Error verifying user' + `${error}`);
    }
})

module.exports = router;

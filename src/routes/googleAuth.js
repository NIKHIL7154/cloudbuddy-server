const express = require('express');
const { verifytoken } = require('../middle/authverify');
const User = require('../model/user')
const route = express.Router()
const axios=require("axios");
const { createUser } = require('../service/signup');
const { generateToken } = require('../utils/usertoken');

function createCustomPass(email){
    return "12vb1"+email.split("@")[0]+"85ertv"
}

route.post("/getAccessToken", async (req, res) => {
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${req.body.accessToken}`, {
            headers: {
                Authorization: `Bearer ${req.body.accessToken}`,
                Accept: 'application/json'
            }
        })
        .then(async (userdata) => {
            const {data}=userdata
            
            const payload={
                name:data.name,
                email:data.email,
                pass:createCustomPass(data.email)
            }
            const response= await createUser(payload)
            switch (response.status) {
                case 11:
                    
                    res.status(201).json({message:"New account created",userToken:response.token})
                    break;
                case 12:
                    let data=response.data
                    let newToken = await generateToken({name:data.name,id:data._id})
                    res.status(200).json({message:"Login done",userToken:newToken})
                    break;
            
                default:
                    res.status(404).json({message:"Internal error occured"})
                    break;
            }

        })
        .catch((err) => {
            
            console.log(err)
        res.status(404).json({message:"Internal error"})});

})




module.exports = route;
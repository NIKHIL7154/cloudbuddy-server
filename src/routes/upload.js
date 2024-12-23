const express= require('express');
const { uploadFile } = require('../service/uploadFeat');
const { UniqueID } = require('../utils/helpers');
const { addWebsiteToDatabase } = require('../service/databaseService');
const { verifytoken } = require('../middle/authverify');

const route= express.Router()
const HostLink="https://nikhilcloud.top/"

route.post("/multiupload",async (req,res)=>{
    const files=req.body.data
    let uid=UniqueID(5)
    let response=[]
    for(let file of files){
        response.push(await uploadFile(file.dir,file.type,uid))
        
    }
    
    res.json({Urls:response,endpoint:(HostLink+uid),id:uid})
    
})

//verifytoken to add
route.post("/addwebsite",verifytoken, async (req,res)=>{
    const data= req.body.data
    
    const payload={...data,...req.authdata,endpoint:HostLink+data.webid}
    
    if(await addWebsiteToDatabase(payload)){
        res.json({status:"success",message:"Website added successfully",endpoint:HostLink+data.webid})
        return
    }
    res.status(401).json({status:"error",message:"Website not added"})
})

route.post("/addgitwebsite", async (req,res)=>{

    const data= req.body
    console.log(data);
    
    const payload={...data}
    
    if(await addWebsiteToDatabase(payload)){
        res.json({status:"success",message:"Website added successfully",endpoint:data.endpoint})
        return
    }
    res.status(401).json({status:"error",message:"Website not added"})
})
module.exports =route;
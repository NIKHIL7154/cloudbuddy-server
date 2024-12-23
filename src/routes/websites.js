const express= require("express")
const { fetchWebsites } = require("../service/fetch_websites")
const { verifytoken } = require("../middle/authverify")

const route = express.Router()

route.get("/websites",verifytoken,async (req,res)=>{
    const result= await fetchWebsites(req.authdata)
    
    if(result){
        res.send(result)
    }else{
        res.send([])
    }
    
    
})

module.exports= route
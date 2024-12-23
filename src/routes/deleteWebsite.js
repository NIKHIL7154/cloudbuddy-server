const express= require("express");
const { verifytoken } = require("../middle/authverify");
const router= express.Router();
const USER= require("../model/user");
router.post("/deletewebsite",verifytoken,(req,res)=>{
    try {
        const {websiteid}=req.body;
        USER.findByIdAndUpdate(req.authdata.id,{
            $pull:{
                websites:{
                    id:websiteid
                }
            }
        }).then(()=>{
            res.status(200).send({message:"Website deleted successfully"});
        }).catch((error)=>{
            res.status(500).send({message:"Internal server error"});
            console.log("Error deleting website : "+error);})
    } catch (error) {
        res.status(500).send({message:"Internal server error"});
        console.log("Error deleting website : "+error);
        
    }
})
module.exports=router;
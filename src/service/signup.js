const mongoose=require('../configs/dbconfig')
const User = require('../model/user')
const bcrypt = require('bcrypt')
const { generateToken } = require('../utils/usertoken')

async function createUser(userdata){
    try {
        
        const userExist= await User.findOne({email:userdata.email})
        if(userExist){
            return {status:12,data:userExist}
        }
        let hashpass= await bcrypt.hash(userdata.pass,15)
        
        let user= new User({name:userdata.name,
            email:userdata.email,
            password:hashpass,
            websites:[]
        })
        const createdUser= await user.save()
        if(createdUser){
            const payload={name:createdUser.name,id:createdUser._id}
            const token=await generateToken(payload)
            return {status:11,token}
        }else{
            throw error;
        }
    } catch (error) {
        return {status:13};
    }
    
    
}

module.exports={createUser}
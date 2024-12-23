const jwt= require('jsonwebtoken')
const { authKey } = require('../configs/validationkey')


async function verifytoken(req,res,next){
    try{
        if(!req.headers.authorization){
            console.log("No token")
            res.status(401).send("No token provided.")
            return
        }
        const [bearer,token]=req.headers.authorization.split(" ")
        if(bearer!="Bearer" || !token){
            res.status(401).send("No token found")
            return
        }
        jwt.verify(token,authKey,(err,data)=>{
            if(err){
                res.status(401).send({message:"Invalid token"})
                console.log(err)
                return
            }
            req.authdata=data
            next()
        })
    }catch(e){
        res.status(401).send({message:"Invalid token"})
        console.log("Catch block of verify: "+e)
    }
    


    
}

module.exports={verifytoken}
const jwt= require('jsonwebtoken');
const { authKey } = require('../configs/validationkey');

async function generateToken(payload){
    const token=await jwt.sign(payload,authKey,{expiresIn:"5h"});
    return token;
}

module.exports ={
    generateToken
}

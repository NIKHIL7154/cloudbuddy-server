
const mongoose=require('../configs/dbconfig')

const websiteSchema = new mongoose.Schema({
    name:String,
    id:String,
    url:String,
    date:String,
    gitUrl:String,
    status:Boolean
})
const user= new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    websites:[websiteSchema]
})

module.exports=mongoose.model("user",user);


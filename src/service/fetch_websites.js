const User = require('../model/user')

async function fetchWebsites(data){
    const user =await User.findOne({_id:data.id})
    if(!user){
        return false
    }
    let webarray = await user.get("websites")
    webarray = webarray.sort((a, b) => new Date(b.date) - new Date(a.date))
    return webarray
}

module.exports={fetchWebsites}
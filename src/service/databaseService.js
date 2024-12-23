const { formatDate } = require("../utils/helpers");
const User = require("../model/user")

async function addWebsiteToDatabase(info){
    try {
        const updatedDocument = await User.findByIdAndUpdate(
            info.id,
            { $push: { websites: {name:info.webname,url:info.endpoint,id:info.webid,date:formatDate(),status:true,gitUrl:info.gitUrl ? info.gitUrl:""} } },
            { new: true } // Return the updated document
        );

        if (!updatedDocument) {
            
            return false;
        }

        console.log(`Object added to items array:`);
        return true;
    } catch (error) {
        console.error('Error updating document:');
        return false;
    }
}

module.exports={
    addWebsiteToDatabase

}
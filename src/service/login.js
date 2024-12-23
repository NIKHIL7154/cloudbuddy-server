const User = require('../model/user')
const bcrypt = require('bcrypt')
const { generateToken } = require('../utils/usertoken')

async function validateUser(userdata) {
    try {
        const user = await User.findOne({ email: userdata.email })
        if (!user) {
            return { status: 11 }
        }
        let passmatch= await bcrypt.compare(userdata.pass,user.password)
        if(!passmatch){
            return { status: 14 }
        }
        const payload={name:user.name,id:user._id}
        const token = await generateToken(payload)
        return { status: 10, token }
    } catch (error) {
        return {status:12}
    }


}

module.exports = { validateUser }
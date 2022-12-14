const userSchema = require('../model/user.js')
const roleSchema = require('../model/role.js')

const jwt = require('jsonwebtoken');
const JWTSECRET = process.env.JWTSECRET;


const signUp = async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
        const newUser = userSchema({
            username: username.toLowerCase().trim(),
            email: email.toLowerCase().trim(),
            password: password,
        })
        const foundEmail = await userSchema.findOne({ email: email })
        if (foundEmail) {
            return res
                .status(400)
                .json({ message: 'E-mail already registered' })
        }

        if (!role) {
            const foundRole = await roleSchema.findOne({ name: 'user' })
            newUser.role = foundRole.name
        }
        const savedUser = await newUser.save();

        res
            .status(201)
            .json({ message: 'User successfully registered' });

    } catch (error) {
        res
            .status(401)
            .json({ message: 'Failure to register user' })
    }
}



const logIn = async (req, res) => {
    const { userOrEmail, password } = req.body
    try {
        if (!userOrEmail) {
            return res
                .status(401)
                .json({ message: "Please send your username or email" });
        } else if (!password) {
            return res
                .status(401)
                .json({ message: "Please send your password" });
        }

        const userFound = await userSchema.findOne({ email: userOrEmail }) || await userSchema.findOne({ username: userOrEmail })

        if (!userFound) {
            return res
                .status(401)
                .json({ message: "User not found" })
        }
        const isMatch = await userFound.comparePassword(password, userFound.password);
        if (!isMatch) {
            return res
                .status(401)
                .json({ message: 'Invalid password' })
        }
        const { _id } = userFound;
        const dataUser = { _id }
        const token = jwt.sign({ id: userFound._id }, JWTSECRET, {
            expiresIn: 86400 //24 hours
        })
        res
            .status(200)
            .json({ token, dataUser })
    } catch (error) {
        res
            .status(500)
            .json({ message: "Internal Server Error" })
    }
}



module.exports = {
    signUp,
    logIn,
};
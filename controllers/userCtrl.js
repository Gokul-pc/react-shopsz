const Users = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


const userCtrl = {
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body;

            const user = await Users.findOne({ email })
            if (user) return res.status(400).json({ msg: "this email already exist" })

            if (password.length < 6)
                return res.status(400).json({ msg: "password must be atleast 6 charecters long" })

            //password encryption
            const passwordHash = await bcrypt.hash(password, 10)
            const newUser = new Users({
                name, email, password: passwordHash
            })

            //save to mongodb
            await newUser.save()

            //creating jsonwebtoken to authentication
            const accesstoken = createAccessToken({ id: newUser._id })
            let refreshtoken = createRefreshToken({ id: newUser._id })

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token'
            })

            res.json({ accesstoken })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body
            const user = await Users.findOne({ email })
            if (!user) return res.status(400).json({ msg: "User does not exist" })
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) return res.status(400).json({ msg: "INCORRECT PASSWORD" })
            //IF LOGIN SUCCESS!
            const accesstoken = createAccessToken({ id: user._id })
            let refreshtoken = createRefreshToken({ id: user._id })

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token'
            })

            res.json({ accesstoken })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', { path: '/user/refresh_token' })
            return res.json({ msg: "Logged out" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    refreshToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken;
            if (!rf_token) return res.status(500).json({ msg: 'Please Login or register' })

            jwt.verify(rf_token, process.env.REFRESH_TOKEN, (err, user) => {
                if (err) return res.status(500).json({ msg: 'Please Login or register' })
                const accesstoken = createAccessToken({ id: user.id })
                res.json({ accesstoken })
            })
            res.json({ rf_token })

        } catch (err) {
            return res.status(500).json({ msg: err.message })

        }

    },
    getUser: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id).select("-password")
            if (!user) return res.status(400).json({ msg: "User does not exist" })
            res.json(user)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }
}
 





const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: "1d" })
}
const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN, { expiresIn: "7d" })
}

module.exports = userCtrl
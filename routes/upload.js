const router = require('express').Router()
const cloudinary = require('cloudinary')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

//CLOUDINARY CONFIGURATION
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

//uploading images to cloudinary
router.post('/upload', (req, res) => {
    try {
        console.log(req.files);
        if (!req.files || Object.keys(req.files).length === 0)
            return res.status(400).send('No files were uploded.')
        const file=req.files.file
        res.json('test upload')
    } catch (err) {
        res.status(500).json({ msg: err.message })
    }
})

module.exports = router
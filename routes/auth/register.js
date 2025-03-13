var express = require('express')
var router = express.Router()
var usersModel = require('../../model/usersModel')

//digunakan untuk melakukan resgistrasi pada username dan melakukan pengecekan apakah usrname sudah di gunakan atau tidak
router.post('/', async (req, res) => {
    const { username , password } = req.body
    if (!username) {
        return res.status(400).json({ message: 'username harus di isi'})
    } else if (!password) {
        return res.status(400).json({ message: 'Password harus di isi'})
    }

    try {
        const existingUser = await usersModel.getByUsername(username)

        if (existingUser) {
            return res.status(400).json({ message: 'Username sudah digunakan'})
        }

        await usersModel.registerUser(username, password)
        res.status(201).json({ message: 'Resgistre berhasil'})
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
})

module.exports = router
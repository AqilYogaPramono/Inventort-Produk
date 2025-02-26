var express = require('express')
var router = express.Router()
const kategoriModel = require('../model/kategoriModel')

//Menampilkan semua data kategori dari database menggunakan kategoriModel.getAll()
router.get('/kategori', async (req, res, next) => {
    try {
        let rows = await kategoriModel.getAll()
        return res.status(200).json(rows)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//menambahkan data lalu disimpan ke database dengan kategoriModel.Store(data).
router.post('/kategori', async (req, res, next) => {
    let {nama_kategori} = req.body
    let data = { nama_kategori }
    try {
        await kategoriModel.Store(data)
        res.status(201).json({message: 'ok'})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//menggunkaan id dan nama_kategori lalu memanggil kategoriModel.update(id, data) untuk mengupdate kategori di database.
router.put('/kategori/update/(:id)', async (req, res, next) => {
    let id = req.params.id
    let {nama_kategori} = req.body
    let data = { nama_kategori }
    try {
        await kategoriModel.update(id, data)
        console.log(data)
        return res.status(201).json({message: 'ok'})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//Menggunakan id lalu memanggil kategoriModel.delete(id) untuk menghapus kategori dari database.
router.delete('/kategori/delete/(:id)', async (req, res, next) => {
    let id = req.params.id
    try {
        await kategoriModel.delete(id)
        return res.status(201).json({message: 'ok'})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})


module.exports = router
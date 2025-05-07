var express = require('express')
var router = express.Router()
const kategoriModel = require('../model/kategoriModel')
const verifyToken = require('../config/middleware/jwt')
const cacheMiddleware = require('../config/middleware/cacheMiddleware')
const { kategoriQueue } = require('../jobs/worker')

//Menampilkan semua data kategori dari database menggunakan kategoriModel.getAll()
router.get('/', cacheMiddleware, async (req, res, next) => {
    try {
        const job = await kategoriQueue.add({action: 'get'})
        const result = await  job.finished()
        return res.status(200).json(result.data)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//menambahkan data lalu disimpan ke database dengan kategoriModel.Store(data).
router.post('/store', async (req, res, next) => {
    let {nama_kategori} = req.body
    let data = { nama_kategori }
    try {
        const job = await kategoriQueue.add({ action: 'store', data})
        await job.finished()
        res.status(201).json({message: 'ok'})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//menggunkaan id dan nama_kategori lalu memanggil kategoriModel.update(id, data) untuk mengupdate kategori di database.
router.patch('/update/:id', async (req, res, next) => {
    let id = req.params.id
    let {nama_kategori} = req.body
    let data = { nama_kategori }
    try {
        const job = await kategoriQueue.add({ action: 'update', data})
        await job.finished()
        return res.status(201).json({message: 'ok'})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//Menggunakan id lalu memanggil kategoriModel.delete(id) untuk menghapus kategori dari database.
router.delete('/delete/:id', async (req, res, next) => {
    let id = req.params.id
    try {
        const job = await kategoriQueue.add({ action: 'delete', id})
        await job.finished()
        return res.status(201).json({message: 'ok'})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})


module.exports = router
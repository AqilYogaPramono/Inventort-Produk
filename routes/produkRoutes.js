var express = require('express')
var router = express.Router()
const produkModel = require('../model/produkModel')

const fs = require('fs')
const multer = require('multer')
const path = require('path')
const nodeCache = require('node-cache')
const cache = new nodeCache({ stdTTL: 60 })

//Digunakn untuk meguploud file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        console.log(file)
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

//digunkana untuk mengfilter gambar saja yang bisa di uploud
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        return cb(null, true)
    }
    return cb(new Error('Only Image files are allowed'), false)
}

//digunakan untuk melimit uploud gambar agar hanya berukuran max 1MB
const limits = { fileSize: 1 * 1024 * 1024 }

const upload = multer({storage: storage, limits, fileFilter})

//Menampilkan semua data produk dari database menggunakan produkModel.getAll()
router.get('/', async (req, res, next) => {
    try {
        const cacheKey = 'all_product'
        let cacheData = cache.get(cacheKey)

        if (cacheKey) {
            return res.status(200).json({
                status: true,
                message: 'Data produk (cache)',
                data: cacheData
            })
        }
        let rows = await produkModel.getAll()
        return res.status(200).json(rows)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Menampilkan data produk dari database menggunakan produkModel.getId(id)
router.get('/:id', async (req, res, next) => {
    let id = req.params.id
    try {
        let rows = await produkModel.getId(id)
        console.log(id)
        return res.status(200).json(rows)
    } catch {
        res.status(500).json({ message: error.message })
    }
})

//menambahkan data lalu disimpan ke database dengan produkModel.Store(data).
router.post('/store', upload.single("gambar_produk"), async (req, res, next) => {
    let { nama_produk, id_kategori } = req.body
    console.log(req.body)
    let data = {nama_produk, gambar_produk: req.file.filename, id_kategori }
    let gambar = req?.file?.filename || null

    try {
        await produkModel.store(data)
        return res.status(200).json({message: 'ok'})
    } catch (error) {
        if (gambar) {
            const newpath = path.join(__dirname, '../public/images/', gambar)
            if (fs.existsSync(newpath)) {
                fs.unlinkSync(newpath)
            }
            res.status(500).json({ message: error.message})
        }
    }
})

//menggunkaan id lalu memanggil produkModel.update(id, data) untuk mengupdate produk di database.
router.patch('/update/:id', upload.single("gambar_produk"), async (req, res, next) =>  {
    let id = req.params.id
    let { nama_produk, id_kategori } = req.body

    try {
        let gambar = req.file ? req.file.filename : null
        let rows = await produkModel.getId(id)
        if (!rows || rows.length == 0) {
            if (gambar) {
                const newpath = path.join(__dirname, '../public/images/', gambar)
                if (fs.existsSync(newpath)) {
                    fs.unlinkSync(newpath)
                }
                return res.status(404).json({ message: 'Data produk tidak di temukan' })
            }
        }

        const fileold = rows[0].gambar_produk
        if (gambar && fileold) {
            const pathfile = path.join(__dirname, '../public/images/', fileold)
            if (fs.existsSync(pathfile)) {
                fs.unlinkSync(pathfile)
            }
        }

        let gambar_produk = gambar || fileold
        let data = { nama_produk, gambar_produk, id_kategori }

        await produkModel.update(data, id)
        return res.status(200).json({ message: 'ok' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Menggunakan id lalu memanggil produkModel.delete(id) untuk menghapus produk dari database.
router.delete('/delete/:id', async (req, res, next) => {
    let id = req.params.id

    try {
        let rows = await produkModel.getId(id)
        if (!rows || rows.length == 0) {
            return res.status(404).json({ message: 'Data produk tidak ditemuakn'})
        }

        const fileold = rows[0].gambar_produk
        if (fileold) {
            const pathfile = path.join(__dirname, '../public/images/', fileold)
            fs.unlinkSync(pathfile)
        }

        await produkModel.delete(id)
        return res.status(200).json({ message: 'ok' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router
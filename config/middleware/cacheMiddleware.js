const Redis = require('ioredis')
const redis = new Redis({ host: '127.22.30.5', port: 6379})

redis.ping((err, result) => {
    if (err) {
        console.log('Redis tidak terkoneksi: ', err)
    } else {
        console.log('Redis terkoneksi: ', result)
    }
})

const cacheMiddleware = async (req, res, next) => {
    const cacheKey = req.originalUrl
    const cacheData = await redis.get(cacheKey)

    if (cacheData) {
        console.log("Data diambil dari cache")
        return res.json(JSON.parse(cacheData))
    }

    res.sendResponse = res.json
    res.json = async (body) => {
        await redis.setex(cacheKey, 60, JSON.stringify(body))
        console.log(`Data untuk ${cacheKey} disimpan ke cache`)
        res.sendResponse(body)
    }
    next()
}

module.exports = cacheMiddleware
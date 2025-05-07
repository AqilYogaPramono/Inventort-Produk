const Queue = require('bull')

const redisConfig = {
    redis: { host: '172.26.166.13', port: 6379 }
}

const kategoriQueue = new Queue('kategoriQueue', redisConfig)

kategoriQueue.getWaiting(0, 100).then(jobs => console.log('waiting:', jobs));
kategoriQueue.getActive(0, 100).then(jobs  => console.log('active:', jobs));
kategoriQueue.getFailed(0, 100).then(jobs  => console.log('failed:', jobs));

(async () => {
    console.log("Membersihkan job lama di queue...")

    await kategoriQueue.clean(0, 'delayed')
    await kategoriQueue.clean(0, 'wait')
    await kategoriQueue.clean(0, 'failed')
    await kategoriQueue.clean(0, 'completed')

    console.log("queue dibersihkan!")
})()

const produkQueue = new Queue('produkQueue', redisConfig)
produkQueue.getWaiting(0, 100).then(jobs => console.log('produk waiting:', jobs));
produkQueue.getActive(0, 100).then(jobs  => console.log('produk active:', jobs));
produkQueue.getFailed().then(jobs  => console.log('produk failed:', jobs))

module.exports = { kategoriQueue, produkQueue }
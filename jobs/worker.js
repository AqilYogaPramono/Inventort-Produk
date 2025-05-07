const kategoriModel = require('../model/kategoriModel');
const { kategoriQueue, produkQueue } = require('../config/middleware/queue');
const produkMoedl = require('../model/produkModel');

kategoriQueue.process(async (job) => {
    const { id, action, data } = job.data;
    console.log(`Memproses antrian kategori... (ID: ${job.id}, Action: ${action})`);
    
    if (action === 'get') {
        const hasilQuery = await kategoriModel.getAll();
        console.log(`Antrian ID ${job.id} selesai: data kategori diambil.`);
        return { data: hasilQuery };
    }

    if (action === 'store') {
        await kategoriModel.Store(data);
        return { message: 'Kategori berhasil ditambahkan' };
    }

    if (action === 'update') {
        console.log(data);
        await kategoriModel.update(id, data);
        return { message: `Kategori dengan ID ${id} berhasil diperbarui` };
    }

    if (action === 'delete') {
        await kategoriModel.delete(id);
        return { message: `Kategori dengan ID ${id} berhasil dihapus` };
    }
    });

produkQueue.process(async (job) => {
});

console.log("Worker berjalan dan siap memproses banyak antrian...");

module.exports = { kategoriQueue };
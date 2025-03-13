const connection = require('../config/database')

class Model_Produk {
//digunakan unruk menampilakn seluruh isi dari tabel produk
static async getAll() {
        return new Promise((resolve, reject) => {
            connection.query(`select produk.produk_id, produk.nama_produk, produk.gambar_produk, kategori.nama_kategori from produk inner join kategori on produk.id_kategori = kategori.kategori_id`, (err, rows) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                }
            )
        })
    }

//digunakan untuk menampilkan produk berdasarkan id yang di inginkan
    static async getId(id) {
        return new Promise((resolve, reject) => {
            connection.query(`select * from produk a left join kategori b on b.kategori_id=a.id_kategori where a.produk_id = ?`, id, (err, result) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(result)
                    }
                }
            )
        })
    }

//digunakan untuk menambahkan data pada tabel produk
    static async store(data) {
        return new Promise((resolve, reject) => {
            connection.query(`insert into produk set ?`, data, (err, result) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(result)
                    }
                }
            )
        })
    }

    //digunkan untuk update data di tabel produk berdasarkan produk_id yang di inputkan
    static async update(data, id) {
        return new Promise((resolve, reject) => {
            connection.query(`update produk set ? where produk_id = ?`, [data, id], (err, result) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(result)
                    }
                }
            )
        })
    }

//digunakan untuk melakukan delete pada tabel produk berdasarkan produk_id
    static async delete(id) {
        return new Promise((resolve, reject) => {
            connection.query(`delete from produk where produk_id = ?`, id, (err, result) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(result)
                    }
                }
            )
        })
    }
}

module.exports = Model_Produk
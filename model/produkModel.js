const connection = require('../config/database')

class Model_Produk {
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
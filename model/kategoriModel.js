const connection = require('../config/database')

class kategoriModel {
//digunakan unruk menampilakn seluruh isi dari tabel kategori
    static async getAll() {
        return new Promise((resolve, reject) => {
            connection.query(`select * from kategori`, 
                (err, rows) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                }
            )
        })
    }

//digunakan untuk menambahkan data pada tabel kategori
    static async Store(data) {
        return new Promise((resolve, reject) => {
            connection.query(`insert into kategori set ?`, data, 
                function(err, result) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(result)
                    }
                }
            )
        })
    }

//digunakan untuk menampilkan kategori berdasarkan id yang di inginkan
    static async getId(id) {
        return new Promise((resolve, reject) => {
            connection.query(`select * from kategori where id_kategoti = `, + id, 
                function(err, result) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(result)
                    }
                }
            )
        })
    }

//digunkan untuk update data di tabel kategori berdasarkan kategori_id yang di inputkan
    static async update(id, data) {
        return new Promise((resolve, reject) => {
            connection.query(`update kategori set ? where kategori_id = ?`, [data, id], 
                function(err, result) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(result)
                    }
                }
            )
        })
    }

//digunakan untuk melakukan delete pada tabel kategori berdasarkan kategori_id
    static async delete(id) {
        return new Promise((resolve, reject) => {
            connection.query(`delete from kategori where kategori_id = ? `,  [id], 
                function(err, result) {
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

module.exports = kategoriModel
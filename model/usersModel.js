const connection = require('../config/database')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { token } = require('morgan')

class usersModel {
//digunakan untuk menammpilkan seluruh tabel users
    static async getAll() {
        return new Promise ((resolve, reject) => {
            connection.query('select users_id, useranme, create_at from users order by user_id desc', (err, rows) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
    }

//digunakan untuk menambahkan data pada tabel users
    static async store(data) {
        return new Promise ((resolve, reject) => {
            connection.query('insert into set ?',data, (err, rows) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
    }

//digunakan untuk menampilkan data berdasarkan id yang di inputkan 
    static async getId(id) {
        return new Promise ((resolve, reject) => {
            connection.query('select user_id, username, create_at from users where user_id = ?',[id], (err, rows) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
    }

//digunakan untuk update data pada tabel users
    static async update(id, data) {
        return new Promise ((resolve, reject) => {
            connection.query('update users set = ? where user_id = ?',[data, id], (err, rows) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
    }

//digunakan untuk menghapus data bersarkan id yang di inputkan 
    static async delete(id) {
        return new Promise ((resolve, reject) => {
            connection.query('delete from users where users_id = ?',[id], (err, rows) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
    }

//digunkan untuk menampilakn username pada tabel users
    static async getByUsername(username) {
        return new Promise ((resolve, reject) => {
            connection.query('select * from users where username = ?',[username], (err, rows) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(rows[0])
                }
            })
        })
    }

//digunakan untuk manambahkan data username dan password, lalu mengenkripsi password menggunakan bcryptjs
    static async registerUser(username, password) {
        return new Promise (async (resolve, reject) => {
            try {
                const hashedPassword = await bcrypt.hash(password, 10)
                connection.query('insert into users (username, password) values (?, ?)',[username, hashedPassword], (err, result) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(result)
                    }
                })
            } catch (error) {
                reject(error)
            }
        })
    }

//digunakan untuk menampilakn tabel users berdasarkan username dan membuat token untuk loginnya
static async login(username, password) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE username = ?';

        connection.query(sql, [username], async (err, result) => {
            if (err) {
                return reject({ status: 500, message: err.message, error: err });
            }

            if (result.length === 0) {
                return reject({ status: 403, message: 'Username not found' });
            }

            const user = result[0];
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return reject({ status: 401, message: 'Password salah' });
            }

            const token = jwt.sign(
                {
                    id: user.user_id,
                    username: user.username
                },
                process.env.JWT_SECRET,
                { expiresIn: '1000d' }
            );

            resolve({ token });
        });
    });
}

}

module.exports = usersModel
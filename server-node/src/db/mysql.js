const mysql = require('mysql')
const { MYSQL_CONF } = require('../config/db')

// const con = mysql.createConnection(MYSQL_CONF)
console.log(MYSQL_CONF)
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'myblog',
    port: 3306
})

// 开始连接
con.connect((err) =>{
    if(err) throw err;
    console.log('链接成功')
})

// 链接数据库
// var conn

// function handleDisconnection() {
//     var connection = mysql.createConnection(MYSQL_CONF);

//     connection.connect(function (err) {
//         if (err) {
//             setTimeout(handleDisconnection(), 2000)
//         }
//     });
//     connection.on('error' , function(err) {
//         if (err.code === 'PROTOCOL_CONNECTION_LOST') {
//             console.log('重连')
//             handleDisconnection()
//         } else {
//             throw err;
//         }
//     });
//     conn = connection
// }


// 统一执行sql的函数
function exec(sql) {

    // handleDisconnection()

    const promise = new Promise((resolve, reject) => {
        con.query(sql, (err, result) => {
            if (err) return reject(err)
            return resolve(result)
        })
    })
    return promise
}

module.exports = {
    exec
}


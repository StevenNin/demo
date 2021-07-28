const env = process.env.NODE_ENV  // 环境参数

let MYSQL_CONF
let REDIS_CONF

// 本地环境
if (env === 'dev') {
    // mysql 配置
    MYSQL_CONF = {
        host: 'localhost',
        user: 'root',
        password: '123456',
        port: 3306,
        database: 'myblog'
    },
    // redis 配置
    REDIS_CONF = {
        port: 6379,
        host: '127.0.0.1'
    }
}

// 线上环境
if (env === 'production') {
    MYSQL_CONF = {
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'myblog',
        port: 3306
    },
    // redis 配置
    REDIS_CONF = {
        port: 6379,
        host: '127.0.0.1'
    }
}

module.exports = {
    MYSQL_CONF,
    REDIS_CONF
}
const redis = require("redis")
const { REDIS_CONF } = require('../config/db')

const redisClient = redis.createClient({
    port: 6379,
    host: '127.0.0.1'
})

redisClient.on('error', err => {
    console.error(err);
})

// testProject
// redisClient.set('hello', 5, function(err, obj) {
//     redisClient.get('hello', function(err,data) {
//         console.log(data);        
//     })
//     redisClient.incr('hello', function(err,data) {
//         redisClient.get('hello', function(err,data) {
//             console.log(data);        
//         })
//     })
// })

function set(key, val) {
    if (typeof val === 'object') {
        val = JSON.stringify(val)
    }
    redisClient.set(key, val, redis.print)
}

var get = async(key)=> {
    // const promise = new Promise((resolve, reject) => {
    //     redisClient.get(key, (err, val) => {
    //         if (err) return reject(err)
    //         // console.log(val)
    //         if (val == null) {
    //             return resolve(null)
    //         }
    //         try {
    //             resolve(JSON.parse(val))
    //         } catch (error) {
    //             resolve(val)
    //         }
    //     })
    // })
    // return promise
    const newGet = async(key) => {
        let val = await new Promise((resolve => {
            redisClient.get(key, function (err, res) {
                return resolve(res);
            });
        }));
        return JSON.parse(val);
    };
    return await newGet(key);
}

module.exports = {
    set, get
}

// const config = {
//     host: '127.0.0.1',
//     port: '6379',
// };

// // 客户端
// const RedisClient = redis.createClient(config);


// RedisClient.synGet = async(key) => {
//     const newGet = async(key) => {
//         let val = await new Promise((resolve => {
//             RedisClient.get(key, function (err, res) {
//                 return resolve(res);
//             });
//         }));
//         return JSON.parse(val);
//     };
//     return await newGet(key);
// };

// module.exports = RedisClient
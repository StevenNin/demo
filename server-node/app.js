const urlObj = require('url')

const handleBlogRouter = require("./src/router/blog")
const handleUserRouter = require("./src/router/user")
const { set, get } = require('./src/db/redis')

const SESSION_DATA = {}


// 获取cookie的过期时间
const getCookieExpires = () => {
    const d = new Date()
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
    // console.log(d.toGMTString())
    return d.toGMTString()
}

// 用于处理post data
const getPostData = (req) => {
    const promise = new Promise((resolve, reject) => {
        if (req.method !== "POST") {
            return resolve({})
        }
        if (req.headers['content-type'] !== 'application/json') {
            return resolve({})
        }
        let postData = ''
        req.on('data', chunk => {
            postData += chunk.toString()
        })
        req.on('end', () => {
            // console.log(postData)
            if (!postData) return resolve({})
            return resolve(JSON.parse(postData))
        })
    })
    return promise
}


// 设置返回格式 JSON
const serverHandle = (req, res) => {
    res.setHeader('content-type', 'application/json')
    req.path = urlObj.parse(req.url, true).pathname

    // console.log(req.url) /api/blog/list?author=zhangsan&keyword=A
    // 获取请求参数，增加true后会转换成一个对象
    req.query = urlObj.parse(req.url, true).query
    // console.log(req.query)


    // 处理cookie
    req.cookie = {}
    const cookieStr = req.headers.cookie || ''
    cookieStr.split(';').forEach(item => {
        if (!item) return
        const arr = item.split('=')
        const key = arr[0].trim()
        const val = arr[1].trim()
        // console.log(key, val) 
        req.cookie[key] = val
    })

    // console.log("cookie is :", req.cookie)

    // 解析session
    let needSetCookie = false
    let userId = req.cookie.userid

    // if (userId) {
    //     if (!SESSION_DATA[userId]) {
    //         SESSION_DATA[userId] = {}
    //     }
    //     console.log(SESSION_DATA[userId], "app-74")
    // } else {
    //     needSetCookie = true
    //     userId = `${Date.now()}_${Math.random()}`
    //     SESSION_DATA[userId] = {}
    // }
    // req.session 和 SESSION_DATA[userId] 指向同一个空对象
    // 首页req.session 改变则 SESSION_DATA[userId]也改变
    // req.session = SESSION_DATA[userId]

    req.sessionId = userId

    get(req.sessionId).then(sessionData => {
        if (sessionData == null) {
            set(req.sessionId, {})
            req.session = {}
        }
        else {
            req.session = sessionData
        }
        // 处理post数据
        return getPostData(req)
    }).then(postData => {
        req.body = postData
        const blogResult = handleBlogRouter(req, res)
        if (blogResult) {
            blogResult.then(blogData => {
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly;expires=${getCookieExpires()}`)
                }
                res.end(JSON.stringify(blogData))
            })
            return
        }

        const userResult = handleUserRouter(req, res)
        if (userResult) {
            userResult.then(userData => {
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly;expires=${getCookieExpires()}`)
                }
                res.end(JSON.stringify(userData))
            })
            return
        }


        // 未命中路由 返回404
        res.writeHead(404, {
            'content-type': 'text/plain'
        })
        res.end("404 Not Found\n")
    })

    // 处理postdata
    // getPostData(req).then(postData => {
    //     req.body = postData

    //     // 处理blog 路由

    //     // console.log(req.session)
    //     const blogResult = handleBlogRouter(req, res)
    //     if (blogResult) {
    //         blogResult.then(blogData => {
    //             if (needSetCookie) {
    //                 res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly;expires=${getCookieExpires()}`)
    //             }
    //             res.end(JSON.stringify(blogData))
    //         })
    //         return
    //     }

    //     // 处理user路由
    //     // const userData = handleUserRouter(req, res)

    //     const userResult = handleUserRouter(req, res)
    //     if (userResult) {
    //         userResult.then(userData => {
    //             if (needSetCookie) {
    //                 res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly;expires=${getCookieExpires()}`)
    //             }
    //             res.end(JSON.stringify(userData))
    //         })
    //         return
    //     }


    //     // 未命中路由 返回404
    //     res.writeHead(404, {
    //         'content-type': 'text/plain'
    //     })
    //     res.end("404 Not Found\n")
    // })


}
module.exports = serverHandle

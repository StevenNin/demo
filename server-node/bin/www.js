const http = require('http')

const serverHandle = require('../app')

const PORT = 8000

console.log('服务设置')
const server = http.createServer(serverHandle)

server.listen(PORT)
class BaseModel {
    /**
     * 构造函数
     * @param {Object} data 数据
     * @param {string} message 信息
     */
    constructor(data, message) {
        if (typeof data === 'string') {
            /* 
                做参数兼容，如果没有出入message，
                那么直接把data赋给message
            */
            [data, message] = [message, data]
        }
        if (data) this.data = data

        if (message) this.message = message
    }
}

class SuccessModel extends BaseModel {
    constructor(data, message) {
        super(data, message)
        this.errno = 0
    }
}

class ErrorModel extends BaseModel {
    constructor(data, message) {
        super(data, message)
        this.errno = -1
    }
}

module.exports = {
    SuccessModel,
    ErrorModel
}
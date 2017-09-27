import { Message } from 'element-ui'

export class Notify {

    constructor(title = '') {
        this.title = title
    }

    success(message) {
        Message.success({ title: this.title, message })
    }

    error(message) {
        Message.error({ title: this.title, message })
    }

    info(message) {
        Message.info({ title: this.title, message })
    }
    
    warning(message) {
        Message.warning({ title: this.title, message })
    }
}
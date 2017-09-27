import io from 'socket.io-client';
import config from '@/config'

export class Socket {
    constructor(url) {
        url = config.url + url
        this.socket = io(url)
    }
}
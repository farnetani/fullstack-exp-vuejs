import axios from 'axios'
import config from '@/config'

export class MyApi {
    token = false

    constructor(url, not, token = false) {
        this.url = url
        this.token = token
        this.not = not
    }

    getApi () {
        //Verifica se a sessão vai usar um token
        let headers = { 'Content-Type': 'application/json' }
        if(this.token) headers['x-access-token'] = localStorage.getItem('token')
        
        return axios.create({
            baseURL: config.url + this.url,
            transformRequest: [(data) => JSON.stringify(data)],
            headers
        })
    }

    get(url = '') {
        return new Promise((resolve, reject) => {
            this.getApi().get(url).then(response => {
                resolve(response.data)
            }).catch(err => {
                reject(err.response.data.data)
                this.not.error(err.response.data.message)
            })  
        })
    }

    delete(url = '') {
        return new Promise((resolve, reject) => {
            this.getApi().delete(url).then(response => {
                resolve(response.data)
            }).catch(err => {
                reject(err.response.data.data)
                this.not.error(err.response.data.message)
            })  
        })
    }

    post(data, url = '') {
        return new Promise((resolve, reject) => {
            this.getApi().post(url, data).then(response => {
                resolve(response.data)
            }).catch(err => {
                reject(err.response.data.data) 
                this.not.error(err.response.data.message)
            })  
        })
    }

    put(data, url = '') {
        return new Promise((resolve, reject) => {
            this.getApi().put(url, data).then(response => {
                resolve(response.data)
            }).catch(err => {
                reject(err.response.data.data)
                this.not.error(err.response.data.message)
            })  
        })
    }
}
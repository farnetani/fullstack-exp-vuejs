import * as jwt from 'jwt-simple'

class Auth {
    protected secret: string;

    constructor() {
        this.secret = '7iote3p@77kyzgzf';
    }

    newToken(id) {
        let token: string, refresh: string
        let expira = new Date().getTime() + (15 * 60 * 1000)
        token = jwt.encode({ id, expira }, this.secret)
        refresh = jwt.encode({ jwt: token }, this.secret)

        return { token, refresh, expira }
    }

    decode(token) {
        return jwt.decode(token, this.secret)
    }

    valida(token) {
        if (!token) return false

        const decode = this.decode(token)
        if (decode.expira < Date.now()) return false
        
        return decode
    }
}

export default new Auth()
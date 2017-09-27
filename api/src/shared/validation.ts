export class Validation {
    status: Boolean
    err: any[]

    constructor(){
        this.errorClean()
    }

    protected errorClean() {
        this.status = true
        this.err = []
    }

    private isEmpty(dados, field: string) {
        if(typeof(dados) == 'undefined')
        return true

        if(typeof(dados[field]) == 'undefined')
        return true

        if(dados[field] == null || (dados[field] == '' && typeof(dados[field]) != "boolean"))
        return true

        return false
    }

    protected forIsEmpty(dados, fields: string[]){
        fields.forEach(item => {
            if(this.isEmpty(dados, item)) {
                this.status = false
                this.err.push(new Error(`Campo ${item} não pode ser vazio!`)) 
            }
        })
    }

    protected response() {
        return {
            status: this.status, 
            err: this.err
        }
    }
}
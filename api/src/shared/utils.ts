import * as uaParser from 'ua-parser-js'

class Utils {

    getClientInfo(req) {
        let { browser, engine, os, device } = uaParser(req.headers['user-agent'])
        let ip = (req.headers['x-forwarded-for'] || '').split(',')[0] || req.connection.remoteAddress
        //Trata variaveis
        device = device.model || 'Desktop'
        browser = { name: browser.name, version: browser.version }
        engine = { name: engine.name, version: engine.version }
        os = { name: os.name, version: os.version }
        return {device, ip, browser, engine, os}
    }

    removerAcentos(newStringComAcento) {
        var string = newStringComAcento
        var mapaAcentosHex = {
            a: /[\xE0-\xE6]/g,
            e: /[\xE8-\xEB]/g,
            i: /[\xEC-\xEF]/g,
            o: /[\xF2-\xF6]/g,
            u: /[\xF9-\xFC]/g,
            c: /\xE7/g,
            n: /\xF1/g
        }

        for (var letra in mapaAcentosHex) {
            var expressaoRegular = mapaAcentosHex[letra]
            string = string.replace(expressaoRegular, letra)
        }

        return string
    }

    stringDate(valor: string): Date{
        if(!valor) return null
        //Data com hora
        if(valor.includes(':')){
            let from = valor.split(' ')
            let data = from[0].split('/')
            if(data.length == 2){
                data = ['01', data[0], data[1]]
            }
            let hora = from[1].split(':') 
            return new Date(parseInt(data[2]), parseInt(data[1]) - 1, parseInt(data[0]), parseInt(hora[0]), parseInt(hora[1]))
        }
        //Data sem hora
        let from: string[] = valor.split('/')
        if(from.length == 2){
            from = ['01', from[0], from[1]]
        }
        return new Date(parseInt(from[2]), parseInt(from[1]) - 1, parseInt(from[0]))
    }

    stringFloat(valor: string): Number{
        let item = valor.replace(',', '.')
        return parseFloat(item)
    }

}

export default new Utils()
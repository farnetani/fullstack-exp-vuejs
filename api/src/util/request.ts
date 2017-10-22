import * as jwt from 'jwt-simple'
import * as uaParser from 'ua-parser-js'

export function newToken (secret, usuario) {
  let token: string, refresh: string
  let expira = new Date().getTime() + (10 * 60 * 1000)
  let inicia = expira - (5 * 60 * 1000)
  token = jwt.encode({ id: usuario, expira }, secret)
  refresh = jwt.encode({ id: usuario, inicia }, secret)

  return { token, refresh, expira }
}

export function validaRefresh (secret, token) {
  if (!token) return false
  try{
    const decode = jwt.decode(token, secret)
    if(!decode.id) return false
    if (decode.inicia > new Date().getTime()) return false

    return decode
  } catch (e) {
    return false
  }
}

export function getClientInfo (req) {
  let { browser, engine, os, device } = uaParser(req.headers['user-agent'])
  let ip = (req.headers['x-forwarded-for'] || '').split(',')[0] || req.connection.remoteAddress
  //Trata variaveis
  device = device.model || 'Desktop'
  browser = { name: browser.name, version: browser.version }
  engine = { name: engine.name, version: engine.version }
  os = { name: os.name, version: os.version }
  return { device, ip, browser, engine, os }
}
let config = {
    strict: false,
    url: 'http://192.168.15.51:3000'
}

if(process.env.NODE_ENV !== 'production') {
    config.strict = true
    config.strict = 'http://192.168.15.51:3000'
}

export default config
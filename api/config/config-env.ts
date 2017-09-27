class ConfigEnv {
    public env: string = 'development';
	public db: string = 'mongodb://192.168.15.51/tasklist';
	public port: number = 3000;
	public address: string = '192.168.15.51';
    public domain: string = '192.168.15.51:3000';
    
    constructor (){
        if(process.env.NODE_ENV == 'production'){
            this.env = "production";
            this.db  = "mongodb://tasklist:Vf4uxuka@127.0.0.1:27017/tasklist";
            this.port = 1337;
            this.env = "127.0.0.1";
            this.env = "127.0.0.1:1337";
        }
    }
}

export default new ConfigEnv();
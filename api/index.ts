import * as http from 'http'
import * as cluster from 'cluster';
import * as os from 'os';

//Módulos de configurações
import ConfigEnv from './config/config-env'
import Server from './config/server'
import { MongoConfig } from './config/mongo-config'

//Seta a porta do app
Server.app.set('port', ConfigEnv.port)

//Inicia a conexão com os bancos de dados
new MongoConfig(ConfigEnv.mongoUrl)

if(cluster.isMaster){
  var numCpus = os.cpus().length;
  for(var i=0; i<numCpus; i+=1){
    cluster.fork();
  }
}else{
  //Create server and listening port
  const s = http.createServer(Server.app)
  s.listen(ConfigEnv.port, ConfigEnv.address, function(){
    console.log('Aplicação '+ ConfigEnv.address +' (' + ConfigEnv.env + '), cluster '+cluster.worker.id+', escutando na porta ' + ConfigEnv.port);
  });
}
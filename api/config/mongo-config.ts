import * as mongoose from 'mongoose'

export class MongoConfig {
  constructor(uriDb: string){
    //MongoDB
    mongoose.connect(uriDb, { useMongoClient: true })
  }
}
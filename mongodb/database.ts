import {MongoClient} from "mongodb";
import nextConnect from "next-connect";
const connectionString = "mongodb://127.0.0.1:27017";
const client = new MongoClient(connectionString);

async function database(req: any, res: any, next: any) {
  await client.connect();
  req.dbClient = client;
  req.db = client.db("aem");
  return next();
}

// const isConnected = ()=>{
//     return !!client && !!client.db && client.topology.isConnected()
// }

const middleware = nextConnect();

middleware.use(database);

export default middleware;

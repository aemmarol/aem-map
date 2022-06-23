import {MongoClient} from "mongodb";
import nextConnect from "next-connect";
const connectionString =
  "mongodb+srv://" +
  process.env.NEXT_PUBLIC_MONGODB_USERNAME +
  ":" +
  process.env.NEXT_PUBLIC_MONGODB_PASSWORD +
  "@" +
  process.env.NEXT_PUBLIC_MONGODB_HOST +
  "/?retryWrites=true&w=majority";

console.log("con", connectionString);

const client = new MongoClient(connectionString);

async function database(req: any, res: any, next: any) {
  const newCon = await client.connect();
  req.db = newCon.db(process.env.NEXT_PUBLIC_MONGODB_DBNAME);
  return next();
}

const middleware = nextConnect();

middleware.use(database);

export default middleware;

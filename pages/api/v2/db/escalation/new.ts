import nextConnect from "next-connect";
import {escalationCollectionName} from "../../../../../firebase/dbCollectionNames";
import middleware from "../../../../../mongodb/database";
import {InsertOneResult} from "mongodb";

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req: any, res: any) => {
  const doc: InsertOneResult = await req.db
    .collection(escalationCollectionName)
    .insertOne(JSON.parse(req.body));
  res.json(doc.acknowledged);
});

export default handler;

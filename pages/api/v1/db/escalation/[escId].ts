import nextConnect from "next-connect";
import {escalationCollectionName} from "../../../../../firebase/dbCollectionNames";
import middleware from "../../../../../mongodb/database";
import {UpdateResult} from "mongodb";

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req: any, res: any) => {
  console.log(req.query.escId, "REQUEST");
  const doc = await req.db
    .collection(escalationCollectionName)
    .findOne({id: req.query.escId});

  res.json(doc);
});

handler.put(async (req: any, res: any) => {
  const doc: UpdateResult = await req.db
    .collection(escalationCollectionName)
    .updateOne({id: req.query.escId}, {$set: JSON.parse(req.body)});

  res.json(doc.acknowledged);
});

export default handler;

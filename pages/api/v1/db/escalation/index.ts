import nextConnect from "next-connect";
import {escalationCollectionName} from "../../../../../firebase/dbCollectionNames";
import middleware from "../../../../../mongodb/database";

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req: any, res: any) => {
  const doc = await req.db
    .collection(escalationCollectionName)
    .find()
    .toArray();
  res.json(doc);
});

handler.post(async (req: any, res: any) => {
  const doc = await req.db
    .collection(escalationCollectionName)
    .find(req.body.query)
    .toArray();
  res.json(doc);
});

export default handler;
